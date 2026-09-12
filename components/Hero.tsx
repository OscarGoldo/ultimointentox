"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, ArrowDown } from "lucide-react";
import { FOTOS } from "@/lib/fotos";

const credenciales = [
  { cifra: "20+", detalle: "años de ejercicio" },
  { cifra: "UDO", detalle: "Médico cirujano" },
  { cifra: "UNIFERTES", detalle: "Subespecialidad" },
];

export default function Hero() {
  const retrato = FOTOS.dePie;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-[104px] pb-20 sm:pt-[120px] lg:pt-[168px] lg:pb-28"
      aria-labelledby="hero-heading"
    >
      {/* Veladuras cálidas de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-[560px] w-[560px] rounded-full bg-blush opacity-70 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 top-72 h-[420px] w-[420px] rounded-full bg-sky/25 blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Texto */}
          <div>
            <h1
              id="hero-heading"
              className="display text-[2.625rem] sm:text-[3.5rem] lg:text-[4.125rem]"
            >
              Cuidar de ti en cada{" "}
              <em className="not-italic text-magenta">etapa de tu vida</em>
            </h1>

            <p className="mt-7 max-w-xl text-[17.5px] leading-[1.75] text-plum-soft">
              Soy la <strong className="font-semibold text-plum">Dra. Hilda Mary Díaz García</strong>,
              ginecóloga, obstetra y especialista en fertilidad. Más de 20 años
              acompañando mujeres en Maturín, Monagas y el oriente venezolano.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="https://ozmedical.app/reservar/hildadiaz"
                aria-label="Agendar una cita con la Dra. Hilda Díaz"
                className="btn btn-primary w-full sm:w-auto"
              >
                <Phone size={17} strokeWidth={2} aria-hidden="true" />
                Agendar mi cita
              </Link>

              <a
                href="#servicios"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-outline group w-full sm:w-auto"
              >
                Ver servicios
                <ArrowDown
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </a>
            </div>

            {/* Credenciales */}
            <dl className="mt-12 flex flex-wrap items-start gap-x-10 gap-y-6">
              {credenciales.map(({ cifra, detalle }) => (
                <div key={cifra}>
                  <dt className="display-md tnum text-[1.625rem] text-magenta">{cifra}</dt>
                  <dd className="mt-1 text-[13px] text-mauve">{detalle}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Retrato en arco, en su proporción real (828×1013): sin recorte */}
          <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
            <div
              aria-hidden="true"
              className="arch absolute -inset-3 border border-line-strong sm:-inset-4"
            />

            <div className="arch relative shadow-lift">
              <Image
                src={retrato.src}
                alt={retrato.alt}
                width={retrato.width}
                height={retrato.height}
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="h-auto w-full"
              />
            </div>

            {/* Tarjeta de ubicación */}
            <div className="card absolute -bottom-5 -left-2 flex items-center gap-3 px-5 py-4 sm:-left-6">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush text-magenta"
              >
                <MapPin size={17} strokeWidth={2} />
              </span>
              <span className="text-[13px] leading-snug">
                <span className="block font-semibold text-plum">Clínica Tierra Santa</span>
                <span className="block text-mauve">Piso 3, Consultorio 3 · Maturín</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
