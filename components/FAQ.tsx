"use client";

import { useState } from "react";
import { Plus, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { FAQS_PORTADA } from "@/lib/faqs";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-cream py-24 lg:py-32" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeading
          label="Preguntas frecuentes"
          headingId="faq-heading"
          title="Resolvemos tus dudas"
          lead="Lo que las pacientes suelen preguntar antes de su primera visita."
        />

        <div className="mx-auto mt-14 max-w-3xl lg:mt-16">
          <dl className="space-y-3">
            {FAQS_PORTADA.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <Reveal key={faq.pregunta} delay={index * 40}>
                  <div
                    className={`card overflow-hidden transition-colors ${
                      isOpen ? "border-line-strong" : ""
                    }`}
                  >
                    <dt>
                      <button
                        id={buttonId}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        className="group flex w-full items-start gap-4 p-6 text-left sm:gap-5"
                      >
                        <span className="display-md flex-1 text-[1.0625rem] transition-colors group-hover:text-magenta sm:text-[1.1875rem]">
                          {faq.pregunta}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                            isOpen
                              ? "rotate-45 bg-magenta text-white"
                              : "bg-blush text-magenta group-hover:bg-magenta group-hover:text-white"
                          }`}
                        >
                          <Plus size={16} strokeWidth={2.5} />
                        </span>
                      </button>
                    </dt>

                    <dd
                      id={answerId}
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows] duration-400 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-[15px] leading-[1.72] text-plum-soft">
                          {faq.respuesta}
                        </p>
                      </div>
                    </dd>
                  </div>
                </Reveal>
              );
            })}
          </dl>

          <Reveal delay={80}>
            <div className="mt-10 flex flex-col items-center gap-5 rounded-[var(--radius-xl)] bg-blush px-8 py-9 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="max-w-sm text-[15.5px] leading-relaxed text-plum">
                ¿Tienes una pregunta que no está aquí? Llama al consultorio.
              </p>
              <a href="tel:+584120896444" className="btn btn-primary tnum shrink-0">
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                0412 089 6444
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
