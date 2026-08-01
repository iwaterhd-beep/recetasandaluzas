import type { Categoria } from "@/types/receta";

export const AMAZON = {
  tag: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? "",
  host: "www.amazon.es",
} as const;

export function hasAmazonTag(): boolean {
  const tag = AMAZON.tag.trim();
  return Boolean(tag) && !tag.includes("XXXX") && tag.includes("-");
}

export function amazonProductUrl(asin: string): string {
  const base = `https://${AMAZON.host}/dp/${asin}`;
  const tag = AMAZON.tag.trim();
  if (!tag || tag.includes("XXXX")) return base;
  return `${base}?tag=${encodeURIComponent(tag)}`;
}

export interface AmazonProduct {
  id: string;
  asin: string;
  title: string;
  blurb: string;
  categories: Categoria[] | "all";
}

/** Productos de cocina útiles — ASIN de Amazon.es (actualizar si caducan). */
export const AMAZON_PRODUCTS: AmazonProduct[] = [
  {
    id: "batidora",
    asin: "B08GSF8V5Z",
    title: "Batidora de vaso",
    blurb: "Ideal para gazpacho, salmorejo y ajoblanco.",
    categories: ["sopas-frias"],
  },
  {
    id: "sarten",
    asin: "B07W6HMBQF",
    title: "Sartén antiadherente 28 cm",
    blurb: "Para sofritos, tortillas y tapas a la plancha.",
    categories: ["tapas", "pescados"],
  },
  {
    id: "cazuela",
    asin: "B00KQZVZ1S",
    title: "Cazuela de barro",
    blurb: "Guisos lentos con el sabor de siempre.",
    categories: ["guisos"],
  },
  {
    id: "paellera",
    asin: "B00N1YJG2E",
    title: "Paellera de acero",
    blurb: "Arroces y fideuás con repartición pareja del calor.",
    categories: ["arroces"],
  },
  {
    id: "balanza",
    asin: "B07D7X4T3R",
    title: "Báscula de cocina",
    blurb: "Medidas precisas para postres y masas.",
    categories: ["postres"],
  },
  {
    id: "bowl",
    asin: "B07N1YQZQJ",
    title: "Bol de ensalada grande",
    blurb: "Para aliñar y servir ensaladas a la mesa.",
    categories: ["ensaladas"],
  },
  {
    id: "aceite",
    asin: "B07PX3Z6QK",
    title: "AOVE premium",
    blurb: "El aliño que marca la diferencia en cualquier plato.",
    categories: "all",
  },
  {
    id: "cuchillo",
    asin: "B000YDO2VG",
    title: "Cuchillo de chef",
    blurb: "Corte limpio para verdura, carne y pescado.",
    categories: "all",
  },
];

export function productsForCategory(categoria: Categoria, limit = 2): AmazonProduct[] {
  const specific = AMAZON_PRODUCTS.filter(
    (p) => p.categories !== "all" && p.categories.includes(categoria),
  );
  const general = AMAZON_PRODUCTS.filter((p) => p.categories === "all");
  return [...specific, ...general].slice(0, limit);
}
