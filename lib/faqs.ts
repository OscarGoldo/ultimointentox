export type Faq = {
  pregunta: string;
  respuesta: string;
};

/**
 * Preguntas frecuentes de la portada. Viven aquí porque las consume también
 * StructuredData para declarar el bloque FAQPage de schema.org: Google solo
 * puede mostrarlas como resultado enriquecido si el texto declarado es
 * exactamente el mismo que ve la paciente en la página.
 */
export const FAQS_PORTADA: Faq[] = [
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
