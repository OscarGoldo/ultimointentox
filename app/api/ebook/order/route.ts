import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  createEbookServiceClient,
  PROOFS_BUCKET,
} from "@/lib/supabase/ebook";
import { getEuroBcvRate, usdToBs, formatBs } from "@/lib/bcv";
import { EBOOK } from "@/lib/ebook";
import type { EbookPaymentMethod } from "@/lib/types";

const DOCTOR_EMAILS = "hildadiaz.69@gmail.com, oscarvalery10@gmail.com";

const METHOD_LABELS: Record<EbookPaymentMethod, string> = {
  zelle: "Zelle",
  pago_movil: "Pago Móvil",
};

interface Body {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string | null;
  payment_method?: EbookPaymentMethod;
  payment_reference?: string | null;
  proof_path?: string | null;
}

function transporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const name = (body.customer_name ?? "").trim();
    const email = (body.customer_email ?? "").trim();
    const method = body.payment_method;
    const proofPath = body.proof_path ?? null;

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (method !== "zelle" && method !== "pago_movil") {
      return NextResponse.json({ error: "Método inválido" }, { status: 400 });
    }
    if (!proofPath) {
      return NextResponse.json(
        { error: "Falta el comprobante" },
        { status: 400 }
      );
    }

    // Monto: precio en USD fijo; en Pago Móvil calculamos Bs con tasa euro BCV.
    let amountBs: number | null = null;
    let bcvRate: number | null = null;
    if (method === "pago_movil") {
      try {
        const r = await getEuroBcvRate();
        bcvRate = r.rate;
        amountBs = usdToBs(EBOOK.priceUsd, r.rate);
      } catch {
        // Si falla la tasa, guardamos la orden igual; la doctora ajusta manual.
      }
    }

    const supabase = createEbookServiceClient();
    const { data: order, error } = await supabase
      .from("ebook_orders")
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: body.customer_phone || null,
        payment_method: method,
        amount_usd: EBOOK.priceUsd,
        amount_bs: amountBs,
        bcv_rate: bcvRate,
        payment_reference: body.payment_reference || null,
        proof_path: proofPath,
        status: "pendiente",
      })
      .select("id")
      .single();

    if (error || !order) {
      console.error("Error insertando orden ebook:", error);
      return NextResponse.json(
        { error: "No se pudo registrar tu compra" },
        { status: 500 }
      );
    }

    // Enlace firmado al comprobante para el correo de la doctora (24h).
    let proofUrl = "";
    try {
      const { data: signed } = await supabase.storage
        .from(PROOFS_BUCKET)
        .createSignedUrl(proofPath, 60 * 60 * 24);
      proofUrl = signed?.signedUrl ?? "";
    } catch {
      /* sin enlace; la doctora lo ve en el panel */
    }

    // Correos (no bloquean la respuesta si fallan).
    try {
      await sendEmails({
        origin: req.nextUrl.origin,
        orderId: order.id,
        name,
        email,
        phone: body.customer_phone || "",
        method,
        amountBs,
        reference: body.payment_reference || "",
        proofUrl,
      });
    } catch (e) {
      console.error("Error enviando correos de compra:", e);
    }

    return NextResponse.json({ orderId: order.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

async function sendEmails(opts: {
  origin: string;
  orderId: string;
  name: string;
  email: string;
  phone: string;
  method: EbookPaymentMethod;
  amountBs: number | null;
  reference: string;
  proofUrl: string;
}) {
  const t = transporter();
  if (!t) {
    console.warn("SMTP no configurado — se omiten correos");
    return;
  }
  const from = process.env.SMTP_USER!;
  const methodLabel = METHOD_LABELS[opts.method];
  const montoLinea =
    opts.method === "pago_movil" && opts.amountBs !== null
      ? `$${EBOOK.priceUsd} · ${formatBs(opts.amountBs)}`
      : `$${EBOOK.priceUsd}`;

  // Correo al comprador — "recibido, en verificación"
  await t.sendMail({
    from: `"Dra. Hilda Díaz · Ebook" <${from}>`,
    to: opts.email,
    subject: "Recibimos tu pago — verificando tu compra del manual",
    html: `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
  <tr><td align="center" bgcolor="#f06292" style="padding:40px 32px">
    <span style="font-size:24px;font-weight:700;color:#fff">¡Gracias por tu compra!</span><br><br>
    <span style="font-size:14px;color:#fce7f3">Estamos verificando tu pago</span>
  </td></tr>
  <tr><td bgcolor="#ffffff" style="padding:32px">
    <p style="margin:0 0 16px;font-size:15px;color:#111827">Hola <strong>${opts.name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.7">
      Recibimos tu solicitud de compra de <strong>${EBOOK.title}</strong> (${methodLabel}, ${montoLinea}).
      La Dra. Hilda verificará tu comprobante y, una vez confirmado, te enviaremos a este mismo correo
      el <strong>enlace de descarga del manual en PDF</strong>.
    </p>
    <p style="margin:0;font-size:13px;color:#9ca3af">Normalmente se confirma en pocas horas hábiles. Si tienes dudas, responde a este correo.</p>
  </td></tr>
  <tr><td align="center" bgcolor="#f8fafc" style="padding:18px 32px;border-top:2px solid #fce7f3">
    <span style="font-size:12px;color:#9ca3af">Dra. Hilda Mary Díaz García · Maturín, Venezuela</span>
  </td></tr>
</table></td></tr></table></body></html>`,
  });

  // Correo a la doctora — nueva compra, revisar comprobante.
  // El panel de confirmación vive en el CRM (OzMed), no en este storefront.
  const dashUrl = 'https://ozmedical.app/dashboard/ebook';
  await t.sendMail({
    from: `"Tienda Ebook" <${from}>`,
    to: DOCTOR_EMAILS,
    subject: `🛒 Nueva compra del ebook: ${opts.name}`,
    html: `<!DOCTYPE html><html lang="es"><body style="margin:0;background:#f4f4f5;font-family:Arial,sans-serif">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:#1e293b;padding:22px 26px;border-bottom:3px solid #f06292">
    <p style="margin:0;color:#f06292;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Ebook · Nueva compra</p>
    <h2 style="margin:6px 0 0;color:#fff;font-size:19px">🛒 Revisa el comprobante</h2>
  </div>
  <div style="padding:22px 26px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:38%">Cliente</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600">${opts.name}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280">Correo</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#111827">${opts.email}</td></tr>
      ${opts.phone ? `<tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280">WhatsApp</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#111827">${opts.phone}</td></tr>` : ""}
      <tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280">Método</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600">${methodLabel}</td></tr>
      <tr><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#6b7280">Monto</td><td style="padding:9px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600">${montoLinea}</td></tr>
      ${opts.reference ? `<tr><td style="padding:9px 0;color:#6b7280">Referencia</td><td style="padding:9px 0;color:#111827">${opts.reference}</td></tr>` : ""}
    </table>
    ${opts.proofUrl ? `<div style="margin-top:18px"><a href="${opts.proofUrl}" style="display:inline-block;background:#e0f2fe;color:#0369a1;text-decoration:none;font-weight:600;font-size:13px;padding:10px 16px;border-radius:8px">📎 Ver comprobante</a></div>` : ""}
    <div style="margin-top:12px"><a href="${dashUrl}" style="display:inline-block;background:#f06292;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px">Confirmar o rechazar en el panel →</a></div>
  </div>
</div></body></html>`,
  });
}
