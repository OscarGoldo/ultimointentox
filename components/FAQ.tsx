"use client";

import { useState } from "react";
import { Plus, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const faqs = [
  {
    pregunta: "¿Con qué frecuencia debo hacerme una revisión ginecológica?",
    respuesta:
      "Se recomienda una revisión ginecológica anual para mujeres mayores de 21 años o desde el inicio de la actividad sexual. Incluye examen físico, Papanicolaou (PAP) y evaluación mamaria. Ante cualquier síntoma inusual, no esperes a la cita anual.",
  },
  {
    pregunta: "¿A partir de qué edad debo visitar a una ginecóloga?",
    respuesta:
      "La primera visita ginecológica se recomienda entre los 13 y 15 años, o al inicio de la actividad sexual. Las adolescentes pueden acudir para orientación sobre ciclo menstrual, anticoncepción y vacuna VPH, aunque no sea necesario un examen pélvico completo.",
  },
  {
    pregunta: "¿Qué debo llevar a mi primera consulta prenatal?",
    respuesta:
      "Trae tu prueba de embarazo (si la tienes), tu última fecha de menstruación, resultados de análisis previos, tu carnet de salud y una lista de medicamentos o suplementos que tomes. Cuanto más información tengas, mejor podremos orientarte.",
  },
  {
    pregunta: "¿Cuándo debería consultar sobre fertilidad?",
    respuesta:
      "Si tienes menos de 35 años y llevas 12 meses intentando concebir sin éxito, es momento de consultar. Si tienes más de 35 años, el tiempo recomendado es 6 meses. También si tienes ciclos irregulares, endometriosis conocida u otros factores de riesgo.",
  },
  {
    pregunta: "¿Ofrecen consultas de seguimiento por WhatsApp?",
    respuesta:
      "Sí, ofrecemos orientación y seguimiento de resultados por WhatsApp para pacientes activos. Sin embargo, para diagnósticos nuevos, síntomas agudos o recetas, se requiere consulta presencial. Comunícate al 0412-0896444.",
  },
  {
    pregunta: "¿Cuál es el costo de la consulta?",
    respuesta:
      "Los honorarios médicos se informan directamente al contactar el consultorio, ya que pueden variar según el tipo de consulta (primera vez, control prenatal, procedimiento, etc.). Contáctanos al 0412-0896444 o por correo para más información.",
  },
  {
    pregunta: "¿Atienden seguros médicos o HCM?",
    respuesta:
      "Aceptamos diversas aseguradoras y HCM. Te recomendamos confirmar la cobertura directamente con tu aseguradora y mencionarlo al momento de agendar tu cita para orientarte correctamente.",
  },
];

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
            {faqs.map((faq, index) => {
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
