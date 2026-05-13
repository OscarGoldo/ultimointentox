"use client";

import Image from "next/image";
import { Phone, Calendar, Award, Users } from "lucide-react";
import { useCalBooking } from "@/components/CalBookingModal";

const stats = [
  { icon: Award, label: "Años de Experiencia", value: "20+" },
  { icon: Users, label: "Pacientes Atendidas", value: "5000+" },
  { icon: Calendar, label: "Consultas al Año", value: "800+" },
];

export default function Hero() {
  const { openModal } = useCalBooking();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-sky-50 -z-10" aria-hidden="true" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-rose-100/40 blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sky-100/40 blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-[#f06292] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#f06292] rounded-full animate-pulse" aria-hidden="true" />
              Consultando en Clínica Tierra Santa, Maturín
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4"
            >
              Tu salud{" "}
              <span className="text-[#f06292]">ginecológica</span>{" "}
              en las mejores manos
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              La <strong>Dra. Hilda Mary Díaz García</strong>, especialista en Ginecología, Obstetricia y Fertilidad,
              te acompaña en cada etapa de tu vida con atención personalizada, cálida y de alto nivel científico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={openModal}
                aria-label="Agendar cita con la Dra. Hilda Díaz"
                className="inline-flex items-center justify-center gap-2 bg-[#f06292] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-rose-200 hover:bg-[#ec407a] hover:shadow-rose-300 transition-all duration-200 group"
              >
                <Phone size={18} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
                Agendar mi Cita
              </button>
              <a
                href="#servicios"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#servicios")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#f06292] text-[#f06292] font-bold text-base px-8 py-4 rounded-full hover:bg-rose-50 transition-all duration-200"
              >
                Ver Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Icon size={20} className="text-[#f06292] mx-auto mb-1" aria-hidden="true" />
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Círculo decorativo de fondo */}
              <div
                className="absolute inset-0 scale-110 rounded-[2rem] bg-gradient-to-br from-rose-200 to-sky-200 rotate-3"
                aria-hidden="true"
              />
              <div className="relative w-[300px] h-[420px] sm:w-[380px] sm:h-[520px] rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src="/images/foto1.jpg"
                  alt="Dra. Hilda Mary Díaz García - Ginecóloga Obstetra en Maturín"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 300px, 380px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
