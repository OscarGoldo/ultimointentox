"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import Wordmark from "@/components/Wordmark";

const navLinks = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#ebook", label: "Ebook" },
  { href: "#contacto", label: "Contacto" },
  { href: "#faq", label: "Preguntas" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50" role="banner">
      {/* Cintillo de datos del consultorio */}
      <div
        className={`hidden overflow-hidden bg-magenta text-white transition-[max-height,opacity] duration-300 lg:block ${
          isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
        aria-hidden={isScrolled}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-2.5 text-[12.5px]">
          <p className="flex items-center gap-2">
            <MapPin size={13} strokeWidth={2} aria-hidden="true" />
            Clínica Tierra Santa · Piso 3, Consultorio 3 · Maturín, Monagas
          </p>
          <div className="flex items-center gap-7">
            <p className="flex items-center gap-2">
              <Clock size={13} strokeWidth={2} aria-hidden="true" />
              Lunes a viernes · 8:00 AM – 5:00 PM
            </p>
            <a
              href="tel:+584120896444"
              className="tnum flex items-center gap-2 font-semibold underline-offset-4 hover:underline"
            >
              <Phone size={13} strokeWidth={2} aria-hidden="true" />
              0412 089 6444
            </a>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "border-b border-line bg-cream/90 shadow-soft backdrop-blur-md"
            : "border-b border-transparent bg-cream/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-8 px-5 sm:px-8">
          <a
            href="#inicio"
            onClick={(e) => go(e, "#inicio")}
            aria-label="Ir al inicio — Dra. Hilda Mary Díaz García"
            className="rounded-lg"
          >
            <Wordmark className="[&>span:last-child]:hidden min-[420px]:[&>span:last-child]:flex" />
          </a>

          <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="group relative py-1 text-[14.5px] font-medium text-plum-soft transition-colors duration-200 hover:text-magenta"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full bg-rose transition-[width] duration-300 ease-out group-hover:w-full"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="https://ozmedical.app/reservar/hildadiaz"
              className="btn btn-primary hidden min-h-0 px-6 py-3 text-[14px] sm:inline-flex"
            >
              Agendar cita
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-movil"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-white text-magenta-deep transition-colors hover:bg-blush lg:hidden"
            >
              {isMenuOpen ? (
                <X size={19} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Menu size={19} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div
          id="menu-movil"
          className="h-[calc(100dvh-76px)] overflow-y-auto border-t border-line bg-cream lg:hidden"
        >
          <nav aria-label="Menú móvil" className="mx-auto max-w-[1200px] px-5 py-4 sm:px-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="flex items-center justify-between border-b border-line py-5 transition-colors hover:text-magenta"
              >
                <span className="display-md text-[1.5rem]">{link.label}</span>
                <ArrowRight size={18} strokeWidth={1.75} className="text-rose" aria-hidden="true" />
              </a>
            ))}

            <div className="space-y-3 py-8">
              <Link
                href="https://ozmedical.app/reservar/hildadiaz"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-primary w-full"
              >
                Agendar cita
              </Link>
              <a href="tel:+584120896444" className="btn btn-outline tnum w-full">
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                0412 089 6444
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
