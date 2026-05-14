"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap, Stethoscope, Heart, CheckCircle2, X } from "lucide-react";

const formacion = [
  {
    icon: GraduationCap,
    titulo: "Médico Cirujano",
    institucion: "Universidad de Oriente (UDO)",
    detalle: "Ciudad Bolívar, Venezuela",
  },
  {
    icon: GraduationCap,
    titulo: "Especialista en Ginecología y Obstetricia",
    institucion: "Colegio de Médicos N° 1947",
    detalle: "Maturín, Venezuela",
  },
  {
    icon: Stethoscope,
    titulo: "Subespecialista en Fertilidad y Reproducción",
    institucion: "UNIFERTES - Clínica El Ávila",
    detalle: "Caracas, Venezuela",
  },
];

const valores = [
  "Atención personalizada y empática",
  "Tecnología médica de vanguardia",
  "Confidencialidad absoluta",
  "Seguimiento continuo de cada paciente",
];

const galeria = [
  { src: "/images/foto-principal.png", alt: "Dra. Hilda Díaz en consulta con ecógrafo" },
  { src: "/images/foto5.jpg", alt: "Atención neonatal" },
  { src: "/images/foto6.jpg", alt: "Cuidado del recién nacido" },
  { src: "/images/foto7.jpg", alt: "Parto y nacimiento" },
  { src: "/images/foto8.jpg", alt: "Procedimiento quirúrgico" },
  { src: "/images/foto9.jpg", alt: "Dra. Hilda Díaz activa" },
];

export default function About() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section
      id="sobre-mi"
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="about-heading"
    >
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            aria-label="Cerrar imagen"
          >
            <X size={24} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-3xl max-h-[90vh]">
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={900}
              height={700}
              className="max-h-[88vh] w-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Encabezado de sección */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-2">
            Conoce a tu doctora
          </p>
          <h2
            id="about-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Sobre la Dra. Hilda Díaz García
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-[#f06292] rounded-full" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Fotos collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md bg-white cursor-zoom-in" onClick={() => setLightbox({ src: "/images/foto2.jpg", alt: "Dra. Hilda Díaz - educación en salud femenina" })}>
                  <Image
                    src="/images/foto2.jpg"
                    alt="Dra. Hilda Díaz con copa menstrual - educación en salud femenina"
                    width={400}
                    height={500}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md bg-white cursor-zoom-in" onClick={() => setLightbox({ src: "/images/foto4.jpg", alt: "Dra. Hilda Díaz con paciente en clínica" })}>
                  <Image
                    src="/images/foto4.jpg"
                    alt="Dra. Hilda Díaz con paciente en clínica"
                    width={400}
                    height={400}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md bg-white cursor-zoom-in" onClick={() => setLightbox({ src: "/images/foto3.jpg", alt: "Dra. Hilda Díaz en consulta médica" })}>
                  <Image
                    src="/images/foto3.jpg"
                    alt="Dra. Hilda Díaz en consulta médica"
                    width={400}
                    height={400}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="bg-gradient-to-br from-pink-300 to-pink-500 rounded-2xl p-6 text-white">
                  <Heart size={28} className="mb-3 opacity-80" aria-hidden="true" />
                  <p className="text-2xl font-bold">20+ años</p>
                  <p className="text-sm opacity-90 mt-1">
                    dedicados a la salud de la mujer venezolana
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido textual */}
          <div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              La <strong className="text-gray-900">Dra. Hilda Mary Díaz García</strong> es especialista en
              Ginecología, Obstetricia y Fertilidad con más de 20 años de trayectoria en Maturín, Venezuela.
              Su consultorio ginecológico en Maturín es referencia para mujeres de toda la región de Monagas.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Su vocación de servicio y formación académica sólida la han posicionado como una referencia
              de confianza en atención obstétrica en Monagas y fertilidad en el oriente venezolano — acompañando
              a mujeres desde la adolescencia hasta la menopausia, incluyendo los retos del embarazo y la reproducción asistida.
            </p>

            {/* Formación */}
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <GraduationCap size={20} className="text-[#f06292]" aria-hidden="true" />
                Formación Académica
              </h3>
              {formacion.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.titulo}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-[#f06292]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.titulo}</p>
                      <p className="text-gray-500 text-sm">{item.institucion}</p>
                      <p className="text-gray-400 text-xs">{item.detalle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Valores */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Mi Compromiso Contigo</h3>
              <ul className="space-y-2" role="list">
                {valores.map((valor) => (
                  <li key={valor} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 size={18} className="text-[#f06292] flex-shrink-0" aria-hidden="true" />
                    {valor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Galería de fotos */}
        <div className="mt-16">
          <p className="text-center text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-6">
            Galería
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {galeria.map(({ src, alt }) => (
              <div
                key={src}
                className="rounded-2xl overflow-hidden shadow-md bg-white cursor-zoom-in hover:shadow-lg transition-shadow"
                onClick={() => setLightbox({ src, alt })}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={300}
                  height={400}
                  className="w-full h-auto"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Haz clic en una foto para ampliarla</p>
        </div>
      </div>
    </section>
  );
}
