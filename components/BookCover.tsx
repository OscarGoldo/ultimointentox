import { Stethoscope } from "lucide-react";
import { EBOOK } from "@/lib/ebook";

/**
 * Portada del ebook renderizada en CSS (mockup), sin depender de una imagen.
 * Si más adelante hay una portada real, se puede reemplazar por <Image />.
 */
export default function BookCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[3/4] w-full max-w-[280px] ${className}`}
      aria-hidden="true"
    >
      {/* Sombra / profundidad */}
      <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-r-xl rounded-l-sm bg-rose-900/20 blur-xl" />

      {/* Cuerpo del libro */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-r-xl rounded-l-sm bg-gradient-to-br from-[#c2185b] via-[#d81b60] to-[#f06292] shadow-2xl ring-1 ring-black/10">
        {/* Lomo */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent" />

        <div className="flex flex-1 flex-col px-6 py-6 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-100/90">
            {EBOOK.edition}
          </p>

          <div className="mt-5 flex items-center gap-2">
            <span className="h-px flex-1 bg-white/40" />
            <Stethoscope size={20} className="text-white/90" />
            <span className="h-px flex-1 bg-white/40" />
          </div>

          <h3 className="mt-5 text-xl font-bold leading-tight">
            {EBOOK.title}
          </h3>

          <p className="mt-2.5 text-xs leading-relaxed text-rose-50/90">
            Ginecología · Reproducción · Infertilidad
          </p>

          <div className="mt-auto">
            <div className="h-px w-full bg-white/30" />
            <p className="mt-3 text-[11px] leading-snug text-rose-50/85">
              Dra. Hilda Mary Díaz
              <br />
              <span className="text-rose-100/70">y colaboradores</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
