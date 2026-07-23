"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Check,
  X,
  Loader2,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { EbookOrder, EbookOrderStatus } from "@/lib/types";
import { formatBs } from "@/lib/bcv";
import { formatCurrency } from "@/lib/utils";

export type OrderWithProof = EbookOrder & { proofUrl: string | null };

const METHOD_LABELS = { zelle: "Zelle", pago_movil: "Pago Móvil" } as const;

const STATUS_META: Record<
  EbookOrderStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    icon: Clock,
  },
  confirmada: {
    label: "Confirmada",
    className: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
    icon: CheckCircle2,
  },
  rechazada: {
    label: "Rechazada",
    className: "bg-red-400/20 text-red-300 border-red-400/30",
    icon: XCircle,
  },
};

const FILTERS: { key: "todas" | EbookOrderStatus; label: string }[] = [
  { key: "pendiente", label: "Pendientes" },
  { key: "confirmada", label: "Confirmadas" },
  { key: "rechazada", label: "Rechazadas" },
  { key: "todas", label: "Todas" },
];

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Caracas",
  }).format(new Date(iso));
}

export default function OrdersList({ orders }: { orders: OrderWithProof[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"todas" | EbookOrderStatus>("pendiente");
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible =
    filter === "todas" ? orders : orders.filter((o) => o.status === filter);

  async function act(id: string, action: "confirm" | "reject") {
    if (
      action === "reject" &&
      !confirm("¿Rechazar esta compra? Se le avisará al cliente por correo.")
    )
      return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/ebook/order/${id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      if (data.warning) toast.warning(data.warning);
      else
        toast.success(
          action === "confirm"
            ? "Pago confirmado — manual enviado por correo"
            : "Compra rechazada"
        );
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo procesar");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.key === "todas"
              ? orders.length
              : orders.filter((o) => o.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-[#f06292] text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-10 text-center text-slate-400">
          No hay órdenes en esta categoría.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((o) => {
            const meta = STATUS_META[o.status];
            const StatusIcon = meta.icon;
            const busy = busyId === o.id;
            return (
              <div
                key={o.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {o.customer_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {fmtDate(o.created_at)} · #{o.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.className}`}
                  >
                    <StatusIcon size={12} />
                    {meta.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <a
                    href={`mailto:${o.customer_email}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-[#f06292]"
                  >
                    <Mail size={14} className="flex-shrink-0 text-slate-500" />
                    <span className="truncate">{o.customer_email}</span>
                  </a>
                  {o.customer_phone && (
                    <span className="flex items-center gap-2 text-slate-300">
                      <Phone size={14} className="flex-shrink-0 text-slate-500" />
                      <span className="truncate">{o.customer_phone}</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">
                  <div className="flex-1 text-sm">
                    <p className="text-slate-400">
                      {METHOD_LABELS[o.payment_method]}
                      {o.payment_reference && (
                        <span className="text-slate-500">
                          {" "}
                          · Ref. {o.payment_reference}
                        </span>
                      )}
                    </p>
                    <p className="font-bold text-white">
                      {formatCurrency(o.amount_usd)}
                      {o.payment_method === "pago_movil" &&
                        o.amount_bs != null && (
                          <span className="ml-2 text-xs font-normal text-slate-400">
                            {formatBs(o.amount_bs)}
                          </span>
                        )}
                    </p>
                  </div>
                  {o.proofUrl ? (
                    <a
                      href={o.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/15 px-3 py-2 text-xs font-medium text-sky-300 hover:bg-sky-500/25"
                    >
                      <ExternalLink size={13} />
                      Comprobante
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600">Sin comprobante</span>
                  )}
                </div>

                {o.status === "pendiente" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => act(o.id, "confirm")}
                      disabled={busy}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {busy ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Confirmar pago
                    </button>
                    <button
                      onClick={() => act(o.id, "reject")}
                      disabled={busy}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-60"
                    >
                      <X size={16} />
                      Rechazar
                    </button>
                  </div>
                )}

                {o.status === "confirmada" && o.confirmed_at && (
                  <p className="mt-3 text-xs text-emerald-400/80">
                    Confirmada y enviada el {fmtDate(o.confirmed_at)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
