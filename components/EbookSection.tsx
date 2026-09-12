import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import BookCover from "@/components/BookCover";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { EBOOK } from "@/lib/ebook";
import { formatCurrency } from "@/lib/utils";

const incluye = [
  `${EBOOK.chapters.length} capítulos de ginecología, reproducción e infertilidad`,
  "Escrito para residentes, ginecólogos y estudiantes de medicina",
  `${EBOOK.pages} páginas en PDF, con acceso inmediato tras confirmar el pago`,
  "Pago por Zelle o Pago Móvil",
];

export default function EbookSection() {
  return (
    <section id="ebook" className="bg-cream py-24 lg:py-32" aria-labelledby="ebook-heading">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeading
          label="Publicación"
          headingId="ebook-heading"
          title={EBOOK.title}
          lead={EBOOK.subtitle}
        />

        <Reveal delay={60}>
          <div className="card mt-16 overflow-hidden lg:mt-20">
            <div className="grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-16 lg:p-14">
              {/* Portada */}
              <div className="relative flex justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 bottom-4 top-10 rounded-full bg-blush blur-2xl"
                />
                <BookCover className="relative rotate-[-3deg] transition-transform duration-500 hover:rotate-0" />
              </div>

              {/* Detalle */}
              <div>
                <p className="text-[16.5px] leading-[1.78] text-plum-soft">
                  Un manual de consulta rápida escrito por la Dra. Hilda Mary Díaz y
                  colaboradores. Fisiología, diagnóstico y manejo en reproducción e
                  infertilidad, ordenados para resolver durante la consulta.
                </p>

                <ul className="mt-8 space-y-3.5">
                  {incluye.map((linea) => (
                    <li key={linea} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blush text-magenta"
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className="text-[14.5px] leading-snug text-plum-soft">
                        {linea}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-line pt-8">
                  <div>
                    <p className="eyebrow text-mauve">Precio</p>
                    <p className="display tnum mt-1.5 text-[2.5rem] leading-none text-magenta">
                      {formatCurrency(EBOOK.priceUsd)}
                    </p>
                  </div>

                  <Link href="/ebook" className="btn btn-primary group ml-auto">
                    Obtener el manual
                    <ArrowRight
                      size={17}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
