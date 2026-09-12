import Link from "next/link";
import {
  Baby,
  HeartPulse,
  Microscope,
  CalendarHeart,
  ShieldCheck,
  Scan,
  Syringe,
  FlaskConical,
  Phone,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const servicios = [
  {
    icon: Baby,
    titulo: "Control Prenatal",
    descripcion:
      "Seguimiento integral del embarazo desde la concepción hasta el parto, cuidando la salud de mamá y bebé.",
  },
  {
    icon: HeartPulse,
    titulo: "Ginecología General",
    descripcion:
      "Consulta preventiva y de diagnóstico, incluyendo Papanicolaou, colposcopia y revisión de salud femenina.",
  },
  {
    icon: FlaskConical,
    titulo: "Fertilidad y Reproducción",
    descripcion:
      "Evaluación y tratamiento de parejas con dificultades para concebir, con técnicas modernas de reproducción asistida.",
  },
  {
    icon: Microscope,
    titulo: "Diagnóstico Colposcópico",
    descripcion:
      "Estudio detallado del cuello uterino para la detección temprana de lesiones precancerosas y cáncer cervical.",
  },
  {
    icon: CalendarHeart,
    titulo: "Planificación Familiar",
    descripcion:
      "Orientación y prescripción de métodos anticonceptivos adaptados a las necesidades de cada paciente.",
  },
  {
    icon: Scan,
    titulo: "Ecografía Obstétrica",
    descripcion:
      "Ultrasonido obstétrico y ginecológico para evaluación fetal, diagnóstico y seguimiento del embarazo.",
  },
  {
    icon: ShieldCheck,
    titulo: "Menopausia y Climaterio",
    descripcion:
      "Manejo integral de los síntomas de la menopausia, incluyendo terapia hormonal y bienestar en esta etapa.",
  },
  {
    icon: Syringe,
    titulo: "Procedimientos Menores",
    descripcion:
      "Inserción de DIU, biopsias ginecológicas y otros procedimientos ambulatorios con alta seguridad.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-blush py-24 lg:py-32" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeading
          label="Servicios"
          headingId="services-heading"
          title="Atención completa en salud femenina"
          lead="Ocho áreas de especialidad con el mismo cuidado: explicación clara, tiempos realistas y seguimiento de cada paciente."
        />

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {servicios.map(({ icon: Icon, titulo, descripcion }, i) => (
            <Reveal as="li" key={titulo} delay={(i % 4) * 70} className="h-full">
              <article className="card card-hover group flex h-full flex-col p-7">
                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 place-items-center rounded-2xl bg-blush text-magenta transition-colors duration-300 group-hover:bg-magenta group-hover:text-white"
                >
                  <Icon size={23} strokeWidth={1.8} />
                </span>
                <h3 className="display-md mt-6 text-[1.25rem]">{titulo}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-plum-soft">
                  {descripcion}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={80}>
          <div className="mt-14 overflow-hidden rounded-[var(--radius-xl)] bg-magenta px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-col items-center gap-7 text-center lg:flex-row lg:justify-between lg:text-left">
              <div>
                <h3 className="display text-[1.875rem] text-on-dark sm:text-[2.25rem]">
                  ¿Tienes dudas sobre algún servicio?
                </h3>
                <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-on-dark-soft">
                  Escríbenos y te orientamos antes de reservar. Sin compromiso.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="https://ozmedical.app/reservar/hildadiaz"
                  aria-label="Agendar consulta en línea"
                  className="btn btn-light shrink-0"
                >
                  Agendar consulta
                </Link>
                <a
                  href="tel:+584120896444"
                  className="btn tnum shrink-0 border-white/40 text-white hover:bg-white/10"
                >
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  0412 089 6444
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
