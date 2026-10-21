import Link from "next/link";
import { Phone, ArrowRight, ChevronRight } from "lucide-react";
import Header from "@/components/portada/Header";
import Footer from "@/components/portada/Footer";
import { CENTRO, Corona, CORONA_EXTERIOR, CORONA_INTERIOR } from "@/components/portada/corona";
import { AGENDAR_URL, MAPS_URL, TELEFONO } from "@/components/portada/datos";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPaginaLocal, type PaginaLocal } from "@/lib/paginas-locales";
import "@/app/portada.css";

const SITE = "https://drahildadiaz.com";

/** Que el teléfono no se parta en dos líneas por el guion. */
function telefonoSinCortes(texto: string) {
  return texto.split(TELEFONO.visible).flatMap((parte, i) =>
    i === 0
      ? [parte]
      : [
          <span key={i} className="whitespace-nowrap">
            {TELEFONO.visible}
          </span>,
          parte,
        ]
  );
}

/**
 * Página de contenido local. La portada existe para presentar el consultorio;
 * estas existen para responder la búsqueda concreta que trae a la paciente
 * desde Google ("ginecólogo en Maturín") y llevarla a agendar. Visten el
 * mismo diseño que la portada (.rd) para que pasar de una a otra no salte.
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
    <div className="rd">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      <main id="main-content">
        {/* Encabezado */}
        <section
          aria-labelledby="rd-local-title"
          className="pb-20 pt-[112px] lg:pb-28 lg:pt-[152px]"
        >
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-6">
            <div
              className="rd-fade lg:col-span-7"
              style={{ "--delay": "60ms" } as React.CSSProperties}
            >
              <nav aria-label="Ruta de navegación">
                <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-ink-soft">
                  <li>
                    <Link href="/" className="transition-colors hover:text-magenta">
                      Inicio
                    </Link>
                  </li>
                  <li aria-hidden="true" className="flex items-center">
                    <ChevronRight size={14} strokeWidth={2} />
                  </li>
                  <li aria-current="page" className="font-medium text-wine">
                    {pagina.etiqueta}
                  </li>
                </ol>
              </nav>

              <h1
                id="rd-local-title"
                className="rd-display mt-8 text-balance text-[clamp(2.75rem,5.4vw,5.25rem)] leading-[1]"
              >
                {pagina.titulo}
              </h1>

              <div className="mt-8 max-w-[38rem] space-y-4">
                {pagina.entrada.map((parrafo) => (
                  <p key={parrafo} className="rd-lead">
                    {telefonoSinCortes(parrafo)}
                  </p>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={AGENDAR_URL} className="rd-btn rd-btn-primary">
                  Agendar cita
                </a>
                <a href={TELEFONO.href} className="rd-btn rd-btn-ghost tnum">
                  <Phone size={17} strokeWidth={2} aria-hidden="true" />
                  {TELEFONO.visible}
                </a>
              </div>
            </div>

            <aside
              aria-label="Consultorio y horario"
              className="rd-fade lg:col-span-4 lg:col-start-9"
              style={{ "--delay": "220ms" } as React.CSSProperties}
            >
              <div className="relative overflow-hidden rounded-[28px] bg-wine p-8 text-milk sm:p-10 lg:rounded-[36px]">
                {/* Eco del óvulo de la portada, quieto */}
                <svg
                  viewBox="0 0 600 600"
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-[150px] -top-[150px] w-[340px] opacity-35"
                >
                  <Corona petalos={CORONA_EXTERIOR} />
                  <Corona petalos={CORONA_INTERIOR} />
                  <circle cx={CENTRO} cy={CENTRO} r="214" fill="none" stroke="#c2185b" strokeWidth="2" />
                </svg>

                <dl className="relative grid gap-6 text-[15.5px] leading-relaxed">
                  <div>
                    <dt className="font-semibold">Consultorio</dt>
                    <dd className="mt-1 text-on-wine-soft">
                      Clínica Tierra Santa, piso 3, consultorio 3 — Maturín, Monagas
                    </dd>
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <dt className="font-semibold">Horario</dt>
                    <dd className="mt-1 text-on-wine-soft">
                      Lunes a viernes, 8:00 AM – 5:00 PM
                    </dd>
                  </div>
                </dl>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rd-btn rd-btn-ghost-light relative mt-8 w-full"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* Contenido */}
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          {pagina.secciones.map((seccion) => (
            <article
              key={seccion.titulo}
              className="grid gap-8 border-t border-wine/12 py-16 lg:grid-cols-12 lg:gap-6 lg:py-24"
            >
              <div className="lg:col-span-4">
                <h2 className="rd-title text-[clamp(2.1rem,3.4vw,3.25rem)] lg:sticky lg:top-[104px]">
                  {seccion.titulo}
                </h2>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                {seccion.parrafos && (
                  <div className="max-w-[40rem] space-y-5">
                    {seccion.parrafos.map((parrafo) => (
                      <p
                        key={parrafo}
                        className="text-[1.0625rem] leading-[1.75] text-wine/80"
                      >
                        {telefonoSinCortes(parrafo)}
                      </p>
                    ))}
                  </div>
                )}

                {seccion.items && (
                  <ul className="grid gap-x-10 sm:grid-cols-2">
                    {seccion.items.map((item) => (
                      <li key={item.titulo} className="border-t border-wine/15 pb-8 pt-6">
                        <h3 className="flex gap-3 text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em]">
                          <span
                            aria-hidden="true"
                            className="mt-[0.5em] h-2 w-2 shrink-0 rounded-full bg-magenta"
                          />
                          {item.titulo}
                        </h3>
                        <p className="mt-2 pl-5 text-[15.5px] leading-relaxed text-ink-soft">
                          {telefonoSinCortes(item.texto)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Preguntas frecuentes */}
        <section aria-labelledby="faq-local" className="bg-petal/45 py-24 lg:py-36">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[104px]">
                <h2 id="faq-local" className="rd-title text-[clamp(2.6rem,4.6vw,4.25rem)]">
                  Preguntas frecuentes
                </h2>
                <p className="rd-lead mt-5 max-w-[24rem]">
                  ¿Tu duda no está aquí? Llama al consultorio y te orientamos antes de
                  reservar.
                </p>
                <a href={TELEFONO.href} className="rd-btn rd-btn-ghost tnum mt-8">
                  <Phone size={17} strokeWidth={2} aria-hidden="true" />
                  {TELEFONO.visible}
                </a>
              </div>
            </div>

            <dl className="border-t border-wine/15 lg:col-span-7 lg:col-start-6">
              {pagina.faqs.map((faq) => (
                <div key={faq.pregunta} className="border-b border-wine/15 py-7">
                  <dt className="text-[1.25rem] font-semibold leading-snug tracking-[-0.01em] sm:text-[1.375rem]">
                    {faq.pregunta}
                  </dt>
                  <dd className="mt-3 max-w-[40rem] text-[1.0625rem] leading-relaxed text-wine/80">
                    {telefonoSinCortes(faq.respuesta)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Otras consultas */}
        <section aria-labelledby="relacionadas" className="bg-celeste py-24 lg:py-32">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <h2 id="relacionadas" className="rd-title text-[clamp(2.4rem,4.6vw,4.25rem)]">
              Otras consultas del consultorio
            </h2>

            <ul className="mt-10 border-t border-wine/12">
              {pagina.relacionadas.map((slug) => {
                const otra = getPaginaLocal(slug);
                return (
                  <li key={slug} className="border-b border-wine/12">
                    <Link
                      href={`/${otra.slug}`}
                      className="rd-row -mx-3 my-2 grid grid-cols-[1fr_auto] items-center gap-6 px-3 py-6 sm:-mx-5 sm:px-5"
                    >
                      <span>
                        <span className="rd-title block text-[clamp(1.75rem,3vw,2.5rem)]">
                          {otra.titulo}
                        </span>
                        <span className="rd-row-sub tnum mt-2 block max-w-[46rem] text-[15.5px] leading-snug text-ink-soft">
                          {telefonoSinCortes(otra.metaDescripcion)}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="rd-row-icon grid h-14 w-14 place-items-center rounded-full bg-milk text-magenta-deep"
                      >
                        <ArrowRight size={21} strokeWidth={1.8} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
