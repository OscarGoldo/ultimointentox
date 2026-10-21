"use client";

import { useState } from "react";
import { FAQS_PORTADA } from "@/lib/faqs";
import { TELEFONO } from "./datos";

export default function Questions() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section id="preguntas" aria-labelledby="rd-faq-title" className="bg-petal/45 py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[104px]">
            <h2 id="rd-faq-title" className="rd-title text-[clamp(2.6rem,4.6vw,4.25rem)]">
              Antes de tu primera visita
            </h2>
            <p className="rd-lead mt-5 max-w-[24rem]">
              Lo que las pacientes suelen preguntar. Si tu duda no está aquí,
              llama al consultorio.
            </p>
            <a href={TELEFONO.href} className="rd-btn rd-btn-ghost tnum mt-8">
              {TELEFONO.visible}
            </a>
          </div>
        </div>

        <dl className="border-t border-wine/15 lg:col-span-7 lg:col-start-6">
          {FAQS_PORTADA.map((faq, i) => {
            const open = abierta === i;
            return (
              <div key={faq.pregunta} className="border-b border-wine/15">
                <dt>
                  <button
                    type="button"
                    id={`rd-faq-q-${i}`}
                    aria-expanded={open}
                    aria-controls={`rd-faq-a-${i}`}
                    onClick={() => setAbierta(open ? null : i)}
                    className="group flex w-full items-start justify-between gap-6 py-7 text-left"
                  >
                    <span className="text-[1.25rem] font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-magenta-deep sm:text-[1.375rem]">
                      {faq.pregunta}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                        open ? "bg-magenta text-white" : "bg-milk text-magenta-deep group-hover:bg-white"
                      }`}
                    >
                      <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
                      <span
                        className={`absolute h-3.5 w-[2px] rounded-full bg-current transition-transform duration-300 ${
                          open ? "scale-y-0" : ""
                        }`}
                      />
                    </span>
                  </button>
                </dt>
                <dd
                  id={`rd-faq-a-${i}`}
                  aria-labelledby={`rd-faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[40rem] pb-8 text-[1.0625rem] leading-relaxed text-wine/80">
                      {faq.respuesta}
                    </p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
