import Link from "next/link";
import IconoWhatsApp from "./IconoWhatsApp";
import { CENTRO, Corona, CORONA_EXTERIOR, CORONA_INTERIOR } from "./corona";
import { AGENDAR_URL, CORREO, INSTAGRAM_URL, MAPS_URL, TELEFONO, WHATSAPP_URL } from "./datos";

const ESPECIALIDADES = [
  { label: "Ginecología en Maturín", href: "/ginecologo-en-maturin" },
  { label: "Control prenatal", href: "/control-prenatal-en-maturin" },
  { label: "Fertilidad", href: "/fertilidad-en-maturin" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-wine text-on-wine-soft">
      {/* Eco del óvulo de la portada, quieto */}
      <svg
        viewBox="0 0 600 600"
        aria-hidden="true"
        className="pointer-events-none absolute -right-[180px] -top-[140px] w-[620px] opacity-35 sm:-right-[120px] lg:w-[760px]"
      >
        <Corona petalos={CORONA_EXTERIOR} />
        <Corona petalos={CORONA_INTERIOR} />
        <circle cx={CENTRO} cy={CENTRO} r="214" fill="none" stroke="#c2185b" strokeWidth="2" />
      </svg>

      <div className="relative mx-auto max-w-[1320px] px-5 pb-20 pt-24 sm:px-8 lg:pb-28 lg:pt-36">
        <p className="rd-display max-w-[12ch] text-[clamp(3rem,7.4vw,7rem)] text-milk">
          Cuando estés lista, te espero en consulta.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={AGENDAR_URL} className="rd-btn rd-btn-primary">
            Agendar cita
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rd-btn rd-btn-ghost-light"
          >
            <IconoWhatsApp size={19} />
            Escribir por WhatsApp
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 text-[15px] sm:grid-cols-3 sm:px-8">
          <div>
            <h3 className="font-semibold text-milk">Consultorio</h3>
            <address className="mt-4 grid gap-1 not-italic leading-relaxed">
              <span>Clínica Tierra Santa</span>
              <span>Av. Fuerzas Armadas, piso 3, consultorio 3</span>
              <span>Maturín, Monagas</span>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-milk underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                Ver en el mapa
              </a>
            </address>
          </div>

          <div>
            <h3 className="font-semibold text-milk">Contacto</h3>
            <ul className="mt-4 grid gap-2">
              <li>
                <a href={TELEFONO.href} className="tnum transition-colors hover:text-milk">
                  {TELEFONO.visible}
                </a>
              </li>
              <li>
                <a href={`mailto:${CORREO}`} className="break-all transition-colors hover:text-milk">
                  {CORREO}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-milk"
                >
                  Instagram @doc.hildadiaz
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Especialidades">
            <h3 className="font-semibold text-milk">Especialidades</h3>
            <ul className="mt-4 grid gap-2">
              {ESPECIALIDADES.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-milk">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-2 px-5 py-6 text-[13px] sm:flex-row sm:px-8">
          <p className="tnum">
            © {year} Dra. Hilda Mary Díaz García. RIF V-10353086-1
          </p>
          <p>Maturín, Venezuela</p>
        </div>
      </div>
    </footer>
  );
}
