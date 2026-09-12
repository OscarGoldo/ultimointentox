"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "0412 089 6444",
    href: "tel:+584120896444",
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "dochildadiaz@gmail.com",
    href: "mailto:dochildadiaz@gmail.com",
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Clínica Tierra Santa, Piso 3, Consultorio 3 — Maturín, Venezuela",
    href: "https://maps.google.com/?cid=16483700920212677160",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lunes a viernes, 8:00 AM – 5:00 PM",
    href: null,
  },
];

const motivos = [
  { value: "control-prenatal", label: "Control Prenatal" },
  { value: "ginecologia", label: "Ginecología General" },
  { value: "fertilidad", label: "Fertilidad / Reproducción" },
  { value: "planificacion", label: "Planificación Familiar" },
  { value: "menopausia", label: "Menopausia y Climaterio" },
  { value: "otro", label: "Otro" },
];

interface FormData {
  nombre: string;
  telefono: string;
  email: string;
  motivo: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  telefono?: string;
  email?: string;
  motivo?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    telefono: "",
    email: "",
    motivo: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido.";
    if (!form.telefono.trim()) newErrors.telefono = "El teléfono es requerido.";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.telefono))
      newErrors.telefono = "Ingresa un teléfono válido.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Ingresa un correo válido.";
    if (!form.motivo) newErrors.motivo = "Selecciona el motivo de consulta.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setEnviando(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error de servidor");
      setEnviado(true);
      setForm({ nombre: "", telefono: "", email: "", motivo: "", mensaje: "" });
    } catch {
      alert("Hubo un error al enviar. Por favor contáctanos directamente por WhatsApp.");
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contacto" className="bg-blush py-24 lg:py-32" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeading
          label="Contacto"
          headingId="contact-heading"
          title="Agenda tu consulta"
          lead="Escríbenos y te respondemos dentro de las próximas 24 horas hábiles."
        />

        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[1fr_1.15fr]">
          {/* Datos y mapa */}
          <div className="space-y-6">
            <Reveal>
              <ul className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="card card-hover flex gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-magenta"
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="eyebrow block text-mauve">{label}</span>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="tnum mt-1.5 block break-words text-[14.5px] font-medium text-plum underline-offset-4 transition-colors hover:text-magenta hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="tnum mt-1.5 block text-[14.5px] font-medium text-plum">
                          {value}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80}>
              <div className="card overflow-hidden p-0">
                {/* Apunta a su ficha de Google Maps por CID, no a la avenida
                    genérica: así el pin cae en el consultorio y el usuario ve
                    la tarjeta del negocio con la dirección y el teléfono. */}
                <iframe
                  src="https://maps.google.com/maps?cid=16483700920212677160&hl=es&z=17&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Consultorio de la Dra. Hilda Díaz en Google Maps — Clínica Tierra Santa, Maturín"
                  className="map-tint"
                />
              </div>
            </Reveal>
          </div>

          {/* Formulario */}
          <Reveal delay={60}>
            {enviado ? (
              <div
                role="alert"
                className="card flex h-full flex-col items-center justify-center p-10 text-center sm:p-14"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-magenta text-white">
                  <Check size={26} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h3 className="display mt-7 text-[2rem]">¡Mensaje enviado!</h3>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-plum-soft">
                  Gracias por escribir. La Dra. Hilda Díaz se comunicará contigo a la
                  brevedad posible.
                </p>
                <button onClick={() => setEnviado(false)} className="btn btn-outline mt-8">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulario de contacto"
                className="card p-7 sm:p-10"
              >
                <h3 className="display-md text-[1.5rem]">Solicitar información</h3>
                <p className="mt-2 text-[14px] text-mauve">
                  Los campos con <span className="text-magenta">*</span> son obligatorios.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="nombre" className="mb-2 block text-[13.5px] font-semibold text-plum">
                      Nombre completo <span className="text-magenta">*</span>
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby={errors.nombre ? "nombre-error" : undefined}
                      aria-invalid={!!errors.nombre}
                      placeholder="Tu nombre completo"
                      className="field"
                    />
                    {errors.nombre && (
                      <p id="nombre-error" role="alert" className="mt-2 text-[12.5px] text-[#c0392b]">
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="telefono" className="mb-2 block text-[13.5px] font-semibold text-plum">
                        Teléfono <span className="text-magenta">*</span>
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={form.telefono}
                        onChange={handleChange}
                        autoComplete="tel"
                        aria-required="true"
                        aria-describedby={errors.telefono ? "telefono-error" : undefined}
                        aria-invalid={!!errors.telefono}
                        placeholder="0412 000 0000"
                        className="field tnum"
                      />
                      {errors.telefono && (
                        <p id="telefono-error" role="alert" className="mt-2 text-[12.5px] text-[#c0392b]">
                          {errors.telefono}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-[13.5px] font-semibold text-plum">
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        aria-describedby={errors.email ? "email-error" : undefined}
                        aria-invalid={!!errors.email}
                        placeholder="tu@correo.com"
                        className="field"
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="mt-2 text-[12.5px] text-[#c0392b]">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="motivo" className="mb-2 block text-[13.5px] font-semibold text-plum">
                      Motivo de consulta <span className="text-magenta">*</span>
                    </label>
                    <select
                      id="motivo"
                      name="motivo"
                      value={form.motivo}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.motivo ? "motivo-error" : undefined}
                      aria-invalid={!!errors.motivo}
                      className="field cursor-pointer"
                    >
                      <option value="">Selecciona una opción</option>
                      {motivos.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    {errors.motivo && (
                      <p id="motivo-error" role="alert" className="mt-2 text-[12.5px] text-[#c0392b]">
                        {errors.motivo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="mb-2 block text-[13.5px] font-semibold text-plum">
                      Mensaje adicional
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Cuéntanos brevemente lo que necesitas…"
                      className="field resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  aria-disabled={enviando}
                  className="btn btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} strokeWidth={2} aria-hidden="true" />
                  {enviando ? "Enviando…" : "Enviar solicitud"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
