import type { Categoria, Provincia } from "@/types/receta";

export const SITE = {
  name: "Recetas Andaluzas",
  domain: "recetasandaluzas.com",
  url: "https://recetasandaluzas.com",
  description:
    "Recetas andaluzas fáciles paso a paso: gazpacho, salmorejo, tapas, guisos y postres tradicionales. Modo cocina con temporizador y lista de la compra.",
  locale: "es_ES",
  twitter: "@recetasandaluzas",
  /** Título principal para Google (~55–60 caracteres). */
  titleDefault:
    "Recetas Andaluzas | Gazpacho, salmorejo y cocina andaluza",
  /** Contacto público (aviso legal / privacidad / formulario). */
  contactEmail: "contacto@recetasandaluzas.com",
} as const;

export const PROVINCIAS: { slug: string; nombre: Provincia }[] = [
  { slug: "cordoba", nombre: "Córdoba" },
  { slug: "sevilla", nombre: "Sevilla" },
  { slug: "cadiz", nombre: "Cádiz" },
  { slug: "granada", nombre: "Granada" },
  { slug: "malaga", nombre: "Málaga" },
  { slug: "huelva", nombre: "Huelva" },
  { slug: "jaen", nombre: "Jaén" },
  { slug: "almeria", nombre: "Almería" },
];

export const CATEGORIAS: {
  slug: Categoria;
  nombre: string;
  descripcion: string;
}[] = [
  {
    slug: "sopas-frias",
    nombre: "Sopas frías",
    descripcion: "Gazpacho, salmorejo, ajoblanco y cremas andaluzas de verano.",
  },
  {
    slug: "ensaladas",
    nombre: "Ensaladas",
    descripcion: "Pipirrana, remojón y ensaladas frescas de la tierra.",
  },
  {
    slug: "tapas",
    nombre: "Tapas",
    descripcion: "Clásicos de barra: flamenquines, pescaíto, papas aliñás y más.",
  },
  {
    slug: "guisos",
    nombre: "Guisos",
    descripcion: "Rabo de toro, carrillada, puchero y guisos de cuchara.",
  },
  {
    slug: "pescados",
    nombre: "Pescados",
    descripcion: "Urta, atún encebollado, calamares y mariscos a la andaluza.",
  },
  {
    slug: "arroces",
    nombre: "Arroces",
    descripcion: "Arroces caldosos y de bacalao de la costa y el interior.",
  },
  {
    slug: "postres",
    nombre: "Postres",
    descripcion: "Tocino de cielo, pestiños, torrijas, piononos y dulces conventuales.",
  },
];

export const TIEMPO_FILTROS = [
  { id: "rapido", label: "Menos de 30 min", max: 30 },
  { id: "medio", label: "30–60 min", min: 30, max: 60 },
  { id: "largo", label: "Más de 60 min", min: 60 },
] as const;

export const DIFICULTADES = ["fácil", "media", "difícil"] as const;

export function provinciaSlug(nombre: Provincia): string {
  return (
    PROVINCIAS.find((p) => p.nombre === nombre)?.slug ??
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
  );
}

export function provinciaFromSlug(slug: string): Provincia | undefined {
  return PROVINCIAS.find((p) => p.slug === slug)?.nombre;
}

export function categoriaLabel(slug: Categoria): string {
  return CATEGORIAS.find((c) => c.slug === slug)?.nombre ?? slug;
}
