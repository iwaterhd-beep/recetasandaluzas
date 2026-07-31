import type { MetadataRoute } from "next";
import { CATEGORIAS, PROVINCIAS, SITE } from "@/lib/constants";
import { getAllRecetas } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/recetas`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/categorias`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/provincias`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/mapa-del-sitio`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categorias: MetadataRoute.Sitemap = CATEGORIAS.map((c) => ({
    url: `${base}/categoria/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const provincias: MetadataRoute.Sitemap = PROVINCIAS.map((p) => ({
    url: `${base}/provincia/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const recetas: MetadataRoute.Sitemap = getAllRecetas().map((r) => ({
    url: `${base}/recetas/${r.id}`,
    lastModified: r.publicadaEn ? new Date(r.publicadaEn) : now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Artículos de blog (mismas slugs que en data/blog)
  const blog: MetadataRoute.Sitemap = [
    "mejores-tapas-sevilla",
    "que-comer-semana-santa-andalucia",
    "gazpacho-vs-salmorejo",
  ].map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categorias, ...provincias, ...recetas, ...blog];
}
