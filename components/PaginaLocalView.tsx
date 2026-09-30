import Link from "next/link";
import { Phone, MapPin, Clock, ArrowRight, ChevronRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPaginaLocal, type PaginaLocal } from "@/lib/paginas-locales";

const SITE = "https://drahildadiaz.com";
const RESERVAR = "https://ozmedical.app/reservar/hildadiaz";

/**
 * Página de contenido local. La portada existe para presentar el consultorio;
 * estas existen para responder la búsqueda concreta que trae a la paciente
 * desde Google ("ginecólogo en Maturín") y llevarla a agendar.
 */
export default function PaginaLocalView({ pagina }: { pagina: PaginaLocal }) {
  const url = `${SITE}/${pagina.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${url}#pagina`,
        url,
        name: pagina.metaTitulo,
        description: pagina.metaDescripcion,
        inLanguage: "es-VE",
        about: { "@id": `${SITE}/#consultorio` },
        author: { "@id": `${SITE}/#dra-hilda-diaz` },
        isPartOf: { "@id": `${SITE}/#consultorio` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#ruta`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: pagina.etiqueta, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: pagina.faqs.map(({ pregunta, respuesta }) => ({
          "@type": "Question",
          name: pregunta,
          acceptedAnswer: { "@type": "Answer", text: respuesta },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      <main id="main-content">
        {/* Encabezado */}
        <section className="bg-cream pb-16 pt-32 lg:pb-20 lg:pt-44">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <Reveal>
              <nav aria-label="Ruta de navegación" className="mb-8">
                <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-mauve">
                  <li>
                    <Link href="/" className="transition-colors hover:text-magenta">
                      Inicio
                    </Link>
                  </li>
                  <li aria-hidden="true" className="flex items-center">
                    <ChevronRight size={14} strokeWidth={2} />
                  </li>
                  <li aria-current="page" className="text-plum-soft">
                    {pagina.etiqueta}
                  </li>
                </ol>
              </nav>

              <span className="eyebrow inline-flex rounded-full bg-blush px-4 py-2 text-magenta-deep">
                {pagina.etiqueta}
              </span>

              <h1 className="display mt-6 max-w-4xl text-[2.125rem] sm:text-[2.75rem] lg:text-[3.25rem]">
                {pagina.titulo}
              </h1>

              <div className="mt-6 max-w-2xl space-y-4">
                {pagina.entrada.map((parrafo) => (
                  <p key={parrafo} className="text-[17px] leading-[1.75] text-plum-soft">
                    {parrafo}
                  </p>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={RESERVAR} className="btn btn-primary group">
                  Agendar cita
                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                <a href="tel:+584120896444" className="btn btn-outline tnum">
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  0412 089 6444
                </a>
              </div>

              <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
                <div className="card flex gap-3 p-5">
                  <MapPin
                    size={18}
                    strokeWidth={1.9}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-magenta"
                  />
                  <div>
                    <dt className="text-[12.5px] font-semibold uppercase tracking-wide text-mauve">
                      Consultorio
                    </dt>
                    <dd className="mt-1 text-[14.5px] leading-snug text-plum-soft">
                      Clínica Tierra Santa, piso 3, consultorio 3 — Maturín, Monagas
                    </dd>
                  </div>
                </div>

                <div className="card flex gap-3 p-5">
                  <Clock
                    size={18}
                    strokeWidth={1.9}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-magenta"
                  />
                  <div>
                    <dt className="text-[12.5px] font-semibold uppercase tracking-wide text-mauve">
                      Horario
                    </dt>
                    <dd className="mt-1 text-[14.5px] leading-snug text-plum-soft">
                      Lunes a viernes, 8:00 AM – 5:00 PM
                    </dd>
                  </div>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Contenido */}
        <section className="bg-blush py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] space-y-16 px-5 sm:px-8 lg:space-y-20">
            {pagina.secciones.map((seccion) => (
              <Reveal key={seccion.titulo}>
                <article className="max-w-3xl">
                  <h2 className="display text-[1.75rem] sm:text-[2.125rem]">
                    {seccion.titulo}
                  </h2>

                  {seccion.parrafos && (
                    <div className="mt-5 space-y-4">
                      {seccion.parrafos.map((parrafo) => (
                        <p
                          key={parrafo}
                          className="text-[16px] leading-[1.78] text-plum-soft"
                        >
                          {parrafo}
                        </p>
                      ))}
                    </div>
                  )}
                </article>

                {seccion.items && (
                  <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {seccion.items.map((item) => (
                      <li key={item.titulo} className="card h-full p-6">
                        <span
                          aria-hidden="true"
                          className="grid h-9 w-9 place-items-center rounded-full bg-blush text-magenta"
                        >
                          <Check size={16} strokeWidth={2.5} />
                        </span>
                        <h3 className="display-md mt-4 text-[1.0625rem]">{item.titulo}</h3>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-plum-soft">
                          {item.texto}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section className="bg-cream py-20 lg:py-24" aria-labelledby="faq-local">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal>
              <h2 id="faq-local" className="display text-[1.875rem] sm:text-[2.25rem]">
                Preguntas frecuentes
              </h2>
            </Reveal>

            <dl className="mt-10 space-y-4">
              {pagina.faqs.map((faq, i) => (
                <Reveal key={faq.pregunta} delay={i * 40}>
                  <div className="card p-6">
                    <dt className="display-md text-[1.0625rem] sm:text-[1.125rem]">
                      {faq.pregunta}
                    </dt>
                    <dd className="mt-3 text-[15px] leading-[1.72] text-plum-soft">
                      {faq.respuesta}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={80}>
              <div className="mt-10 flex flex-col items-center gap-5 rounded-[var(--radius-xl)] bg-magenta px-8 py-9 text-center sm:flex-row sm:justify-between sm:text-left">
                <p className="max-w-sm text-[15.5px] leading-relaxed text-on-dark-soft">
                  ¿Tu duda no está aquí? Llama al consultorio y te orientamos antes de
                  reservar.
                </p>
                <a href="tel:+584120896444" className="btn btn-light tnum shrink-0">
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  0412 089 6444
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Otras consultas */}
        <section className="bg-blush py-20 lg:py-24" aria-labelledby="relacionadas">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
            <Reveal>
              <h2 id="relacionadas" className="display text-[1.75rem] sm:text-[2.125rem]">
                Otras consultas del consultorio
              </h2>
            </Reveal>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {pagina.relacionadas.map((slug, i) => {
                const otra = getPaginaLocal(slug);
                return (
                  <Reveal as="li" key={slug} delay={i * 60}>
                    <Link
                      href={`/${otra.slug}`}
                      className="card card-hover group flex h-full items-start justify-between gap-5 p-7"
                    >
                      <span>
                        <span className="display-md block text-[1.1875rem] transition-colors group-hover:text-magenta">
                          {otra.titulo}
                        </span>
                        <span className="mt-2 block text-[14.5px] leading-relaxed text-plum-soft">
                          {otra.metaDescripcion}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-rose transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
