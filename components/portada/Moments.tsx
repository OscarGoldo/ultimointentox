"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FOTOS, type Foto } from "@/lib/fotos";
import { movimientoReducido } from "./movimiento";

const MOMENTOS: { foto: Foto; texto: string }[] = [
  { foto: FOTOS.nacimiento, texto: "El primer llanto, minutos después del parto." },
  { foto: FOTOS.reciénNacida, texto: "Una recién nacida de visita en el consultorio." },
  { foto: FOTOS.conPaciente, texto: "Acompañando a una paciente antes de entrar a quirófano." },
  { foto: FOTOS.corriendo, texto: "Fuera del consultorio, entrenando al atardecer." },
  { foto: FOTOS.conBebe, texto: "Una bebé durante su consulta de control." },
  { foto: FOTOS.quirofano, texto: "En el área quirúrgica de la clínica." },
  { foto: FOTOS.educacion, texto: "Explicando el uso de la copa menstrual en consulta." },
  { foto: FOTOS.consulta, texto: "Escribiendo la historia clínica de una paciente." },
];

/**
 * Archivo de fotos. En escritorio la sección se fija y el scroll vertical la
 * recorre de lado; en móvil (o con movimiento reducido) es una tira que se
 * desliza con el dedo. Cada foto conserva su proporción real.
 */
export default function Moments() {
  const seccion = useRef<HTMLElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const [fijada, setFijada] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const actualizar = () => setFijada(mq.matches && !movimientoReducido());
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, []);

  useEffect(() => {
    const s = seccion.current;
    const p = pista.current;
    if (!s || !p) return;

    if (!fijada) {
      s.style.height = "";
      p.style.transform = "";
      return;
    }

    let distancia = 0;
    let raf = 0;

    const mover = () => {
      raf = 0;
      const r = s.getBoundingClientRect();
      const avance = Math.min(1, Math.max(0, -r.top / Math.max(1, distancia)));
      p.style.transform = `translate3d(${-avance * distancia}px, 0, 0)`;
      s.style.setProperty("--p", avance.toFixed(4));
    };
    const medir = () => {
      distancia = Math.max(0, p.scrollWidth - p.clientWidth);
      s.style.height = `${distancia + window.innerHeight}px`;
      mover();
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(mover);
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(p);
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", medir);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", medir);
      cancelAnimationFrame(raf);
      s.style.height = "";
      p.style.transform = "";
    };
  }, [fijada]);

  return (
    <section
      ref={seccion}
      id="momentos"
      aria-labelledby="rd-mom-title"
      data-pinned={fijada || undefined}
      className="rd-moments relative bg-wine text-milk"
    >
      <div className="rd-moments-sticky py-24 lg:py-16">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="rd-mom-title" className="rd-title text-[clamp(2.6rem,5.6vw,5.25rem)]">
            Momentos del consultorio
          </h2>
          <p className="max-w-[24rem] text-[1.0625rem] leading-relaxed text-on-wine-soft">
            Lo que no cabe en una historia clínica.
          </p>
        </div>

        <div
          ref={pista}
          className="rd-moments-track rd-gutter-x mt-12 flex gap-5 lg:mt-14 lg:gap-7"
        >
          {MOMENTOS.map(({ foto, texto }) => (
            <figure key={foto.src} className="shrink-0 snap-start">
              <div
                className="rd-moment-photo relative overflow-hidden rounded-[24px] bg-white/5"
                style={
                  {
                    aspectRatio: `${foto.width} / ${foto.height}`,
                    "--ar": foto.height / foto.width,
                  } as React.CSSProperties
                }
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 70vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 w-0 min-w-full text-[15px] leading-snug text-on-wine-soft">
                {texto}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Avance del recorrido (solo cuando la sección está fijada) */}
        {fijada && (
          <div aria-hidden="true" className="mx-auto mt-10 w-full max-w-[1320px] px-8">
            <div className="h-[2px] w-full rounded-full bg-white/10">
              <div
                className="h-full w-full origin-left rounded-full bg-petal"
                style={{ transform: "scaleX(var(--p, 0))" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
