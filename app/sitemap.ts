import type { MetadataRoute } from "next";
import { PAGINAS_LOCALES } from "@/lib/paginas-locales";

const SITE = "https://drahildadiaz.com";

/** Solo las páginas públicas. El panel y el login quedan fuera a propósito. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PAGINAS_LOCALES.map((pagina) => ({
      url: `${SITE}/${pagina.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE}/ebook`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
