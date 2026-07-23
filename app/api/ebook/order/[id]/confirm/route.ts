import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";
import {
  createEbookServiceClient,
  EBOOK_FILES_BUCKET,
} from "@/lib/supabase/ebook";
import { EBOOK } from "@/lib/ebook";
import type { EbookOrder } from "@/lib/types";

/** Horas de validez del enlace de descarga que recibe el cliente. */
const LINK_HOURS = 72;

function transporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

/** Verifica que quien llama es la doctora (usuario autenticado y permitido). */
async function isAuthorized(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return false;
  const allowed = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  return allowed.includes(user.email.toLowerCase());
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = (await req.json()) as { action?: "confirm" | "reject" };
  if (action !== "confirm" && action !== "reject") {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  const supabase = createEbookServiceClient();
  const { data: order } = await supabase
    .from("ebook_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle<EbookOrder>();

  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  // ── Rechazar ──────────────────────────────────────────────────────────
  if (action === "reject") {
    await supabase
      .from("ebook_orders")
      .update({ status: "rechazada" })
      .eq("id", id);

    try {
      await sendRejectionEmail(order);
    } catch (e) {
      console.error("Error enviando correo de rechazo:", e);
    }
    return NextResponse.json({ ok: true, status: "rechazada" });
  }

  // ── Confirmar + entregar ──────────────────────────────────────────────
  const { data: signed, error: signErr } = await supabase.storage
    .from(EBOOK_FILES_BUCKET)
    .createSignedUrl(EBOOK.storageKey, 60 * 60 * LINK_HOURS, {
      download: EBOOK.downloadName,
    });

  if (signErr || !signed?.signedUrl) {
    console.error("No se pudo generar el enlace del ebook:", signErr);
    return NextResponse.json(
      {
        error:
          "No se pudo generar el enlace de descarga. Verifica que el PDF esté subido al bucket 'ebook-files'.",
      },
      { status: 500 }
    );
  }

  const { error: updErr } = await supabase
    .from("ebook_orders")
    .update({ status: "confirmada", confirmed_at: new Date().toISOString() })
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  try {
    await sendDeliveryEmail(order, signed.signedUrl);
  } catch (e) {
    console.error("Error enviando correo de entrega:", e);
    return NextResponse.json(
      {
        ok: true,
        status: "confirmada",
        warning:
          "La orden se confirmó pero el correo de entrega no se pudo enviar. Revisa el SMTP.",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true, status: "confirmada" });
}

async function sendDeliveryEmail(order: EbookOrder, downloadUrl: string) {
  const t = transporter();
  if (!t) {
    console.warn("SMTP no configurado — no se envía la entrega");
    throw new Error("SMTP no configurado");
  }
  const from = process.env.SMTP_USER!;
  await t.sendMail({
    from: `"Dra. Hilda Díaz · Ebook" <${from}>`,
    to: order.customer_email,
    subject: `📘 Tu manual está listo: ${EBOOK.title}`,
    html: `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
  <tr><td align="center" bgcolor="#f06292" style="padding:40px 32px">
    <span style="font-size:24px;font-weight:700;color:#fff">¡Pago confirmado! 🎉</span><br><br>
    <span style="font-size:14px;color:#fce7f3">Aquí está tu manual</span>
  </td></tr>
  <tr><td bgcolor="#ffffff" style="padding:32px">
    <p style="margin:0 0 16px;font-size:15px;color:#111827">Hola <strong>${order.customer_name}</strong>,</p>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.7">
      Verificamos tu pago. Ya puedes descargar <strong>${EBOOK.title}</strong> (${EBOOK.edition}) en PDF
      con el siguiente botón:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="${downloadUrl}" style="display:inline-block;background:#f06292;color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:15px 34px;border-radius:12px">⬇ Descargar el manual (PDF)</a>
    </td></tr></table>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.6">
      Por seguridad, este enlace estará activo durante <strong>${LINK_HOURS} horas</strong>. Te recomendamos
      descargar y guardar el archivo en tu dispositivo. Si el enlace expira, responde a este correo y te
      enviamos uno nuevo.
    </p>
  </td></tr>
  <tr><td align="center" bgcolor="#f8fafc" style="padding:18px 32px;border-top:2px solid #fce7f3">
    <span style="font-size:12px;color:#9ca3af">Dra. Hilda Mary Díaz García · Maturín, Venezuela</span>
  </td></tr>
</table></td></tr></table></body></html>`,
  });
}

async function sendRejectionEmail(order: EbookOrder) {
  const t = transporter();
  if (!t) return;
  const from = process.env.SMTP_USER!;
  await t.sendMail({
    from: `"Dra. Hilda Díaz · Ebook" <${from}>`,
    to: order.customer_email,
    subject: "Sobre tu compra del manual — necesitamos verificar tu pago",
    html: `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
  <tr><td bgcolor="#ffffff" style="padding:32px;border-top:4px solid #f59e0b">
    <p style="margin:0 0 16px;font-size:15px;color:#111827">Hola <strong>${order.customer_name}</strong>,</p>
    <p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.7">
      No pudimos verificar el pago de tu compra de <strong>${EBOOK.title}</strong>. Esto suele deberse a un
      comprobante ilegible o a que la transferencia aún no se refleja.
    </p>
    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7">
      Por favor responde a este correo o escríbenos por WhatsApp para ayudarte a completar tu compra. 🌸
    </p>
  </td></tr>
</table></td></tr></table></body></html>`,
  });
}
