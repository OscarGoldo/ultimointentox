"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, GraduationCap, Stethoscope, FlaskConical, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { FOTOS, GALERIA, type Foto } from "@/lib/fotos";

const formacion = [
  {
    icon: GraduationCap,
    titulo: "Médico Cirujano",
    institucion: "Universidad de Oriente (UDO)",
    detalle: "Ciudad Bolívar, Venezuela",
  },
  {
    icon: Stethoscope,
    titulo: "Especialista en Ginecología y Obstetricia",
    institucion: "Colegio de Médicos N.º 1947",
    detalle: "Maturín, Venezuela",
  },
  {
    icon: FlaskConical,
    titulo: "Subespecialista en Fertilidad y Reproducción",
    institucion: "UNIFERTES — Clínica El Ávila",
    detalle: "Caracas, Venezuela",
  },
];

const valores = [
  "Atención personalizada y empática",
  "Tecnología médica de vanguardia",
  "Confidencialidad absoluta",
  "Seguimiento continuo de cada paciente",
];

export default function About() {
  const [lightbox, setLightbox] = useState<Foto | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section id="sobre-mi" className="bg-blush py-24 lg:py-32" aria-labelledby="about-heading">
      {/* Visor de imagen */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-plum/90 p-5 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Cerrar imagen"
            className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-3xl">
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={lightbox.width}
              height={lightbox.height}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center text-[13px] text-on-dark-soft">
              {lightbox.alt}
            </figcaption>
          </figure>
        </div>
      )}

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeading
          label="Sobre mí"
          headingId="about-heading"
          title="Veinte años dedicados a la salud de la mujer"
          lead="Desde la adolescencia hasta la menopausia, acompañando cada etapa con cercanía y criterio clínico."
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Fotos: cada una en su proporción real */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <div className="photo shadow-lift">
                <Image
                  src={FOTOS.conBebe.src}
                  alt={FOTOS.conBebe.alt}
                  width={FOTOS.conBebe.width}
                  height={FOTOS.conBebe.height}
                  sizes="(max-width: 1024px) 92vw, 560px"
                  className="h-auto w-full"
                />
              </div>

              {/* Segunda foto, desplazada, también sin recorte */}
              <div className="photo absolute -bottom-10 -right-4 w-[42%] border-4 border-blush shadow-lift sm:-right-8">
                <Image
                  src={FOTOS.reciénNacida.src}
                  alt={FOTOS.reciénNacida.alt}
                  width={FOTOS.reciénNacida.width}
                  height={FOTOS.reciénNacida.height}
                  sizes="30vw"
                  className="h-auto w-full"
                />
              </div>

              <div className="card absolute -left-3 top-8 px-5 py-4 sm:-left-7">
                <p className="display tnum text-[2rem] text-magenta">20+</p>
                <p className="text-[12.5px] leading-snug text-mauve">
                  años de
                  <br />
                  experiencia
                </p>
              </div>
            </div>
          </Reveal>

          {/* Texto */}
          <div className="mt-16 lg:mt-0">
            <Reveal>
              <p className="text-[17px] leading-[1.78] text-plum-soft">
                La <strong className="font-semibold text-plum">Dra. Hilda Mary Díaz García</strong>{" "}
                es especialista en Ginecología, Obstetricia y Fertilidad con más de 20
                años de trayectoria en Maturín, Venezuela. Su consultorio es
                referencia para mujeres de toda la región de Monagas.
              </p>
              <p className="mt-5 text-[17px] leading-[1.78] text-plum-soft">
                Su vocación de servicio y una formación académica sólida la han
                posicionado como una referencia de confianza en atención obstétrica y
                en fertilidad en el oriente venezolano, incluyendo los retos del
                embarazo y la reproducción asistida.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <h3 className="display-md mt-12 text-[1.5rem]">Formación académica</h3>
              <ul className="mt-6 space-y-4">
                {formacion.map(({ icon: Icon, titulo, institucion, detalle }) => (
                  <li key={titulo} className="card card-hover flex gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-magenta"
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </span>
                    <span>
                      <span className="block font-semibold text-plum">{titulo}</span>
                      <span className="mt-0.5 block text-[13.5px] text-plum-soft">
                        {institucion}
                      </span>
                      <span className="block text-[12.5px] text-mauve">{detalle}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140}>
              <h3 className="display-md mt-12 text-[1.5rem]">Mi compromiso contigo</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {valores.map((valor) => (
                  <li key={valor} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-magenta text-white"
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="text-[14.5px] leading-snug text-plum-soft">{valor}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Galería en mosaico: cada foto conserva su alto natural */}
        <Reveal className="mt-24 lg:mt-28">
          <div className="mb-8 text-center">
            <h3 className="display text-[1.875rem] sm:text-[2.25rem]">
              Momentos del consultorio
            </h3>
            <p className="mt-3 text-[14.5px] text-mauve">Toca una foto para ampliarla</p>
          </div>

          <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>li]:mb-4">
            {GALERIA.map((foto) => (
              <li key={foto.src} className="break-inside-avoid">
                <button
                  onClick={() => setLightbox(foto)}
                  aria-label={`Ampliar: ${foto.alt}`}
                  className="photo group block w-full cursor-zoom-in shadow-soft transition-shadow hover:shadow-lift"
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    width={foto.width}
                    height={foto.height}
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 280px"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
