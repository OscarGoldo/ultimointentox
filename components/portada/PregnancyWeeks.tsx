"use client";

import { useState } from "react";
import Link from "next/link";
import { AGENDAR_URL } from "./datos";

const PRIMERA = 4;
const ULTIMA = 40;
const SEMANAS = Array.from({ length: ULTIMA - PRIMERA + 1 }, (_, i) => i + PRIMERA);

/**
 * Consultas del esquema habitual de un embarazo sin complicaciones: una al mes
 * hasta la semana 28, cada dos semanas hasta la 36 y semanal hasta el parto.
 * Es el mismo esquema que se explica en /control-prenatal-en-maturin.
 */
const CONSULTAS = [8, 12, 16, 20, 24, 28, 30, 32, 34, 36, 37, 38, 39, 40];

const TRIMESTRES = [
  {
    nombre: "Primer trimestre",
    hasta: 13,
    revision:
      "La ecografía confirma que el embarazo evoluciona bien y precisa el tiempo de gestación. Se calcula la fecha probable de parto, se piden los laboratorios del trimestre y se indican los suplementos, como el ácido fólico.",
  },
  {
    nombre: "Segundo trimestre",
    hasta: 27,
    revision:
      "Alrededor de la mitad del embarazo se hace la evaluación morfológica, la ecografía que revisa en detalle la anatomía del bebé. En cada consulta se controlan tu peso y tu tensión.",
  },
  {
    nombre: "Tercer trimestre",
    hasta: 40,
    revision:
      "La ecografía vigila el crecimiento y la posición del bebé, el líquido amniótico y la placenta. Y se prepara el parto: qué esperar, cuándo ir a la clínica y qué señales no dejar pasar.",
  },
];

function frecuencia(semana: number) {
  if (semana < 28) return "Una consulta al mes";
  if (semana < 36) return "Una consulta cada dos semanas";
  return "Una consulta por semana hasta el parto";
}

export default function PregnancyWeeks() {
  const [semana, setSemana] = useState(20);

  const trimestre = TRIMESTRES.find((t) => semana <= t.hasta) ?? TRIMESTRES[2];
  const restantes = CONSULTAS.filter((c) => c > semana).length;
  const avance = ((semana - PRIMERA) / (ULTIMA - PRIMERA)) * 100;

  /* Tocar la regla de semanas también mueve el control */
  const elegirConClic = (e: React.MouseEvent<HTMLOListElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    setSemana(Math.round(PRIMERA + Math.min(1, Math.max(0, x)) * (ULTIMA - PRIMERA)));
  };

  return (
    <section id="embarazo" aria-labelledby="rd-emb-title" className="bg-celeste py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="rd-emb-title" className="rd-title text-[clamp(2.6rem,5.6vw,5.25rem)] lg:col-span-7">
            Tu embarazo, semana a semana
          </h2>
          <p className="rd-lead text-wine/75 lg:col-span-4 lg:col-start-9">
            Mueve el control hasta tu semana y mira cada cuánto toca consulta y
            qué se revisa en esa etapa.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <p className="flex items-end gap-5 lg:col-span-5" aria-live="polite">
            <span
              key={semana}
              className="rd-tick rd-display tnum text-[clamp(8rem,17vw,14rem)] leading-[0.78] text-magenta-deep"
            >
              {semana}
            </span>
            <span className="pb-2 text-[1.25rem] font-semibold leading-tight">
              semanas
              <span className="block font-normal text-wine/70">{trimestre.nombre}</span>
            </span>
          </p>

          <dl className="grid content-end gap-7 lg:col-span-6 lg:col-start-7">
            <div>
              <dt className="text-[14.5px] font-semibold text-magenta-deep">Cada cuánto vienes</dt>
              <dd className="mt-1.5 text-[1.625rem] font-semibold leading-tight tracking-[-0.01em]">
                {frecuencia(semana)}
              </dd>
              <dd className="mt-1.5 text-[15px] text-wine/70">
                {restantes > 0
                  ? `Quedan unas ${restantes} consultas hasta el parto.`
                  : "Es la semana de la fecha probable de parto."}
              </dd>
            </div>
            <div>
              <dt className="text-[14.5px] font-semibold text-magenta-deep">Qué se revisa en esta etapa</dt>
              <dd className="mt-1.5 max-w-[34rem] text-[1.0625rem] leading-relaxed">{trimestre.revision}</dd>
            </div>
            {semana >= 28 && (
              <div className="rounded-2xl bg-milk/70 px-5 py-4 text-[15px] leading-relaxed">
                <dt className="font-semibold">Desde la semana 28</dt>
                <dd>
                  Si notas que el bebé se mueve menos, no esperes a la cita: acude a
                  la emergencia obstétrica y avisa al consultorio.
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Regla de 40 semanas: los puntos marcan las consultas y se hacen más
            seguidos al final, que es justo lo que pasa en el control prenatal */}
        <div className="mt-16 lg:mt-20">
          <div className="relative">
            <ol
              aria-hidden="true"
              onClick={elegirConClic}
              className="flex h-24 cursor-pointer items-end justify-between px-[14px]"
            >
              {SEMANAS.map((s) => {
                const consulta = CONSULTAS.includes(s);
                const actual = s === semana;
                return (
                  <li key={s} className="relative flex w-0 flex-col items-center justify-end">
                    {consulta && (
                      <span
                        className={`mb-2.5 block h-[7px] w-[7px] rounded-full transition-colors duration-300 sm:h-2.5 sm:w-2.5 ${
                          s <= semana ? "bg-magenta" : "bg-wine/25"
                        }`}
                      />
                    )}
                    <span
                      className={`block w-[2px] rounded-full transition-all duration-300 ${
                        actual
                          ? "h-12 bg-magenta"
                          : s % 4 === 0
                            ? "h-7 bg-wine/40"
                            : "h-4 bg-wine/20"
                      }`}
                    />
                  </li>
                );
              })}
            </ol>

            <input
              type="range"
              min={PRIMERA}
              max={ULTIMA}
              step={1}
              value={semana}
              onChange={(e) => setSemana(Number(e.target.value))}
              aria-label="Semana de embarazo"
              aria-valuetext={`Semana ${semana}, ${trimestre.nombre.toLowerCase()}`}
              className="rd-range mt-1"
              style={{ "--fill": `${avance}%` } as React.CSSProperties}
            />
          </div>

          <ol className="mt-3 grid grid-cols-[9.5fr_14fr_12.5fr] px-[14px] text-[13.5px] font-medium text-wine/70">
            {TRIMESTRES.map((t) => (
              <li
                key={t.nombre}
                className={`border-l border-wine/20 pl-3 transition-colors ${
                  t === trimestre ? "text-wine" : ""
                }`}
              >
                {t.nombre}
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col gap-6 border-t border-wine/15 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[42rem] text-[15px] leading-relaxed text-wine/75">
              <span aria-hidden="true" className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-magenta align-middle" />
              Consultas del esquema habitual en un embarazo sin complicaciones. La
              primera, idealmente antes de la semana 10. Si tu embarazo necesita
              más vigilancia, los controles se hacen más seguidos.
            </p>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={AGENDAR_URL} className="rd-btn rd-btn-primary">
                Agendar control prenatal
              </a>
              <Link href="/control-prenatal-en-maturin" className="rd-btn rd-btn-ghost">
                Cómo es el control
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
