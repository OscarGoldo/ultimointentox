"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Loader2, Lock, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import PaymentProofUpload from "@/components/PaymentProofUpload";
import { EBOOK, PAYMENT } from "@/lib/ebook";
import { formatCurrency } from "@/lib/utils";
import { formatBs, formatRateDate, type BcvRate } from "@/lib/bcv";
import type { EbookPaymentMethod } from "@/lib/types";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copiado");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard no disponible */
    }
  }
  return (
    <div className="flex items-center justify-between gap-2 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 font-semibold text-gray-800 hover:text-[#f06292]"
      >
        {value}
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
    </div>
  );
}

export default function CheckoutForm({
  rate,
  amountBs,
}: {
  rate: BcvRate | null;
  amountBs: number | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<EbookPaymentMethod>("zelle");
  const [reference, setReference] = useState("");
  const [proofPath, setProofPath] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Ingresa tu nombre");
    if (!isValidEmail)
      return toast.error("Ingresa un correo válido (ahí recibirás el manual)");
    if (!proofPath) return toast.error("Sube la foto de tu comprobante de pago");

    setSubmitting(true);
    try {
      const res = await fetch("/api/ebook/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim() || null,
          payment_method: method,
          payment_reference: reference.trim() || null,
          proof_path: proofPath,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) {
        throw new Error(data.error || "No se pudo registrar tu compra");
      }
      router.push(`/ebook/gracias/${data.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start"
    >
      {/* Columna principal */}
      <div className="space-y-5">
        {/* Datos del comprador */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-gray-900">Tus datos</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nombre y apellido *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María Pérez"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#f06292] focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Correo electrónico *
              </label>
              <input
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#f06292] focus:ring-2 focus:ring-rose-100"
              />
              <p className="mt-1 text-xs text-gray-400">
                Aquí te enviaremos el enlace de descarga del manual.
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                WhatsApp (opcional)
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0424 1234567"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#f06292] focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>
        </div>

        {/* Método de pago */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-gray-900">Método de pago</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod("zelle")}
              className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
                method === "zelle"
                  ? "border-[#f06292] bg-rose-50"
                  : "border-gray-200 hover:border-rose-200"
              }`}
            >
              <Mail
                className={method === "zelle" ? "text-[#f06292]" : "text-gray-400"}
                size={18}
              />
              <span className="text-sm font-semibold text-gray-800">Zelle</span>
              <span className="text-xs text-gray-500">
                {formatCurrency(EBOOK.priceUsd)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("pago_movil")}
              className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors ${
                method === "pago_movil"
                  ? "border-[#f06292] bg-rose-50"
                  : "border-gray-200 hover:border-rose-200"
              }`}
            >
              <Smartphone
                className={
                  method === "pago_movil" ? "text-[#f06292]" : "text-gray-400"
                }
                size={18}
              />
              <span className="text-sm font-semibold text-gray-800">
                Pago Móvil
              </span>
              <span className="text-xs text-gray-500">
                {amountBs !== null ? formatBs(amountBs) : "en bolívares"}
              </span>
            </button>
          </div>

          {/* Datos del método seleccionado */}
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4">
            {method === "zelle" ? (
              <>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#be185d]">
                  Envía {formatCurrency(EBOOK.priceUsd)} por Zelle a:
                </p>
                <div className="divide-y divide-rose-100">
                  <CopyRow label="Correo Zelle" value={PAYMENT.zelle.email} />
                  <CopyRow label="Titular" value={PAYMENT.zelle.holder} />
                </div>
              </>
            ) : (
              <>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#be185d]">
                  Paga por Pago Móvil:
                </p>
                <div className="divide-y divide-rose-100">
                  <CopyRow label="Banco" value={PAYMENT.pagoMovil.banco} />
                  <CopyRow label="Teléfono" value={PAYMENT.pagoMovil.telefono} />
                  <CopyRow label="Cédula" value={PAYMENT.pagoMovil.cedula} />
                  <div className="flex items-center justify-between gap-2 py-2 text-sm">
                    <span className="text-gray-500">Monto a pagar</span>
                    <span className="font-bold text-[#be185d]">
                      {amountBs !== null ? formatBs(amountBs) : "Consultar tasa"}
                    </span>
                  </div>
                </div>
                {rate ? (
                  <p className="mt-2 text-[11px] text-gray-400">
                    Tasa BCV (euro) {formatRateDate(rate.updatedAt)}:{" "}
                    {rate.rate.toLocaleString("es-VE", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    Bs · sobre {formatCurrency(EBOOK.priceUsd)}
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-amber-600">
                    No pudimos cargar la tasa del día. Escríbenos por WhatsApp
                    para confirmar el monto exacto en bolívares.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Comprobante */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-base font-bold text-gray-900">
            Comprobante de pago *
          </h3>
          <p className="mb-4 text-xs text-gray-400">
            Sube una foto o captura de la transferencia. La doctora la verificará
            antes de enviarte el manual.
          </p>
          <PaymentProofUpload value={proofPath} onChange={setProofPath} />
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Número de referencia (opcional)
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej. 001234567"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#f06292] focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>
      </div>

      {/* Resumen (sticky en desktop) */}
      <aside className="lg:sticky lg:top-20">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-gray-900">
            Resumen de tu compra
          </h3>
          <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#c2185b] to-[#f06292] text-white">
              <Lock className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug text-gray-800">
                {EBOOK.title}
              </p>
              <p className="text-xs text-gray-400">
                {EBOOK.edition} · PDF digital
              </p>
            </div>
          </div>
          <div className="space-y-1.5 py-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Precio</span>
              <span className="text-gray-800">
                {formatCurrency(EBOOK.priceUsd)}
              </span>
            </div>
            {method === "pago_movil" && amountBs !== null && (
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>En bolívares (Pago Móvil)</span>
                <span>{formatBs(amountBs)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(EBOOK.priceUsd)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f06292] px-6 py-3.5 font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-[#ec407a] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Confirmar compra
          </button>
          <p className="mt-3 text-center text-[11px] text-gray-400">
            Tu pago será verificado manualmente. Recibirás el manual por correo
            en cuanto se confirme.
          </p>
        </div>
      </aside>
    </form>
  );
}
