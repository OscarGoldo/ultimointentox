"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FOTOS, type Foto } from "@/lib/fotos";

type Paso = { titulo: string; lugar: string; texto: string; foto: Foto };

const PASOS: Paso[] = [
  {
    titulo: "Médico cirujano",
    lugar: "Universidad de Oriente (UDO), Ciudad Bolívar",
    texto: "Mi formación empezó en el oriente del país, en la Universidad de Oriente.",
    foto: FOTOS.consulta,
  },
  {
    titulo: "Especialista en Ginecología y Obstetricia",
    lugar: "Colegio de Médicos, N.º 1947. Maturín",
    texto:
      "La especialidad que me permite acompañar a la mujer en su salud ginecológica y durante todo el embarazo, hasta el parto.",
    foto: FOTOS.quirofano,
  },
  {
    titulo: "Subespecialista en Fertilidad y Reproducción",
    lugar: "UNIFERTES, Clínica El Ávila. Caracas",
    texto:
      "Para las parejas a las que el embarazo no les llega: diagnóstico primero, tratamiento después, incluida la reproducción asistida.",
    foto: FOTOS.ecografo,
  },
  {
    titulo: "Consulta en Maturín",
    lugar: "Clínica Tierra Santa, piso 3, consultorio 3",
    texto:
      "Más de 20 años atendiendo a mujeres de Monagas y del oriente venezolano, con atención personalizada, confidencialidad y seguimiento de cada paciente.",
    foto: FOTOS.conPaciente,
  },
];

/**
 * Su formación, en orden. En escritorio la foto queda fija y cambia con el
 * paso que se está leyendo; la línea de la izquierda se llena con el scroll.
 */
export default function Journey() {
  const [activo, setActivo] = useState(0);
  const lista = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = lista.current;
    if (!ol) return;

    const pasos = Array.from(ol.querySelectorAll<HTMLElement>("[data-paso]"));
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.paso));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    pasos.forEach((p) => io.observe(p));

    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const p = (window.innerHeight * 0.5 - r.top) / r.height;
      ol.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="trayectoria" aria-labelledby="rd-tray-title" className="py-24 lg:py-36">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <h2 id="rd-tray-title" className="rd-title max-w-[16ch] text-[clamp(2.6rem,5.6vw,5.25rem)]">
          Más de veinte años de formación y consulta
        </h2>

        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Foto fija (solo escritorio) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[104px] h-[calc(100svh-150px)] max-h-[720px] overflow-hidden rounded-[36px] bg-petal">
              {PASOS.map((paso, i) => (
                <Image
                  key={paso.titulo}
                  src={paso.foto.src}
                  alt={paso.foto.alt}
                  fill
                  sizes="40vw"
                  data-active={i === activo || undefined}
                  className="rd-journey-photo object-cover"
                  style={{ objectPosition: paso.foto.focus }}
                />
              ))}
            </div>
          </div>

          <ol ref={lista} className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-[2px] rounded-full bg-wine/10">
              <span
                className="block h-full w-full origin-top rounded-full bg-magenta"
                style={{ transform: "scaleY(var(--p, 0))" }}
              />
            </span>

            {PASOS.map((paso, i) => (
              <li
                key={paso.titulo}
                data-paso={i}
                data-active={i === activo || undefined}
                className="rd-step relative pb-16 pl-8 last:pb-0 sm:pl-12 lg:flex lg:min-h-[62svh] lg:flex-col lg:justify-center lg:pb-0"
              >
                <div className="relative mb-7 aspect-[4/3] overflow-hidden rounded-[24px] lg:hidden">
                  <Image
                    src={paso.foto.src}
                    alt={paso.foto.alt}
                    fill
                    sizes="90vw"
                    className="object-cover"
                    style={{ objectPosition: paso.foto.focus }}
                  />
                </div>
                <div className="relative">
                  {/* Punto sobre la línea, a la altura del número del paso */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[calc(2rem+5px)] top-[4px] h-3 w-3 rounded-full border-2 border-milk transition-colors duration-500 sm:-left-[calc(3rem+5px)] ${
                      i <= activo ? "bg-magenta" : "bg-wine/25"
                    }`}
                  />
                  <p className="tnum text-[15px] font-semibold text-magenta-deep">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="rd-title mt-3 text-[clamp(1.9rem,3vw,2.75rem)]">{paso.titulo}</h3>
                  <p className="mt-3 text-[15.5px] font-semibold text-ink-soft">{paso.lugar}</p>
                  <p className="mt-4 max-w-[30rem] text-[1.0625rem] leading-relaxed text-wine/85">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
