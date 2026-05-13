"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Encabezado */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-2">
            Preguntas Frecuentes
          </p>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Resolvemos tus dudas
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-[#f06292] rounded-full" aria-hidden="true" />
        </div>

        {/* Acordeón */}
        <div className="space-y-3" role="list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const itemId = `faq-item-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <div
                key={index}
                role="listitem"
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen ? "border-rose-200 shadow-sm" : "border-gray-200"
                }`}
              >
                <button
                  id={itemId}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className={`w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 ${
                    isOpen ? "bg-rose-50" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {faq.pregunta}
                  </span>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`flex-shrink-0 text-[#f06292] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={itemId}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-5 pt-2 text-gray-600 text-sm sm:text-base leading-relaxed bg-white">
                    {faq.respuesta}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pregunta adicional */}
        <div className="mt-10 text-center p-6 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-gray-700 font-medium mb-3">
            ¿Tienes una pregunta que no está aquí?
          </p>
          <a
            href="tel:+584120896444"
            className="inline-flex items-center gap-2 bg-[#f06292] text-white font-bold px-6 py-3 rounded-full hover:bg-[#ec407a] transition-colors"
          >
            Contáctanos directamente
          </a>
        </div>
      </div>
    </section>
  );
}
