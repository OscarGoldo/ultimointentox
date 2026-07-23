import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";
import { createEbookServiceClient } from "@/lib/supabase/ebook";
import { EBOOK } from "@/lib/ebook";
import type { EbookOrder } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function GraciasPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const supabase = createEbookServiceClient();
  const { data: order } = await supabase
    .from("ebook_orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle<EbookOrder>();

  if (!order) notFound();

  const state = {
    pendiente: {
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
      ring: "ring-amber-100",
      title: "Estamos verificando tu pago",
      body: "Recibimos tu comprobante. La Dra. Hilda lo revisará y, una vez confirmado, te enviaremos el enlace de descarga del manual a tu correo. Normalmente toma pocas horas hábiles.",
    },
    confirmada: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
      title: "¡Pago confirmado!",
      body: "Tu compra fue verificada. Te enviamos el enlace de descarga del manual a tu correo. Revisa tu bandeja de entrada (y la carpeta de spam por si acaso).",
    },
    rechazada: {
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      ring: "ring-red-100",
      title: "No pudimos verificar tu pago",
      body: "Hubo un problema al verificar tu comprobante. Por favor contáctanos por WhatsApp para resolverlo y completar tu compra.",
    },
  }[order.status];

  const Icon = state.icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50/60 to-white px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${state.bg} ring-8 ${state.ring}`}
        >
          <Icon className={`h-8 w-8 ${state.color}`} />
        </div>

        <h1 className="text-xl font-bold text-gray-900">{state.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">{state.body}</p>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tu compra
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800">{EBOOK.title}</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Mail className="h-3.5 w-3.5" />
            {order.customer_email}
          </p>
        </div>

        <p className="mt-4 text-[11px] text-gray-400">
          Orden #{order.id.slice(0, 8).toUpperCase()}
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#f06292] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
