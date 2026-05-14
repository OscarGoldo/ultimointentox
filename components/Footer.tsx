import Image from "next/image";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      {/* Franja superior con CTA */}
      <div className="bg-[#f06292] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Tu salud es nuestra prioridad
          </h2>
          <p className="text-rose-100 mb-6">
            Agenda tu consulta hoy y comienza el camino hacia tu bienestar.
          </p>
          <a
            href="tel:+584120896444"
            aria-label="Llamar para agendar cita"
            className="inline-flex items-center gap-2 bg-white text-[#f06292] font-bold px-8 py-4 rounded-full hover:bg-rose-50 transition-colors duration-200 shadow-lg"
          >
            <Phone size={18} aria-hidden="true" />
            Agendar Cita Ahora
          </a>
        </div>
      </div>

      {/* Cuerpo del footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Columna logo */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative bg-white rounded-xl p-1">
                <Image
                  src="/images/Logo2.png"
                  alt="Logo Dra. Hilda Díaz García"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-tight">Dra. Hilda Mary Díaz García</p>
                <p className="text-xs text-gray-400">Gineco · Obstetra · Fertilidad</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Más de 20 años dedicados a la salud de la mujer venezolana con atención personalizada y de calidad.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.instagram.com/doc.hildadiaz/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de la Dra. Hilda Díaz"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#f06292] hover:bg-gray-700 transition-colors"
              >
                <Instagram size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Columna servicios */}
          <nav aria-label="Servicios médicos">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Especialidades
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Control Prenatal",
                "Ginecología General",
                "Fertilidad y Reproducción",
                "Planificación Familiar",
                "Colposcopia y PAP",
                "Menopausia y Climaterio",
              ].map((s) => (
                <li key={s}>
                  <span className="text-gray-400 hover:text-rose-300 transition-colors cursor-default">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Columna contacto */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Información de Contacto
            </h3>
            <address className="not-italic space-y-3 text-sm">
              <a
                href="tel:+584120896444"
                className="flex items-start gap-3 text-gray-400 hover:text-rose-300 transition-colors"
              >
                <Phone size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                0412-089-6444
              </a>
              <a
                href="mailto:dochildadiaz@gmail.com"
                className="flex items-start gap-3 text-gray-400 hover:text-rose-300 transition-colors"
              >
                <Mail size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                dochildadiaz@gmail.com
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  Clínica Tierra Santa<br />
                  Piso 3, Consultorio 3<br />
                  Maturín, Monagas, Venezuela
                </span>
              </div>
            </address>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            © {currentYear} Dra. Hilda Mary Díaz García · RIF V-10353086-1
          </p>
          <p>Maturín, Venezuela</p>
        </div>
      </div>
    </footer>
  );
}
