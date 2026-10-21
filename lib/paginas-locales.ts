import type { Metadata } from "next";
import type { Faq } from "@/lib/faqs";

export type Seccion = {
  titulo: string;
  parrafos?: string[];
  items?: { titulo: string; texto: string }[];
};

export type PaginaLocal = {
  slug: string;
  etiqueta: string;
  /** H1. Lleva la búsqueda real ("ginecólogo en Maturín") sin sonar forzado. */
  titulo: string;
  metaTitulo: string;
  metaDescripcion: string;
  entrada: string[];
  secciones: Seccion[];
  faqs: Faq[];
  /** Slugs de las otras páginas, para que se enlacen entre sí. */
  relacionadas: string[];
};

const AGENDAR =
  "Las citas se agendan por teléfono al 0412-0896444, por WhatsApp o en línea. El consultorio atiende de lunes a viernes, de 8:00 AM a 5:00 PM, en la Clínica Tierra Santa, piso 3, consultorio 3, avenida Fuerzas Armadas, Maturín.";

/**
 * Páginas de contenido para las búsquedas locales ("ginecólogo en Maturín",
 * "control prenatal Maturín", "fertilidad Maturín"). Cada una responde a una
 * intención distinta: la portada presenta el consultorio, estas resuelven la
 * duda concreta con la que la paciente llega desde Google.
 *
 * Regla: aquí solo va información que la doctora ya comunica en su web o que
 * es criterio clínico general. Nada de precios, cifras ni promesas inventadas.
 */
export const PAGINAS_LOCALES: PaginaLocal[] = [
  {
    slug: "ginecologo-en-maturin",
    etiqueta: "Ginecología en Maturín",
    titulo: "Ginecólogo en Maturín: consulta con la Dra. Hilda Mary Díaz García",
    metaTitulo: "Ginecólogo en Maturín | Dra. Hilda Mary Díaz García",
    metaDescripcion:
      "Consulta ginecológica en Maturín, Monagas: Papanicolaou, colposcopia, ecografía y planificación familiar. Clínica Tierra Santa, piso 3. Agenda al 0412-0896444.",
    entrada: [
      "Si buscas un ginecólogo en Maturín, la Dra. Hilda Mary Díaz García atiende en la Clínica Tierra Santa, piso 3, consultorio 3, con más de 20 años de ejercicio en ginecología, obstetricia y fertilidad en el estado Monagas.",
      "La consulta se explica en palabras sencillas: qué te está pasando, qué estudios hacen falta y qué viene después. Sin apuro, con confidencialidad y con seguimiento de cada resultado.",
    ],
    secciones: [
      {
        titulo: "Qué incluye una consulta ginecológica",
        items: [
          {
            titulo: "Historia clínica y examen físico",
            texto:
              "Antecedentes, ciclo menstrual, métodos anticonceptivos y examen ginecológico completo.",
          },
          {
            titulo: "Papanicolaou (PAP)",
            texto:
              "Prueba de despistaje del cáncer de cuello uterino, recomendada de forma anual.",
          },
          {
            titulo: "Colposcopia",
            texto:
              "Estudio detallado del cuello uterino cuando el PAP sale alterado o hay lesiones que evaluar.",
          },
          {
            titulo: "Ecografía ginecológica",
            texto:
              "Evaluación de útero y ovarios para estudiar quistes, miomas, dolor pélvico o sangrados.",
          },
          {
            titulo: "Evaluación mamaria",
            texto:
              "Examen de mamas y orientación sobre cuándo corresponde una mamografía o un eco mamario.",
          },
          {
            titulo: "Plan y seguimiento",
            texto:
              "Indicaciones claras y revisión de los resultados cuando estén listos.",
          },
        ],
      },
      {
        titulo: "Motivos por los que las pacientes consultan",
        parrafos: [
          "La revisión anual es el motivo más frecuente, pero no el único. También se consulta por reglas irregulares, muy abundantes o dolorosas; sangrados fuera del período; flujo, ardor o picazón que no ceden; dolor pélvico; molestias en las relaciones; y dudas sobre anticoncepción, incluida la colocación de DIU.",
          "En otra etapa de la vida, la consulta gira alrededor de los síntomas de la menopausia: calorones, insomnio, resequedad o cambios de ánimo. Todos tienen manejo, y el primer paso siempre es evaluar antes de indicar tratamiento.",
        ],
      },
      {
        titulo: "Cuándo no conviene esperar a la cita anual",
        parrafos: [
          "Hay señales que ameritan consulta pronta: sangrado abundante o que no se detiene, dolor pélvico intenso, fiebre acompañada de dolor en el vientre bajo, un bulto nuevo en la mama, sangrado después de la menopausia o cualquier sangrado durante el embarazo.",
          "Si el síntoma es intenso o repentino, acude al servicio de emergencia más cercano. Una consulta programada no sustituye la atención de una urgencia.",
        ],
      },
      {
        titulo: "Dónde queda el consultorio y cómo agendar",
        parrafos: [AGENDAR],
      },
      {
        titulo: "Si es tu primera vez, trae esto",
        parrafos: [
          "Tu cédula, la fecha de tu última menstruación, los resultados de estudios previos que tengas (PAP, ecografías, laboratorios) y una lista de los medicamentos o suplementos que tomas. Mientras más información traigas, más precisa será la orientación.",
        ],
      },
    ],
    faqs: [
      {
        pregunta: "¿Necesito cita previa para la consulta ginecológica en Maturín?",
        respuesta:
          "Sí. Las citas se agendan al 0412-0896444, por WhatsApp o en línea. El horario de atención es de lunes a viernes, de 8:00 AM a 5:00 PM, en la Clínica Tierra Santa, piso 3, consultorio 3.",
      },
      {
        pregunta: "¿Puedo ir a la consulta si estoy en mi período?",
        respuesta:
          "El Papanicolaou y la colposcopia se programan fuera de los días de sangrado, porque la muestra puede alterarse. Si tu motivo de consulta es dolor, sangrado abundante o un síntoma que no puede esperar, se evalúa igual: llama y te orientamos.",
      },
      {
        pregunta: "¿Atiende a adolescentes?",
        respuesta:
          "Sí. La primera visita ginecológica se recomienda entre los 13 y 15 años o al inicio de la actividad sexual, y suele ser una consulta de orientación sobre ciclo menstrual, anticoncepción y vacuna contra el VPH, sin necesidad de examen pélvico completo.",
      },
    ],
    relacionadas: ["control-prenatal-en-maturin", "fertilidad-en-maturin"],
  },
  {
    slug: "control-prenatal-en-maturin",
    etiqueta: "Obstetricia en Maturín",
    titulo: "Control prenatal y obstetra en Maturín",
    metaTitulo: "Control prenatal y obstetra en Maturín | Dra. Hilda Mary Díaz",
    metaDescripcion:
      "Control del embarazo en Maturín, Monagas: consultas, ecografía obstétrica y seguimiento hasta el parto. Clínica Tierra Santa. Agenda al 0412-0896444.",
    entrada: [
      "El control prenatal es el seguimiento del embarazo desde la concepción hasta el parto, cuidando la salud de la mamá y la del bebé. La Dra. Hilda Mary Díaz García lo realiza en la Clínica Tierra Santa, en Maturín, con más de 20 años de experiencia en obstetricia.",
      "La idea es simple: llegar al parto sin sorpresas. Eso se logra con consultas a tiempo, los estudios que corresponden a cada etapa y una paciente que entiende qué está pasando en su cuerpo.",
    ],
    secciones: [
      {
        titulo: "Qué incluye el control del embarazo",
        items: [
          {
            titulo: "Confirmación y fecha probable de parto",
            texto:
              "Se confirma el embarazo, se calcula el tiempo de gestación y la fecha estimada del parto.",
          },
          {
            titulo: "Exámenes de laboratorio",
            texto:
              "Los estudios que corresponden a cada trimestre para vigilar anemia, infecciones y otros riesgos.",
          },
          {
            titulo: "Ecografía obstétrica",
            texto:
              "Evaluación del crecimiento del bebé, el líquido amniótico y la placenta a lo largo del embarazo.",
          },
          {
            titulo: "Control de peso y tensión",
            texto:
              "En cada consulta, porque son de los primeros indicios de complicaciones como la preeclampsia.",
          },
          {
            titulo: "Suplementos e indicaciones",
            texto:
              "Ácido fólico, hierro y recomendaciones de alimentación, actividad y reposo según tu caso.",
          },
          {
            titulo: "Preparación para el parto",
            texto:
              "Qué esperar, cuándo acudir a la clínica y qué señales no se deben dejar pasar.",
          },
        ],
      },
      {
        titulo: "Cada cuánto son las consultas",
        parrafos: [
          "En un embarazo sin complicaciones, el esquema habitual es una consulta al mes hasta la semana 28, cada dos semanas entre la 28 y la 36, y una consulta semanal desde la semana 36 hasta el parto.",
          "Si aparece algún factor que requiera más vigilancia —presión alta, diabetes gestacional, embarazo múltiple o antecedentes que lo justifiquen— los controles se hacen más seguidos y se suman los estudios que el caso amerite.",
        ],
      },
      {
        titulo: "Señales de alarma: no esperes la próxima cita",
        parrafos: [
          "Acude de inmediato ante sangrado vaginal, pérdida de líquido, dolor de cabeza intenso con visión borrosa, hinchazón repentina de cara y manos, fiebre, dolor abdominal fuerte, contracciones regulares antes de la semana 37 o disminución de los movimientos del bebé después de la semana 28.",
          "Ante cualquiera de estos síntomas, lo correcto es acudir al servicio de emergencia obstétrica y avisar al consultorio, no esperar a la consulta programada.",
        ],
      },
      {
        titulo: "La ecografía en cada etapa",
        parrafos: [
          "En el primer trimestre confirma que el embarazo evoluciona bien y precisa el tiempo de gestación. Alrededor de la mitad del embarazo se realiza la evaluación morfológica, que revisa en detalle la anatomía del bebé. En el tercer trimestre se vigila el crecimiento, la posición, el líquido amniótico y la placenta.",
        ],
      },
      {
        titulo: "Dónde agendar tu control prenatal en Maturín",
        parrafos: [
          AGENDAR,
          "Para la primera consulta, trae tu prueba de embarazo si la tienes, la fecha de tu última menstruación, los laboratorios que te hayas hecho y la lista de medicamentos o suplementos que tomas.",
        ],
      },
    ],
    faqs: [
      {
        pregunta: "¿Cuándo debo ir a la primera consulta prenatal?",
        respuesta:
          "Apenas tengas una prueba de embarazo positiva o un retraso significativo, idealmente antes de las 10 semanas. La primera consulta temprana permite confirmar el embarazo, calcular bien el tiempo de gestación e iniciar los suplementos que corresponden.",
      },
      {
        pregunta: "¿Atienden embarazos que requieren más vigilancia?",
        respuesta:
          "La evaluación inicial define si tu embarazo necesita controles más frecuentes o estudios adicionales, y el seguimiento se organiza según ese resultado. Si tienes antecedentes como hipertensión, diabetes o pérdidas previas, menciónalo desde la primera consulta.",
      },
      {
        pregunta: "¿Puedo hacer seguimiento de mis resultados por WhatsApp?",
        respuesta:
          "Sí, hay orientación y seguimiento de resultados por WhatsApp para pacientes activas. Los diagnósticos nuevos, los síntomas agudos y las recetas requieren consulta presencial.",
      },
    ],
    relacionadas: ["ginecologo-en-maturin", "fertilidad-en-maturin"],
  },
  {
    slug: "fertilidad-en-maturin",
    etiqueta: "Fertilidad en Maturín",
    titulo: "Tratamiento de fertilidad en Maturín",
    metaTitulo: "Tratamiento de fertilidad en Maturín | Dra. Hilda Mary Díaz",
    metaDescripcion:
      "Consulta de fertilidad en Maturín, Monagas: evaluación de la pareja, estudios y tratamiento de reproducción asistida. Clínica Tierra Santa. Tel. 0412-0896444.",
    entrada: [
      "Cuando el embarazo no llega, lo primero no es tratar: es entender por qué. La Dra. Hilda Mary Díaz García es subespecialista en Fertilidad y Reproducción, formada en UNIFERTES — Clínica El Ávila, y atiende consultas de fertilidad en Maturín, estado Monagas.",
      "La evaluación es de la pareja, no solo de la mujer. De ahí sale un diagnóstico y, con él, un plan realista, explicado con claridad antes de empezar.",
    ],
    secciones: [
      {
        titulo: "Cuándo consultar por fertilidad",
        parrafos: [
          "Si tienes menos de 35 años y llevas 12 meses buscando el embarazo sin lograrlo, es momento de consultar. Si tienes 35 años o más, el tiempo recomendado baja a 6 meses, porque el factor tiempo pesa.",
          "No esperes ese plazo si tienes ciclos muy irregulares o ausentes, endometriosis conocida, pérdidas del embarazo a repetición, cirugías pélvicas previas o si a tu pareja le han diagnosticado alguna alteración seminal.",
        ],
      },
      {
        titulo: "Cómo es la evaluación inicial",
        items: [
          {
            titulo: "Historia clínica de la pareja",
            texto:
              "Tiempo de búsqueda, antecedentes, cirugías, hábitos y estudios previos de ambos.",
          },
          {
            titulo: "Evaluación hormonal",
            texto:
              "Laboratorios en días específicos del ciclo para evaluar la ovulación y la reserva ovárica.",
          },
          {
            titulo: "Ecografía ginecológica",
            texto:
              "Estudio del útero y los ovarios: miomas, pólipos, quistes o alteraciones que influyan.",
          },
          {
            titulo: "Estudio del factor masculino",
            texto:
              "El espermatograma es uno de los primeros estudios: buena parte de los casos involucra al hombre.",
          },
        ],
      },
      {
        titulo: "Qué viene después del diagnóstico",
        parrafos: [
          "El tratamiento depende de la causa encontrada. En unos casos se corrige un problema hormonal o de ovulación; en otros se requiere un procedimiento o una técnica de reproducción asistida. Lo que no cambia es el orden: primero el diagnóstico, después el tratamiento.",
          "Antes de iniciar cualquier plan se explica en qué consiste, qué resultados se pueden esperar y qué implica en tiempo y en costos. Decidir con información completa es parte del tratamiento.",
        ],
      },
      {
        titulo: "El acompañamiento también cuenta",
        parrafos: [
          "Buscar un embarazo que no llega desgasta. Por eso la consulta incluye tiempo para preguntas, explicación de cada resultado y seguimiento entre citas.",
          "La doctora también escribió la Guía Práctica Clínica de Fertilidad, un material para entender el proceso con calma y llegar mejor preparada a la consulta.",
        ],
      },
      {
        titulo: "Dónde agendar tu consulta de fertilidad",
        parrafos: [AGENDAR],
      },
    ],
    faqs: [
      {
        pregunta: "¿Debe asistir también mi pareja a la consulta de fertilidad?",
        respuesta:
          "Sí. La fertilidad se evalúa en pareja, y el factor masculino está presente en buena parte de los casos. Lo ideal es que ambos acudan a la primera consulta, o al menos que el estudio del hombre se realice desde el inicio.",
      },
      {
        pregunta: "¿Cuánto tarda el estudio inicial de fertilidad?",
        respuesta:
          "Suele tomar al menos un ciclo menstrual completo, porque varios estudios hormonales y ecográficos se realizan en días específicos del ciclo. Con esos resultados en mano se define el diagnóstico y el plan.",
      },
      {
        pregunta: "¿La consulta de fertilidad es igual a la consulta ginecológica?",
        respuesta:
          "No. La consulta ginecológica se centra en tu salud general; la de fertilidad está dirigida a encontrar por qué no se logra el embarazo e incluye la evaluación de ambos miembros de la pareja. Al agendar, indica que tu motivo es fertilidad.",
      },
    ],
    relacionadas: ["ginecologo-en-maturin", "control-prenatal-en-maturin"],
  },
];

export function getPaginaLocal(slug: string): PaginaLocal {
  const pagina = PAGINAS_LOCALES.find((p) => p.slug === slug);
  if (!pagina) throw new Error(`Página local desconocida: ${slug}`);
  return pagina;
}

/** Metadatos de cada página, con su canónica propia. */
export function metadataLocal(pagina: PaginaLocal): Metadata {
  return {
    title: pagina.metaTitulo,
    description: pagina.metaDescripcion,
    alternates: { canonical: `/${pagina.slug}` },
    openGraph: {
      title: pagina.metaTitulo,
      description: pagina.metaDescripcion,
      url: `/${pagina.slug}`,
      type: "article",
      locale: "es_VE",
    },
  };
}
