"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "0412-089-6444",
    href: "tel:+584120896444",
    color: "rose",
  },
  {
    icon: Mail,
    label: "Correo Electrónico",
    value: "dochildadiaz@gmail.com",
    href: "mailto:dochildadiaz@gmail.com",
    color: "sky",
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Clínica Tierra Santa, Piso 3, Consultorio 3 — Maturín, Venezuela",
    href: "https://maps.google.com/?q=Clinica+Tierra+Santa+Maturin+Venezuela",
    color: "rose",
  },
  {
    icon: Clock,
    label: "Horario de Atención",
    value: "Lunes a Viernes: 8:00 AM – 5:00 PM",
    href: null,
    color: "sky",
  },
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
    <section
      id="contacto"
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#f06292] uppercase tracking-widest mb-2">
            Agenda tu cita
          </p>
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900"
          >
            Contacto y Ubicación
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-[#f06292] rounded-full" aria-hidden="true" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info de contacto + Mapa */}
          <div>
            <div className="space-y-4 mb-8">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <div
                  key={label}
                  className={`flex gap-4 p-4 rounded-xl border transition-colors ${
                    color === "rose" ? "border-rose-100 bg-rose-50/50" : "border-sky-100 bg-sky-50/50"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      color === "rose" ? "bg-rose-100" : "bg-sky-100"
                    }`}
                    aria-hidden="true"
                  >
                    <Icon
                      size={18}
                      className={color === "rose" ? "text-[#f06292]" : "text-[#0288d1]"}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-gray-800 font-medium hover:text-[#f06292] transition-colors text-sm"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-800 font-medium text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps embed placeholder */}
            <div
              className="rounded-2xl overflow-hidden shadow-md border border-gray-100"
              aria-label="Mapa de ubicación - Clínica Tierra Santa, Maturín"
            >
              <iframe
                src="https://maps.google.com/maps?q=Av+Fuerzas+Armadas%2C+Matur%C3%ADn+6201%2C+Monagas%2C+Venezuela&output=embed&hl=es&z=16"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la Dra. Hilda Díaz en Maturín"
              />
            </div>
          </div>

          {/* Formulario */}
          <div>
            {enviado ? (
              <div
                role="alert"
                className="h-full flex flex-col items-center justify-center text-center p-10 bg-rose-50 rounded-2xl border border-rose-100"
              >
                <CheckCircle size={56} className="text-[#f06292] mb-4" aria-hidden="true" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-gray-600 mb-6">
                  Gracias por contactarnos. La Dra. Hilda Díaz se comunicará contigo a la brevedad posible.
                </p>
                <button
                  onClick={() => setEnviado(false)}
                  className="bg-[#f06292] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#ec407a] transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulario de contacto"
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Solicitar Información
                </h3>

                {/* Nombre */}
                <div className="mb-5">
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nombre completo <span aria-hidden="true" className="text-[#f06292]">*</span>
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
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 ${
                      errors.nombre ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  {errors.nombre && (
                    <p id="nombre-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Teléfono y email */}
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Teléfono <span aria-hidden="true" className="text-[#f06292]">*</span>
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
                      placeholder="0412-0000000"
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 ${
                        errors.telefono ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {errors.telefono && (
                      <p id="telefono-error" role="alert" className="mt-1 text-xs text-red-600">
                        {errors.telefono}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 ${
                        errors.email ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Motivo */}
                <div className="mb-5">
                  <label htmlFor="motivo" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Motivo de consulta <span aria-hidden="true" className="text-[#f06292]">*</span>
                  </label>
                  <select
                    id="motivo"
                    name="motivo"
                    value={form.motivo}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.motivo ? "motivo-error" : undefined}
                    aria-invalid={!!errors.motivo}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 ${
                      errors.motivo ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="control-prenatal">Control Prenatal</option>
                    <option value="ginecologia">Ginecología General</option>
                    <option value="fertilidad">Fertilidad / Reproducción</option>
                    <option value="planificacion">Planificación Familiar</option>
                    <option value="menopausia">Menopausia y Climaterio</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.motivo && (
                    <p id="motivo-error" role="alert" className="mt-1 text-xs text-red-600">
                      {errors.motivo}
                    </p>
                  )}
                </div>

                {/* Mensaje */}
                <div className="mb-6">
                  <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mensaje adicional
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Cuéntanos brevemente lo que necesitas..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 hover:border-gray-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  aria-disabled={enviando}
                  className="w-full flex items-center justify-center gap-2 bg-[#f06292] text-white font-bold py-4 rounded-full shadow-lg shadow-rose-200 hover:bg-[#ec407a] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={17} aria-hidden="true" />
                  {enviando ? "Enviando..." : "Enviar Solicitud"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
