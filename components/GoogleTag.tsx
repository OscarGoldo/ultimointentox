"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/** Etiqueta de Google (GA4), vinculada a la cuenta de Google Ads. */
const GA_ID = "G-LW6ZC1QZZN";

/**
 * Rutas que nunca deben medirse. El panel contiene datos de pacientes y sus
 * URL y títulos no pueden terminar en Google Analytics.
 */
const PRIVATE_PREFIXES = ["/dashboard", "/login", "/auth"];

function isPrivate(pathname: string) {
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Solo se carga en producción y en páginas públicas. Si alguien navega desde
 * la web pública hacia el panel sin recargar, gtag ya está cargado, así que
 * además se activa la bandera oficial `ga-disable-<ID>`, que gtag revisa antes
 * de enviar cada evento.
 */
export default function GoogleTag() {
  const pathname = usePathname() ?? "/";
  const privateRoute = isPrivate(pathname);

  if (typeof window !== "undefined") {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] =
      privateRoute;
  }

  if (process.env.NODE_ENV !== "production" || privateRoute) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
