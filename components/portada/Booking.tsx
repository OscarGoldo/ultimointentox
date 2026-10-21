import { CalendarDays, Phone } from "lucide-react";
import IconoWhatsApp from "./IconoWhatsApp";
import { AGENDAR_URL, MAPS_URL, TELEFONO, WHATSAPP_URL } from "./datos";

const VIAS = [
  {
    nombre: "En línea",
    detalle: "Elige día y hora en el calendario de la consulta.",
    href: AGENDAR_URL,
    externo: false,
    icono: <CalendarDays size={22} strokeWidth={1.8} />,
  },
  {
    nombre: "WhatsApp",
    detalle: `Escribe al ${TELEFONO.visible} con tu nombre y el motivo de consulta.`,
    href: WHATSAPP_URL,
    externo: true,
    icono: <IconoWhatsApp size={22} />,
  },
  {
    nombre: "Teléfono",
    detalle: `Llama al ${TELEFONO.visible}, de lunes a viernes de 8:00 a.m. a 5:00 p.m.`,
    href: TELEFONO.href,
    externo: false,
    icono: <Phone size={21} strokeWidth={1.8} />,
  },
];

export default function Booking() {
  return (
    <section id="agenda" aria-labelledby="rd-agenda-title" className="py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <h2 id="rd-agenda-title" className="rd-title text-[clamp(2.6rem,5.6vw,5.25rem)]">
            Agenda tu cita
          </h2>
          <p className="rd-lead mt-5">Elige la vía que te quede más cómoda.</p>

          <ul className="mt-10 border-t border-wine/12 lg:mr-10">
            {VIAS.map((via) => (
              <li key={via.nombre} className="border-b border-wine/12">
                <a
                  href={via.href}
                  target={via.externo ? "_blank" : undefined}
                  rel={via.externo ? "noopener noreferrer" : undefined}
                  className="rd-row -mx-3 my-2 grid grid-cols-[1fr_auto] items-center gap-6 px-3 py-6 sm:-mx-5 sm:px-5"
                >
                  <span>
                    <span className="rd-title block text-[clamp(2rem,3.6vw,3rem)]">{via.nombre}</span>
                    <span className="rd-row-sub tnum mt-2 block text-[15.5px] leading-snug text-ink-soft">
                      {via.detalle}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="rd-row-icon grid h-14 w-14 place-items-center rounded-full bg-petal text-magenta-deep"
                  >
                    {via.icono}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <aside aria-label="Ubicación del consultorio" className="lg:col-span-5">
          <div className="overflow-hidden rounded-[36px] bg-wine text-milk">
            <iframe
              src="https://maps.google.com/maps?cid=16483700920212677160&hl=es&z=17&output=embed"
              width="100%"
              height="300"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Consultorio de la Dra. Hilda Díaz en Google Maps, Clínica Tierra Santa, Maturín"
              className="rd-map"
            />
            <div className="p-8 sm:p-10">
              <h3 className="rd-title text-[2rem]">Clínica Tierra Santa</h3>
              <address className="mt-4 grid gap-1 text-[16px] not-italic leading-relaxed text-on-wine-soft">
                <span>Av. Fuerzas Armadas, piso 3, consultorio 3</span>
                <span>Maturín, Monagas</span>
              </address>
              <dl className="mt-7 grid gap-5 border-t border-white/10 pt-7 text-[15px]">
                <div>
                  <dt className="font-semibold">Horario</dt>
                  <dd className="mt-1 text-on-wine-soft">Lunes a viernes, de 8:00 a.m. a 5:00 p.m.</dd>
                </div>
              </dl>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rd-btn rd-btn-ghost-light mt-8 w-full"
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
