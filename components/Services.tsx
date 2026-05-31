import {
  Baby,
  Heart,
  Microscope,
  Activity,
  ShieldCheck,
  Scan,
  Syringe,
  FlaskConical,
} from "lucide-react";

const servicios = [
  {
    icon: Baby,
    titulo: "Control Prenatal",
    descripcion:
      "Seguimiento integral del embarazo desde la concepción hasta el parto, garantizando la salud de mamá y bebé.",
    color: "rose",
  },
  {
    icon: Heart,
    titulo: "Ginecología General",
    descripcion:
      "Consulta ginecológica preventiva y de diagnóstico, incluyendo Papanicolaou, colposcopia y revisión de salud femenina.",
    color: "sky",
  },
  {
    icon: FlaskConical,
    titulo: "Fertilidad y Reproducción",
    descripcion:
      "Evaluación y tratamiento de parejas con dificultades para concebir, con técnicas modernas de reproducción asistida.",
    color: "rose",
  },
  {
    icon: Microscope,
    titulo: "Diagnóstico Colposcópico",
    descripcion:
      "Estudio detallado del cuello uterino para la detección temprana de lesiones precancerosas y cáncer cervical.",
    color: "sky",
  },
  {
    icon: Activity,
    titulo: "Planificación Familiar",
    descripcion:
      "Orientación y prescripción de métodos anticonceptivos adaptados a las necesidades y estilo de vida de cada paciente.",
    color: "rose",
  },
  {
    icon: Scan,
    titulo: "Ecografía Obstétrica",
    descripcion:
      "Ultrasonido obstétrico y ginecológico para evaluación fetal, diagnóstico de patologías y seguimiento del embarazo.",
    color: "sky",
  },
  {
    icon: ShieldCheck,
    titulo: "Menopausia y Climaterio",
    descripcion:
      "Manejo integral de los síntomas de la menopausia, incluyendo terapia hormonal y bienestar en esta etapa de vida.",
    color: "rose",
  },
  {
    icon: Syringe,
    titulo: "Procedimientos Menores",
    descripcion:
      "Inserción de DIU, biopsias ginecológicas, y otros procedimientos ambulatorios realizados con alta seguridad.",
    color: "sky",
  },
];

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-2">
            Especialidades
          </p>
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Servicios Médicos
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Atención especializada en todas las áreas de la salud femenina, con tecnología de vanguardia
            y un enfoque humano y personalizado.
          </p>
          <div className="mt-4 mx-auto w-16 h-1 bg-[#f06292] rounded-full" aria-hidden="true" />
        </div>

        {/* Grid de servicios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {servicios.map(({ icon: Icon, titulo, descripcion, color }) => (
            <article
              key={titulo}
              role="listitem"
              className={`group bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                color === "rose"
                  ? "border-rose-100 hover:border-rose-200"
                  : "border-sky-100 hover:border-sky-200"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 ${
                  color === "rose"
                    ? "bg-rose-100 group-hover:bg-rose-200"
                    : "bg-sky-100 group-hover:bg-sky-200"
                }`}
                aria-hidden="true"
              >
                <Icon
                  size={22}
                  className={color === "rose" ? "text-[#f06292]" : "text-[#0288d1]"}
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{descripcion}</p>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-gray-500 mb-4">
            ¿Tienes dudas sobre algún servicio? Con gusto te orientamos.
          </p>
          <a
            href="https://oz-med.vercel.app/reservar/hildadiaz"
            aria-label="Agendar consulta en línea"
            className="inline-flex items-center gap-2 bg-[#f06292] text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-rose-200 hover:bg-[#ec407a] transition-all duration-200"
          >
            Agendar Consulta
          </a>
        </div>
      </div>
    </section>
  );
}
