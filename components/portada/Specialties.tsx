"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FOTOS, type Foto } from "@/lib/fotos";

type Area = {
  titulo: string;
  frase: string;
  servicios: string[];
  enlace: { href: string; texto: string };
  foto: Foto;
};

const AREAS: Area[] = [
  {
    titulo: "Ginecología",
    frase: "Tu revisión de cada año y lo que no puede esperar a ella.",
    servicios: [
      "Revisión anual y Papanicolaou",
      "Colposcopia",
      "Ecografía ginecológica",
      "Planificación familiar y DIU",
      "Menopausia y climaterio",
      "Biopsias y procedimientos ambulatorios",
    ],
    enlace: { href: "/ginecologo-en-maturin", texto: "Cómo es la consulta ginecológica" },
    foto: FOTOS.educacion,
  },
  {
    titulo: "Embarazo",
    frase: "Del primer positivo al día del parto, sin sorpresas.",
    servicios: [
      "Control prenatal",
      "Ecografía obstétrica",
      "Laboratorios de cada trimestre",
      "Peso y tensión en cada consulta",
      "Preparación para el parto",
    ],
    enlace: { href: "/control-prenatal-en-maturin", texto: "Cómo es el control prenatal" },
    foto: FOTOS.reciénNacida,
  },
  {
    titulo: "Fertilidad",
    frase: "Cuando el embarazo no llega, primero hay que entender por qué.",
    servicios: [
      "Evaluación de la pareja",
      "Estudios hormonales y ecográficos",
      "Estudio del factor masculino",
      "Tratamiento según la causa",
      "Reproducción asistida",
    ],
    enlace: { href: "/fertilidad-en-maturin", texto: "Cómo es la consulta de fertilidad" },
    foto: FOTOS.conBebe,
  },
];

/**
 * Tres áreas en paneles. En escritorio el panel que se señala se abre y
 * muestra lo que incluye; en móvil van apilados y abiertos.
 */
export default function Specialties() {
  const [abierta, setAbierta] = useState(1);

  return (
    <section id="especialidades" aria-labelledby="rd-esp-title" className="py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="rd-esp-title" className="rd-title text-[clamp(2.6rem,5.6vw,5.25rem)] lg:col-span-7">
            ¿En qué te puedo ayudar?
          </h2>
          <p className="rd-lead lg:col-span-4 lg:col-start-9">
            Tres áreas y una misma forma de atender: con tiempo para tus
            preguntas y seguimiento de cada resultado.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 lg:mt-20 lg:h-[640px] lg:flex-row">
          {AREAS.map((area, i) => (
            <article
              key={area.titulo}
              data-open={i === abierta || undefined}
              onMouseEnter={() => setAbierta(i)}
              onFocusCapture={() => setAbierta(i)}
              onClick={() => setAbierta(i)}
              className="rd-panel relative overflow-hidden rounded-[28px] bg-wine text-milk lg:rounded-[36px]"
            >
              <div className="relative h-[360px] sm:h-[460px] lg:absolute lg:inset-0 lg:h-auto">
                <Image
                  src={area.foto.src}
                  alt={area.foto.alt}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: area.foto.focus }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-wine via-wine/35 to-wine/0 lg:via-wine/25"
                />
              </div>

              <div className="relative -mt-24 px-6 pb-8 sm:px-9 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:px-9 lg:pb-9">
                <h3 className="rd-title text-[2.6rem] sm:text-[3rem]">{area.titulo}</h3>
                <div className="rd-panel-body">
                  <div>
                    <div className="lg:w-[30rem]">
                      <p className="mt-3 text-[1.0625rem] leading-snug text-on-wine-soft">{area.frase}</p>
                      <ul className="mt-6 grid gap-x-6 gap-y-2.5 text-[15px] sm:grid-cols-2">
                        {area.servicios.map((s) => (
                          <li key={s} className="flex gap-2.5">
                            <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-petal" />
                            {s}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={area.enlace.href}
                        className="mt-7 inline-block text-[15px] font-semibold underline decoration-petal/60 underline-offset-[6px] transition-colors hover:decoration-petal"
                      >
                        {area.enlace.texto}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
