import { BookOpen } from "lucide-react";
import {
  createEbookServiceClient,
  PROOFS_BUCKET,
} from "@/lib/supabase/ebook";
import type { EbookOrder } from "@/lib/types";
import OrdersList, { type OrderWithProof } from "./OrdersList";

export const dynamic = "force-dynamic";

export default async function EbookAdminPage() {
  const supabase = createEbookServiceClient();
  const { data, error } = await supabase
    .from("ebook_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as EbookOrder[];

  // Enlace firmado (1h) para mostrar cada comprobante en el panel.
  const withProof: OrderWithProof[] = await Promise.all(
    orders.map(async (o) => {
      let proofUrl: string | null = null;
      if (o.proof_path) {
        const { data: signed } = await supabase.storage
          .from(PROOFS_BUCKET)
          .createSignedUrl(o.proof_path, 60 * 60);
        proofUrl = signed?.signedUrl ?? null;
      }
      return { ...o, proofUrl };
    })
  );

  const pendientes = withProof.filter((o) => o.status === "pendiente").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f06292]/40 bg-[#f06292]/20">
          <BookOpen className="text-[#f06292]" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Ventas del Ebook</h1>
          <p className="text-sm text-slate-400">
            {pendientes > 0
              ? `${pendientes} ${pendientes === 1 ? "compra pendiente" : "compras pendientes"} por verificar`
              : "Sin compras pendientes"}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          No se pudieron cargar las órdenes. Verifica la conexión con el Supabase
          del ebook y que la tabla <code>ebook_orders</code> exista.
        </div>
      ) : (
        <OrdersList orders={withProof} />
      )}
    </div>
  );
}
