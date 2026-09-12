"use client";

const WHATSAPP_NUMBER = "584120896444";
const MESSAGE =
  "Hola Dra. Hilda, me gustaría agendar una cita. ¿Cuáles son los horarios disponibles?";

/**
 * Acceso directo a WhatsApp. Verde propio de la marca WhatsApp para que se
 * reconozca al instante, pero sin punto parpadeante ni globo de texto.
 */
export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp a la Dra. Hilda Díaz"
      className="group fixed bottom-5 right-5 z-40 inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#25D366] px-5 py-3.5 font-semibold text-white shadow-lift transition-all duration-200 hover:bg-[#1FB855] sm:bottom-7 sm:right-7"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover:scale-110"
      >
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2 22.5l5.85-1.44c1.44.78 3.06 1.2 4.7 1.2h.01c5.43 0 9.86-4.43 9.86-9.87C22.42 6.43 17.99 2 12.04 2Zm0 17.8h-.01c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.11.77.83-3.03-.2-.31a8.14 8.14 0 0 1-1.25-4.34c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.86 5.8 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.18 8.2Z" />
      </svg>
      <span className="hidden text-[14px] sm:inline">Escríbeme</span>
    </a>
  );
}
