import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldCheck, Download, Users } from "lucide-react";
import BookCover from "@/components/BookCover";
import CheckoutForm from "./CheckoutForm";
import { EBOOK } from "@/lib/ebook";
import { formatCurrency } from "@/lib/utils";
import { getEuroBcvRate, usdToBs, type BcvRate } from "@/lib/bcv";

export const metadata: Metadata = {
  title: `${EBOOK.title} · Ebook — Dra. Hilda Díaz`,
  description: EBOOK.subtitle,
};

// La tasa se cachea 1h dentro de getEuroBcvRate (fetch revalidate).
export const revalidate = 3600;

export default async function EbookPage() {
  let rate: BcvRate | null = null;
  try {
    rate = await getEuroBcvRate();
  } catch {
    rate = null; // El checkout muestra un aviso y permite continuar.
  }
  const amountBs = rate ? usdToBs(EBOOK.priceUsd, rate.rate) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Barra superior simple */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#f06292]"
          >
            <ArrowLeft size={16} />
            Volver al sitio
          </Link>
          <a
            href="#comprar"
            className="rounded-full bg-[#f06292] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ec407a]"
          >
            Comprar · {formatCurrency(EBOOK.priceUsd)}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-rose-50/60 to-white">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <BookCover className="rotate-[-3deg]" />
              <span className="absolute -right-3 -top-3 rotate-6 rounded-full bg-[#f06292] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-300">
                {formatCurrency(EBOOK.priceUsd)}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#f06292]">
              <BookOpen size={16} />
              {EBOOK.edition}
            </p>
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {EBOOK.title}
            </h1>
            <p className="mt-4 text-gray-500">{EBOOK.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <BookOpen size={16} className="text-[#f06292]" />
                {EBOOK.chapters.length} capítulos
              </span>
              <span className="inline-flex items-center gap-2">
                <Download size={16} className="text-[#f06292]" />
                Descarga digital (PDF)
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#f06292]" />
                Pago verificado por la doctora
              </span>
            </div>

            <a
              href="#comprar"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f06292] px-8 py-4 font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-[#ec407a]"
            >
              Obtener el manual · {formatCurrency(EBOOK.priceUsd)}
            </a>
          </div>
        </div>
      </section>

      {/* CONTENIDO / TEMARIO */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Qué encontrarás dentro
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Un recorrido completo por la fisiología, el diagnóstico y el manejo
            en ginecología, reproducción e infertilidad.
          </p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#f06292]" />
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EBOOK.chapters.map((c, i) => (
            <li
              key={c}
              className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white p-4 text-sm text-gray-700 shadow-sm"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 text-xs font-bold text-[#be185d]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* AUTORES */}
      <section className="bg-rose-50/50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-center gap-3">
            <Users size={22} className="text-[#f06292]" />
            <h2 className="text-2xl font-bold text-gray-900">Autores</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EBOOK.authors.map((a) => (
              <div
                key={a}
                className="rounded-xl border border-rose-100 bg-white p-5 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-[#be185d]">
                  {a
                    .replace(/^Dra?\.?\s+/, "")
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="text-sm font-semibold text-gray-800">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPRA / CHECKOUT */}
      <section id="comprar" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Completa tu compra
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-500">
            Realiza el pago por Zelle o Pago Móvil, sube tu comprobante y la
            doctora verificará tu pago para enviarte el manual por correo.
          </p>
        </div>

        <CheckoutForm rate={rate} amountBs={amountBs} />
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        Consultorio Dra. Hilda Mary Díaz García · Maturín, Venezuela
      </footer>
    </div>
  );
}
