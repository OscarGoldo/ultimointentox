import type { MetadataRoute } from "next";

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
    {
      url: `${SITE}/ebook`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
