"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Retardo en ms para escalonar elementos hermanos. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "figure" | "header";
};

/**
 * Aparición discreta al entrar en viewport: opacidad + 14px de subida.
 * La preferencia `prefers-reduced-motion` la anula por completo desde CSS,
 * así que aquí no hace falta ninguna rama extra.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error -- ref polimórfico sobre un set cerrado de tags HTML
      ref={ref}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}
