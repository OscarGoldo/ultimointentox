"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "584120896444";
const MESSAGE =
  "Hola Dra. Hilda, me gustaría agendar una cita. ¿Cuáles son los horarios disponibles?";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip / Burbuja */}
      {showTooltip && (
        <div
          role="status"
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[220px] animate-fade-in-up"
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">¡Hola! 👋</p>
            <button
              onClick={() => setShowTooltip(false)}
              aria-label="Cerrar mensaje de WhatsApp"
              className="text-gray-400 hover:text-gray-600 transition-colors -mt-0.5"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Chatea con nosotros y agenda tu cita fácilmente.
          </p>
        </div>
      )}

      {/* Botón flotante */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de WhatsApp con la Dra. Hilda Díaz"
        onMouseEnter={() => setShowTooltip(true)}
        onFocus={() => setShowTooltip(true)}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-200 hover:bg-[#20ba5a] hover:scale-110 transition-all duration-200"
      >
        <MessageCircle size={26} aria-hidden="true" />
        {/* Punto de estado */}
        <span
          className="absolute top-1 right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white animate-pulse"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
