import Image from "next/image";
import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import { FOTOS } from "@/lib/fotos";

const coordenadas = [
  { clave: "Consultorio", valor: "Clínica Tierra Santa, Piso 3, Consultorio 3" },
  { clave: "Ciudad", valor: "Maturín, Monagas, Venezuela" },
  { clave: "Atención", valor: "Lunes a viernes, 8:00 AM – 5:00 PM" },
];

/**
 * Banda de enfoque: fotografía documental más la declaración de cómo se
 * trabaja en la consulta. Corta el ritmo de tarjetas sin recurrir a un bloque
 * oscuro que rompería la calidez del resto.
 */
export default function Statement() {
  const foto = FOTOS.conPaciente;

  return (
    <section className="bg-cream py-24 lg:py-32" aria-labelledby="statement-heading">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Foto en su proporción real (828×1106) */}
          <Reveal className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 h-28 w-28 rounded-full bg-rose-pale/60 blur-2xl"
            />
            <div className="photo relative shadow-lift">
              <Image
                src={foto.src}
                alt={foto.alt}
                width={foto.width}
                height={foto.height}
                sizes="(max-width: 1024px) 90vw, 480px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>

          {/* Declaración */}
          <Reveal delay={90}>
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full bg-magenta text-white"
            >
              <Quote size={22} strokeWidth={2} />
            </span>

            <blockquote className="mt-8">
              <p
                id="statement-heading"
                className="display text-[2.125rem] leading-[1.15] sm:text-[2.625rem] lg:text-[3rem]"
              >
                Cada consulta empieza{" "}
                <em className="text-magenta">escuchando</em>.
              </p>
            </blockquote>

            <p className="mt-7 max-w-xl text-[16.5px] leading-[1.78] text-plum-soft">
              Diagnóstico ecográfico, control prenatal y tratamientos de fertilidad
              con explicación clara de cada paso, tiempos realistas y seguimiento
              continuo. Sin promesas que la medicina no pueda sostener.
            </p>

            <dl className="mt-10 space-y-4">
              {coordenadas.map(({ clave, valor }) => (
                <div
                  key={clave}
                  className="grid gap-x-6 gap-y-1 border-b border-line-strong pb-4 sm:grid-cols-[120px_1fr]"
                >
                  <dt className="eyebrow pt-1 text-magenta">{clave}</dt>
                  <dd className="text-[14.5px] leading-snug text-plum-soft">{valor}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
