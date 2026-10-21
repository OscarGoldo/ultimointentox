"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { FOTOS } from "@/lib/fotos";
import { CENTRO, Corona, CORONA_EXTERIOR, CORONA_INTERIOR } from "./corona";
import { movimientoReducido } from "./movimiento";

/** El trazo celeste del logo: entra desde el borde derecho hasta el óvulo. */
const TRAZO = "M772 214 C746 172 716 176 694 218 S644 286 616 264 S570 230 540 268";

const DURACION = 1400;
const ESPERA = 250;

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/**
 * El logo convertido en portada. Al cargar, el trazo celeste viaja hasta el
 * óvulo; cuando llega, sale una onda y el óvulo se abre como un iris para
 * mostrar a la doctora. Es el único movimiento de la página que no depende
 * de la paciente.
 */
export default function Ovum() {
  const ovuloRef = useRef<HTMLDivElement>(null);
  const trazoRef = useRef<SVGPathElement>(null);
  const cabezaRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ovulo = ovuloRef.current;
    const trazo = trazoRef.current;
    const cabeza = cabezaRef.current;
    if (!ovulo || !trazo || !cabeza) return;

    const largo = trazo.getTotalLength();

    const ubicar = (avance: number) => {
      const d = avance * largo;
      const p = trazo.getPointAtLength(d);
      const q = trazo.getPointAtLength(Math.max(0, d - 2));
      const angulo = (Math.atan2(p.y - q.y, p.x - q.x) * 180) / Math.PI;
      trazo.style.strokeDashoffset = String(1 - avance);
      cabeza.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angulo})`);
    };

    if (movimientoReducido()) {
      ubicar(1);
      cabeza.style.opacity = "1";
      ovulo.dataset.fused = "";
      return;
    }

    ubicar(0);
    const inicio = performance.now() + ESPERA;
    let raf = 0;
    const paso = (t: number) => {
      const x = Math.min(1, Math.max(0, (t - inicio) / DURACION));
      ubicar(easeInOutCubic(x));
      cabeza.style.opacity = String(Math.min(1, x * 8));
      if (x < 1) raf = requestAnimationFrame(paso);
      else ovulo.dataset.fused = "";
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Paralaje leve con el puntero: solo con ratón y sin movimiento reducido */
  useEffect(() => {
    const ovulo = ovuloRef.current;
    if (!ovulo) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || movimientoReducido()) return;

    let raf = 0;
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ovulo.style.setProperty("--mx", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        ovulo.style.setProperty("--my", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    addEventListener("pointermove", mover, { passive: true });
    return () => {
      removeEventListener("pointermove", mover);
      cancelAnimationFrame(raf);
    };
  }, []);

  const retrato = FOTOS.dePie;

  return (
    <div ref={ovuloRef} className="rd-ovum relative aspect-[760/600] w-full">
      <svg
        viewBox="0 0 760 600"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="rd-nucleo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fde9f0" />
            <stop offset="0.5" stopColor="#ee7ba5" />
            <stop offset="1" stopColor="#c2185b" />
          </radialGradient>
        </defs>

        <g style={{ transform: "translate(calc(var(--mx) * -12px), calc(var(--my) * -12px))" }}>
          <g className="rd-spin rd-spin--rev">
            <g className="rd-bloom">
              <Corona petalos={CORONA_EXTERIOR} animada />
            </g>
          </g>
        </g>

        <g style={{ transform: "translate(calc(var(--mx) * 6px), calc(var(--my) * 6px))" }}>
          <g className="rd-spin">
            <g className="rd-bloom">
              <Corona petalos={CORONA_INTERIOR} animada />
            </g>
          </g>
        </g>

        <circle cx={CENTRO} cy={CENTRO} r="214" fill="none" stroke="#f5d5e1" strokeWidth="8" className="rd-core" />
        <circle cx={CENTRO} cy={CENTRO} r="206" fill="url(#rd-nucleo)" className="rd-core" />
        <circle cx={CENTRO} cy={CENTRO} r="214" fill="none" stroke="#c2185b" strokeWidth="2" className="rd-pulse" />

        <path
          ref={trazoRef}
          d={TRAZO}
          pathLength={1}
          fill="none"
          stroke="#8fd0ee"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        />
        <g ref={cabezaRef} style={{ opacity: 0 }}>
          <ellipse rx="20" ry="13" fill="#a9dcf4" stroke="#fcf8f9" strokeWidth="3.5" />
          <ellipse cx="4" cy="-1" rx="8" ry="4.5" fill="#fcf8f9" opacity="0.9" />
        </g>
      </svg>

      <div className="rd-portrait absolute left-[12.37%] top-[15.67%] h-[68.67%] w-[54.21%] overflow-hidden rounded-full">
        <Image
          src={retrato.src}
          alt={retrato.alt}
          fill
          priority
          sizes="(min-width: 1280px) 34vw, 62vw"
          className="object-cover"
          style={{ objectPosition: "50% 16%" }}
        />
      </div>
    </div>
  );
}
