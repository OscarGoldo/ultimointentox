import Ovum from "./Ovum";
import IconoWhatsApp from "./IconoWhatsApp";
import { AGENDAR_URL, WHATSAPP_URL } from "./datos";

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="rd-hero-title"
      className="relative overflow-hidden pt-[84px] lg:flex lg:min-h-[100svh] lg:items-center lg:pt-[76px]"
    >
      {/* En móvil el óvulo va arriba; en escritorio ocupa la mitad derecha y
          el trazo celeste sale por el borde de la pantalla. */}
      <div className="-ml-[2vw] w-[112vw] sm:mx-auto sm:w-[80vw] sm:max-w-[760px] lg:absolute lg:left-[46vw] lg:top-1/2 lg:m-0 lg:w-[58vw] lg:max-w-none lg:-translate-y-1/2 xl:left-[43vw] xl:w-[63vw]">
        <Ovum />
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-20 sm:px-8 lg:pb-0">
        <div className="max-w-[640px] lg:max-w-[42vw] xl:max-w-[40vw] 2xl:max-w-[680px]">
          {/* Los espacios entre líneas no se ven (cada línea es un bloque), pero
              sin ellos Google y los lectores de pantalla leen "tien", "etapade" */}
          <h1 id="rd-hero-title" className="rd-display text-[clamp(3.6rem,7.4vw,7.75rem)]">
            <span className="rd-line">
              <span style={{ "--i": 0 } as React.CSSProperties}>Cuidar de ti</span>
            </span>{" "}
            <span className="rd-line">
              <span style={{ "--i": 1 } as React.CSSProperties}>en cada etapa</span>
            </span>{" "}
            <span className="rd-line">
              <span style={{ "--i": 2 } as React.CSSProperties}>de tu vida.</span>
            </span>
          </h1>

          <p className="rd-fade rd-lead mt-7 max-w-[34rem] sm:text-[1.1875rem]">
            Soy la Dra. Hilda Mary Díaz García, ginecóloga, obstetra y
            especialista en fertilidad. Desde hace más de 20 años acompaño a
            mujeres de Maturín en su revisión anual, en la búsqueda de un bebé y
            en cada control del embarazo.
          </p>

          <div
            className="rd-fade mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ "--delay": "780ms" } as React.CSSProperties}
          >
            <a href={AGENDAR_URL} className="rd-btn rd-btn-primary">
              Agendar cita
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-btn rd-btn-ghost"
            >
              <IconoWhatsApp size={19} />
              Escribir por WhatsApp
            </a>
          </div>

          <address
            className="rd-fade mt-12 grid gap-1 text-[15px] not-italic leading-snug text-ink-soft"
            style={{ "--delay": "900ms" } as React.CSSProperties}
          >
            <span className="font-semibold text-wine">Clínica Tierra Santa, piso 3, consultorio 3</span>
            <span>Maturín. Lunes a viernes, de 8:00 a.m. a 5:00 p.m.</span>
          </address>
        </div>
      </div>
    </section>
  );
}
