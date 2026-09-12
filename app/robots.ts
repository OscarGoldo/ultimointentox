import type { MetadataRoute } from "next";

const SITE = "https://drahildadiaz.com";

/**
 * Antes /robots.txt devolvía 404. Google necesita poder rastrear el sitio y el
 * favicon; el panel y el login quedan fuera del índice.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/login", "/auth/", "/api/"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
