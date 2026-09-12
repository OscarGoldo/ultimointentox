import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, ArrowRight } from "lucide-react";
import Wordmark from "@/components/Wordmark";

const especialidades = [
  "Control Prenatal",
  "Ginecología General",
  "Fertilidad y Reproducción",
  "Planificación Familiar",
  "Colposcopia y PAP",
  "Menopausia y Climaterio",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-magenta-dark text-on-dark-soft" role="contentinfo">
      {/* Llamada final */}
      <div className="border-b border-line-dark">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-5 py-16 text-center sm:px-8 lg:flex-row lg:justify-between lg:py-20 lg:text-left">
          <div>
            <h2 className="display text-[2rem] text-on-dark sm:text-[2.5rem]">
              Tu salud es nuestra prioridad
            </h2>
            <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-on-dark-soft">
              Agenda tu consulta hoy y comienza el camino hacia tu bienestar.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="https://ozmedical.app/reservar/hildadiaz"
              className="btn btn-light group shrink-0"
            >
              Agendar cita
              <ArrowRight
                size={17}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="tel:+584120896444"
              aria-label="Llamar al consultorio"
              className="btn tnum shrink-0 border-white/30 text-white hover:bg-white/10"
            >
              <Phone size={16} strokeWidth={2} aria-hidden="true" />
              0412 089 6444
            </a>
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Wordmark tone="light" />
          <p className="mt-6 max-w-xs text-[13.5px] leading-relaxed">
            Más de 20 años dedicados a la salud de la mujer venezolana, con
            atención personalizada en Maturín, Monagas.
          </p>
          <a
            href="https://www.instagram.com/doc.hildadiaz/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de la Dra. Hilda Díaz"
            className="mt-7 inline-grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <Instagram size={17} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        <nav aria-label="Especialidades" className="lg:col-span-4">
          <h3 className="eyebrow text-on-dark">Especialidades</h3>
          <ul className="mt-5 space-y-2.5 text-[13.5px]">
            {especialidades.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h3 className="eyebrow text-on-dark">Consultorio</h3>
          <address className="mt-5 space-y-4 text-[13.5px] not-italic leading-relaxed">
            <p className="flex gap-3">
              <MapPin size={15} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Clínica Tierra Santa
                <br />
                Piso 3, Consultorio 3
                <br />
                Maturín, Monagas
              </span>
            </p>
            <p className="flex flex-col gap-2">
              <a
                href="tel:+584120896444"
                className="tnum flex items-center gap-3 text-on-dark transition-colors hover:text-white"
              >
                <Phone size={15} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                0412 089 6444
              </a>
              <a
                href="mailto:dochildadiaz@gmail.com"
                className="flex items-center gap-3 break-all text-on-dark transition-colors hover:text-white"
              >
                <Mail size={15} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                dochildadiaz@gmail.com
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Pie */}
      <div className="border-t border-line-dark">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-2 px-5 py-6 text-[11.5px] sm:flex-row sm:px-8">
          <p className="tnum">
            © {currentYear} Dra. Hilda Mary Díaz García · RIF V-10353086-1
          </p>
          <p>Maturín, Venezuela</p>
        </div>
      </div>
    </footer>
  );
}
