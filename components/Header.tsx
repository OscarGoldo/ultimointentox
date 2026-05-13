"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { useCalBooking } from "@/components/CalBookingModal";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre Mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useCalBooking();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, "#inicio")}
            aria-label="Ir al inicio - Dra. Hilda Diaz"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
              <Image
                src="/images/Logo2.png"
                alt="Logo Dra. Hilda Díaz García"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#f06292] leading-tight">Dra. Hilda Mary Díaz García</p>
              <p className="text-xs text-gray-500">Gineco · Obstetra · Fertilidad</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-gray-600 hover:text-[#f06292] transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#f06292] group-hover:w-full transition-all duration-200" />
              </a>
            ))}
            <button
              onClick={openModal}
              aria-label="Agendar cita"
              className="flex items-center gap-2 bg-[#f06292] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#ec407a] transition-colors duration-200"
            >
              <Phone size={14} aria-hidden="true" />
              Agendar Cita
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg" role="navigation" aria-label="Menú móvil">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-gray-700 hover:text-[#f06292] hover:bg-rose-50 rounded-lg font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { openModal(); setIsMenuOpen(false); }}
              className="mt-2 flex items-center justify-center gap-2 bg-[#f06292] text-white font-semibold px-4 py-3 rounded-full hover:bg-[#ec407a] transition-colors"
            >
              <Phone size={16} aria-hidden="true" />
              Agendar Cita
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
