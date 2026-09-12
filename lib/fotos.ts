/**
 * Registro de fotografías con sus dimensiones REALES.
 *
 * Cada foto tiene una proporción distinta (de 0.61 a 1.00). Forzarlas todas a
 * un mismo recorte era lo que las dejaba "mal sentadas": cortaba cabezas en las
 * de cuerpo completo y dejaba aire muerto en las cuadradas. Aquí se declara el
 * tamaño intrínseco para que cada imagen se muestre en su propia proporción,
 * sin recorte. Cuando un bloque sí necesita recorte, `focus` indica qué parte
 * de la foto debe conservarse.
 */

export type Foto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** object-position para los pocos casos en que sí se recorta. */
  focus: string;
};

export const FOTOS = {
  /** Retrato principal: de pie junto a la puerta de su consultorio. */
  dePie: {
    src: "/images/foto2.jpg",
    width: 828,
    height: 1013,
    alt: "La Dra. Hilda Mary Díaz García de pie en la entrada de su consultorio en Clínica Tierra Santa, Maturín",
    focus: "50% 25%",
  },
  ecografo: {
    src: "/images/foto-principal.png",
    width: 516,
    height: 596,
    alt: "La Dra. Hilda Díaz sentada frente al equipo de ecografía en su consultorio",
    focus: "50% 20%",
  },
  conBebe: {
    src: "/images/foto5.jpg",
    width: 827,
    height: 925,
    alt: "La Dra. Hilda Díaz con una bebé en brazos durante una consulta de control",
    focus: "55% 35%",
  },
  reciénNacida: {
    src: "/images/foto6.jpg",
    width: 828,
    height: 934,
    alt: "La Dra. Hilda Díaz cargando a una recién nacida en su consultorio",
    focus: "50% 30%",
  },
  conPaciente: {
    src: "/images/foto4.jpg",
    width: 828,
    height: 1106,
    alt: "La Dra. Hilda Díaz acompañando a una paciente antes de entrar a quirófano",
    focus: "35% 30%",
  },
  quirofano: {
    src: "/images/foto8.jpg",
    width: 828,
    height: 866,
    alt: "La Dra. Hilda Díaz en el área quirúrgica de la clínica",
    focus: "40% 30%",
  },
  nacimiento: {
    src: "/images/foto7.jpg",
    width: 828,
    height: 830,
    alt: "Recién nacido momentos después del parto atendido por la Dra. Hilda Díaz",
    focus: "50% 40%",
  },
  consulta: {
    src: "/images/foto3.jpg",
    width: 828,
    height: 986,
    alt: "La Dra. Hilda Díaz escribiendo la historia clínica de una paciente",
    focus: "50% 30%",
  },
  educacion: {
    src: "/images/foto1.jpg",
    width: 828,
    height: 868,
    alt: "La Dra. Hilda Díaz explicando el uso de la copa menstrual en consulta",
    focus: "50% 35%",
  },
  corriendo: {
    src: "/images/foto9.jpg",
    width: 828,
    height: 1362,
    alt: "La Dra. Hilda Díaz entrenando al atardecer fuera del consultorio",
    focus: "50% 25%",
  },
} as const satisfies Record<string, Foto>;

/** Galería del archivo, en el orden en que se muestra. */
export const GALERIA: Foto[] = [
  FOTOS.conBebe,
  FOTOS.reciénNacida,
  FOTOS.quirofano,
  FOTOS.conPaciente,
  FOTOS.nacimiento,
  FOTOS.consulta,
  FOTOS.educacion,
  FOTOS.corriendo,
];
