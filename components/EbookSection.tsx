import Link from "next/link";
import { BookOpen, Check, ArrowRight } from "lucide-react";
import BookCover from "@/components/BookCover";
import { EBOOK } from "@/lib/ebook";
import { formatCurrency } from "@/lib/utils";

const highlights = [
  `${EBOOK.chapters.length} capítulos de ginecología, reproducción e infertilidad`,
  "Escrito para residentes, ginecólogos y estudiantes de medicina",
  "Acceso digital inmediato tras confirmar tu pago",
];

export default function EbookSection() {
  return (
    <section
      id="ebook"
      className="py-20 sm:py-28 bg-gradient-to-b from-white via-rose-50/40 to-white"
      aria-labelledby="ebook-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Portada */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              <BookCover className="rotate-[-3deg] transition-transform duration-500 hover:rotate-0" />
              <span className="absolute -right-3 -top-3 rounded-full bg-[#f06292] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-300 rotate-6">
                {formatCurrency(EBOOK.priceUsd)}
              </span>
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-3">
              <BookOpen size={16} />
              Nuevo · Ebook
            </p>
            <h2
              id="ebook-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            >
              {EBOOK.title}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              {EBOOK.subtitle} Un manual de consulta rápida y confiable, fruto de
              la experiencia clínica de la Dra. Hilda Mary Díaz y colaboradores.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                    <Check size={13} className="text-[#f06292]" />
                  </span>
                  <span className="text-sm text-gray-600">{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/ebook"
                className="inline-flex items-center gap-2 bg-[#f06292] text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-rose-200 hover:bg-[#ec407a] transition-all duration-200"
              >
                Obtener el manual
                <ArrowRight size={18} />
              </Link>
              <span className="text-sm text-gray-400">
                Pago por Zelle o Pago Móvil
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
