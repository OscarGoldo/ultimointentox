/**
 * Configuración del producto (ebook) y de los datos de cobro.
 * El precio base está en USD. Zelle se cobra en USD; Pago Móvil en
 * bolívares usando la tasa EURO del BCV (ver lib/bcv.ts).
 */

export const EBOOK = {
  title: 'Guía Práctica Clínica de Fertilidad',
  edition: 'Primera Edición',
  subtitle:
    'Fisiología, diagnóstico y manejo en reproducción e infertilidad, para residentes y especialistas.',
  priceUsd: 19.99,
  authors: [
    'Dra. Hilda Mary Díaz',
    'Dra. Liliana Sánchez',
    'Dra. Fabiola Meléndez',
    'Dr. César Velásquez',
  ],
  pages: 192,
  /** Clave EXACTA del PDF dentro del bucket privado `ebook-files` (debe
   *  coincidir carácter por carácter con el archivo subido a Supabase). */
  storageKey: 'E-Book Fertilidad Guia Practica Clinica_.pdf',
  /** Nombre con el que el cliente descarga el archivo. */
  downloadName: 'Guia Practica Clinica de Fertilidad - Dra Hilda Diaz.pdf',
  chapters: [
    'Microbiota',
    'Gametogénesis',
    'Fecundación',
    'Trompa uterina',
    'Endometrio',
    'Ciclo Menstrual',
    'Historia Clínica',
    'Sangrado uterino recurrente',
    'Histerosalpingografía',
    'Histeroscopia',
    'Ecografía del ciclo menstrual',
    'Endometriosis',
    'Aborto recurrente',
    'Síndrome de ovario poliquístico',
    'Criterios de Bologna y Poseidon',
    'Síndrome de hiperestimulación ovárica',
    'Factor masculino',
    'Estudio de la pareja infértil',
    'Miomas e infertilidad',
    'Istmocele',
    'Bibliografía',
  ],
} as const

/** Datos de cobro de la doctora (los que ella misma proporcionó). */
export const PAYMENT = {
  zelle: {
    email: 'doc.hildadiaz@gmail.com',
    holder: 'Hilda Díaz',
  },
  pagoMovil: {
    banco: 'Bancaribe',
    telefono: '0412-0896444',
    cedula: '10353086',
  },
} as const
