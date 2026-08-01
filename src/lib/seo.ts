import type { Metadata } from "next";
import { CATEGORIAS, SITE, categoriaLabel, provinciaSlug } from "@/lib/constants";
import { formatIngredienteLinea, tiempoTotal } from "@/lib/recetas";
import type { Receta } from "@/types/receta";

export function absoluteUrl(path = "/"): string {
  const base = SITE.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function minutesToIsoDuration(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  if (m === 0) return "PT0M";
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `PT${min}M`;
  if (min === 0) return `PT${h}H`;
  return `PT${h}H${min}M`;
}

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image ?? "/images/placeholder-receta.svg");

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: opts.type ?? "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: opts.title,
      description: opts.description,
      images: [{ url: image, width: 1200, height: 800, alt: opts.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

export function recipeMetadata(receta: Receta): Metadata {
  const total = tiempoTotal(receta);

  // Title ~55–60 caracteres
  let title = `${receta.nombre} | Receta fácil paso a paso`;
  if (title.length > 60) {
    title = `${receta.nombre} | Receta andaluza`;
  }
  if (title.length > 60) {
    const maxName = 60 - " | Receta".length;
    title = `${clipText(receta.nombre, maxName)} | Receta`;
  }

  // Meta description ~150–155 con CTA
  const suffix = ` ${total} min. ¡Hazla paso a paso!`;
  const maxBase = Math.max(80, 155 - suffix.length);
  const description = `${clipText(receta.descripcion, maxBase)}${suffix}`;

  return buildPageMetadata({
    title,
    description,
    path: `/recetas/${receta.id}`,
    image: receta.imagenes[0],
    type: "article",
    keywords: receta.etiquetasSEO,
  });
}

function clipText(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const sliced = t.slice(0, Math.max(0, max - 1));
  const lastSpace = sliced.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced;
  return `${base.trimEnd()}…`;
}

/** JSON-LD Schema.org Recipe para rich snippets */
export function recipeJsonLd(receta: Receta) {
  const total = tiempoTotal(receta);
  const image = receta.imagenes.map((src) => absoluteUrl(src));
  const category = categoriaLabel(receta.categoria);

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: receta.nombre,
    image,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    datePublished: receta.publicadaEn ?? "2026-03-01",
    description: receta.descripcion,
    prepTime: minutesToIsoDuration(receta.tiempoPreparacion),
    cookTime: minutesToIsoDuration(receta.tiempoCoccion),
    totalTime: minutesToIsoDuration(total),
    recipeYield: [`${receta.raciones} raciones`, String(receta.raciones)],
    recipeCategory: category,
    recipeCuisine: ["Spanish", "Andalusian"],
    keywords: receta.etiquetasSEO.join(", "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: receta.valoracion.toFixed(1),
      ratingCount: String(receta.numValoraciones),
      bestRating: "5",
      worstRating: "1",
    },
    ...(receta.informacionNutricional
      ? {
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${receta.informacionNutricional.calorias} kcal`,
            proteinContent: `${receta.informacionNutricional.proteinas} g`,
            fatContent: `${receta.informacionNutricional.grasas} g`,
            carbohydrateContent: `${receta.informacionNutricional.carbohidratos} g`,
          },
        }
      : {}),
    recipeIngredient: receta.ingredientes.map((i) =>
      formatIngredienteLinea(i.nombre, i.cantidadBase, i.unidad, i.notas),
    ),
    recipeInstructions: receta.pasos.map((p) => ({
      "@type": "HowToStep",
      position: p.numero,
      name: p.titulo,
      text: p.descripcion,
      ...(p.tiempoSegundos
        ? { performTime: minutesToIsoDuration(Math.round(p.tiempoSegundos / 60)) }
        : {}),
    })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/recetas/${receta.id}`),
    },
    url: absoluteUrl(`/recetas/${receta.id}`),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "es-ES",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/recetas?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icons/icon-512.png"),
    description: SITE.description,
  };
}

export function faqJsonLd(faqs: { pregunta: string; respuesta: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.respuesta,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  recipes: Receta[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.recipes.length,
      itemListElement: opts.recipes.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/recetas/${r.id}`),
        name: r.nombre,
      })),
    },
  };
}

export { CATEGORIAS, provinciaSlug };
