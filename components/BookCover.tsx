import Image from "next/image";
import { EBOOK } from "@/lib/ebook";

/**
 * Portada del ebook compuesta en CSS: magenta de marca, filete rosa y el
 * símbolo del logo como sello. Sin imagen de portada real todavía.
 */
export default function BookCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[3/4] w-full max-w-[300px] ${className}`}
      aria-hidden="true"
    >
      {/* Canto del bloque de páginas */}
      <div className="absolute inset-y-1.5 -right-1.5 w-3 rounded-r-md bg-white shadow-soft" />
      <div className="absolute inset-y-3 -right-3 w-2 rounded-r-md bg-blush" />

      {/* Tapa */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-l-md rounded-r-2xl bg-magenta shadow-lift">
        {/* Lomo */}
        <div className="absolute inset-y-0 left-0 w-2.5 bg-black/20" />
        <div className="absolute inset-y-0 left-2.5 w-px bg-white/20" />

        {/* Veladura */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rose/35 blur-2xl" />

        <div className="relative flex flex-1 flex-col px-7 py-8 pl-9">
          <p className="eyebrow text-[9px] text-on-dark-soft">{EBOOK.edition}</p>

          <span className="mt-6 grid h-14 w-14 place-items-center rounded-full bg-white p-2">
            <Image
              src="/brand/mark.png"
              alt=""
              width={512}
              height={512}
              className="h-full w-full object-contain"
            />
          </span>

          <h3 className="display mt-6 text-[1.625rem] leading-[1.12] text-on-dark">
            {EBOOK.title}
          </h3>

          <p className="mt-3 text-[11.5px] leading-relaxed text-on-dark-soft">
            Ginecología · Reproducción · Infertilidad
          </p>

          <div className="mt-auto">
            <div className="h-0.5 w-12 rounded-full bg-rose-pale" />
            <p className="mt-4 text-[11.5px] font-semibold leading-snug text-on-dark">
              Dra. Hilda Mary Díaz
            </p>
            <p className="text-[11.5px] leading-snug text-on-dark-soft">y colaboradores</p>
          </div>
        </div>
      </div>
    </div>
  );
}
