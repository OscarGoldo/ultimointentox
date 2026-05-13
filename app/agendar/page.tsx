"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { CAL_LINK } from "@/lib/booking";

export default function AgendarPage() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "booking-inline" });
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#EC4899" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <main className="min-h-screen bg-rose-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-2">
            Reserva tu turno
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Agendar Cita
          </h1>
          <p className="mt-2 text-gray-500">
            Dra. Hilda Mary Díaz García · Ginecóloga Obstetra · Maturín, Venezuela
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-rose-100">
          <Cal
            namespace="booking-inline"
            calLink={CAL_LINK}
            style={{ width: "100%", height: "700px", overflow: "scroll" }}
          />
        </div>
      </div>
    </main>
  );
}
