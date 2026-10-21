"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { AGENDAR_URL, NAV, TELEFONO } from "./datos";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* Las páginas locales también usan este encabezado: fuera de la portada
     las anclas llevan a /#seccion */
  const enPortada = usePathname() === "/";
  const ir = (ancla: string) => (enPortada ? ancla : `/${ancla}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative z-10 transition-[background-color,box-shadow] duration-300 ${
          solid
            ? "bg-milk/90 shadow-[0_1px_0_rgba(42,10,25,0.08)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
          <a
            href={enPortada ? "#inicio" : "/"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-full"
            aria-label="Ir al inicio. Dra. Hilda Mary Díaz García"
          >
            <Image src="/brand/mark.png" alt="" width={512} height={512} priority className="h-10 w-10" />
            <span className="leading-tight">
              <span className="block text-[17px] font-semibold tracking-[-0.01em]">Dra. Hilda Díaz</span>
              <span className="hidden text-[12.5px] text-ink-soft min-[380px]:block">
                Ginecología, obstetricia y fertilidad
              </span>
            </span>
          </a>

          <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={ir(link.href)}
                className="text-[15px] font-medium text-wine/80 transition-colors hover:text-magenta"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={AGENDAR_URL} className="rd-btn rd-btn-primary hidden min-h-[46px] px-5 text-[15px] sm:inline-flex">
              Agendar cita
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="rd-menu"
              className="flex h-[46px] items-center gap-2.5 rounded-full border-[1.5px] border-wine/20 px-4 text-[15px] font-semibold transition-colors hover:bg-wine hover:text-milk lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-[10px] w-4">
                <span
                  className={`absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300 ${
                    open ? "top-[4px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300 ${
                    open ? "top-[4px] -rotate-45" : "top-[8px]"
                  }`}
                />
              </span>
              {open ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil: panel vino a pantalla completa bajo la barra */}
      <div
        id="rd-menu"
        data-open={open || undefined}
        inert={!open}
        className={`rd-menu fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-wine text-milk transition-opacity duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Menú móvil" className="flex min-h-full flex-col px-5 pb-10 pt-8 sm:px-8">
          <ul>
            {NAV.map((link, i) => (
              <li
                key={link.href}
                className="rd-menu-item border-b border-white/10"
                style={{ "--i": i } as React.CSSProperties}
              >
                <a
                  href={ir(link.href)}
                  onClick={() => setOpen(false)}
                  className="rd-title block py-5 text-[2.5rem] transition-colors hover:text-petal"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div
            className="rd-menu-item mt-auto grid gap-3 pt-10"
            style={{ "--i": NAV.length } as React.CSSProperties}
          >
            <a href={AGENDAR_URL} className="rd-btn rd-btn-primary w-full">
              Agendar cita
            </a>
            <a href={TELEFONO.href} className="rd-btn rd-btn-ghost-light tnum w-full">
              <Phone size={17} strokeWidth={2} aria-hidden="true" />
              {TELEFONO.visible}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
