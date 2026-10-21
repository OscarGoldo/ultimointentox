"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import { FOTOS } from "@/lib/fotos";

const TEXTO =
  "Cada consulta empieza escuchando. Después viene lo demás: un diagnóstico explicado con palabras sencillas, tiempos realistas y un seguimiento que no termina al salir del consultorio. Sin promesas que la medicina no pueda sostener.";

const PALABRAS = TEXTO.split(" ");

/**
 * La forma de trabajar de la doctora, dicha en grande. Las palabras se
 * entintan al ritmo del scroll, como si se leyeran en voz alta. Un solo valor
 * (--p) por fotograma; cada palabra calcula su opacidad en CSS.
 */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Empieza cuando el texto asoma por abajo y termina cuando su final pasa el centro
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section aria-label="Cómo trabajo" className="bg-wine py-28 text-milk lg:py-44">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <p
          ref={ref}
          className="rd-ink rd-title max-w-[24ch] text-[clamp(2.1rem,4.9vw,4.6rem)] leading-[1.04]"
          style={{ "--n": PALABRAS.length } as React.CSSProperties}
        >
          {PALABRAS.map((palabra, i) => (
            <Fragment key={i}>
              <span className="rd-word" style={{ "--i": i } as React.CSSProperties}>
                {palabra}
              </span>{" "}
            </Fragment>
          ))}
        </p>

        <div className="mt-14 flex items-center gap-4 lg:mt-20">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15">
            <Image
              src={FOTOS.consulta.src}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
              style={{ objectPosition: "50% 20%" }}
            />
          </span>
          <span className="leading-snug">
            <span className="block font-semibold">Dra. Hilda Mary Díaz García</span>
            <span className="block text-[15px] text-on-wine-soft">
              Ginecóloga, obstetra y especialista en fertilidad
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
