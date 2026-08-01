import type { CookAction } from "@/lib/cook-actions";
import type { CookTipLiquid } from "@/lib/cook-actions";

/**
 * Pack IconScout «Free Food And Drinks» (344419) + pan Noto (mismo estilo).
 * La animación prioriza QUÉ se manipula en el paso (pan, tomate, pasta…),
 * y si no hay sujeto claro, la técnica (verter, freír, hervir…).
 */
export type CookPackSlug =
  | "cooking"
  | "steaming-bowl"
  | "spaghetti"
  | "pour"
  | "tomato"
  | "root-vegetable"
  | "hot-beverage"
  | "burrito"
  | "popcorn"
  | "champagne-bottle"
  | "clinking-beer-mugs"
  | "clinking-glasses"
  | "tropical-drink"
  | "wine-glass"
  | "bread"
  | "paper"
  | "flour";

const BASE = "/animations/cocina/lottie/pack-food-drinks";

export function cookPackJsonSrc(slug: CookPackSlug): string {
  return `${BASE}/${slug}.json`;
}

export function cookPackWebpSrc(slug: CookPackSlug): string {
  return `${BASE}/${slug}.webp`;
}

/** Alimento / objeto principal del paso (prioridad sobre el líquido). */
function detectStepSubject(text: string): CookPackSlug | null {
  if (/\b(pan|telera|candeal|rebanada|rebanadas|miga|torrija|hogaza|barra)\b/.test(text)) {
    return "bread";
  }
  if (/\b(pasta|fideo|fideos|espagueti|noodles|fideu[aá]|macarr)\b/.test(text)) {
    return "spaghetti";
  }
  if (/\b(burrito|wrap|taco|tortilla de harina|enroll)\b/.test(text)) {
    return "burrito";
  }
  if (/\b(tomate|tomates)\b/.test(text)) return "tomato";
  if (
    /\b(zanahoria|patata|papa|cebolla|ajo|verdura|verduras|pepino|pimiento|espinaca|garbanzo|lenteja)\b/.test(
      text,
    )
  ) {
    return "root-vegetable";
  }
  if (/\b(naranja|mel[oó]n|sand[ií]a|fruta|lim[oó]n|fresa|uva|manzana|aguacate)\b/.test(text)) {
    return "tropical-drink";
  }
  if (/\b(leche|caf[eé]|t[eé]|infusi[oó]n|chocolate caliente)\b/.test(text)) {
    return "hot-beverage";
  }
  if (/\b(vino|jerez|pedro xim[eé]nez|manzanilla)\b/.test(text)) return "wine-glass";
  if (/\b(cerveza|ca[nñ]a|birra)\b/.test(text)) return "clinking-beer-mugs";
  return null;
}

/**
 * Elige la animación según lo que se hace en el paso + de qué alimento.
 */
export function resolveCookPackAnimation(
  action: CookAction,
  titulo: string,
  descripcion: string,
  liquid: CookTipLiquid = null,
): CookPackSlug {
  const text = `${titulo}. ${descripcion}`.toLowerCase();
  const subject = detectStepSubject(text);

  // ── Servir: plato / bebida del remate ──
  if (action === "servir") {
    if (subject === "clinking-beer-mugs" || /\b(cerveza|ca[nñ]a|birra)\b/.test(text)) {
      return "clinking-beer-mugs";
    }
    if (/\b(champ[aá]n|cava|brindis|celebr)\b/.test(text)) return "champagne-bottle";
    if (subject === "wine-glass") return "wine-glass";
    if (
      /\b(gazpacho|salmorejo|porra|ajos?blanco|crema fr[ií]a|fr[ií]o|helad|nevera)\b/.test(text)
    ) {
      return "tropical-drink";
    }
    if (/\b(sopa|caldo|guiso|potaje|puchero|taz[oó]n)\b/.test(text)) return "steaming-bowl";
    if (subject === "bread") return "bread";
    if (subject === "spaghetti") return "spaghetti";
    if (/\b(aperitivo|tapa|crujiente|snack)\b/.test(text)) return "popcorn";
    return "clinking-glasses";
  }

  // ── Empapar / remojar: el pan (u otro sólido), no el jugo ──
  if (action === "empapar") {
    if (subject === "bread") return "bread";
    if (subject && subject !== "tomato" && subject !== "wine-glass") return subject;
    // Sin pan explícito: verter / remojar
    return "pour";
  }

  // ── Aliñar / salar: sal ≠ verter vinagre; vino solo si es el protagonista ──
  if (action === "aliñar") {
    if (/\b(sala|salar|salpiment|pizca de sal)\b/.test(text) && !/\b(vinagre|ali[nñ]|aceite)\b/.test(text)) {
      return "cooking";
    }
    if (liquid === "vino" || /\b(vino(?!gre)|pedro xim[eé]nez|jerez)\b/.test(text)) {
      return "wine-glass";
    }
    return "pour";
  }

  // ── Cortar: qué cortas ──
  if (action === "cortar") {
    if (subject === "bread") return "bread";
    if (subject === "tomato") return "tomato";
    if (subject === "root-vegetable") return "root-vegetable";
    if (subject === "tropical-drink") return "tropical-drink";
    return "root-vegetable";
  }

  // ── Fruta ──
  if (action === "fruta") {
    if (subject === "tomato") return "tomato";
    return "tropical-drink";
  }

  // ── Hervir / cocer / escaldar ──
  if (action === "hervir") {
    if (/\b(escaldar|escalda)\b/.test(text) && (subject === "tomato" || /\btomate/.test(text))) {
      return "tomato";
    }
    if (subject === "spaghetti") return "spaghetti";
    if (subject === "hot-beverage" || liquid === "leche") return "hot-beverage";
    if (subject === "root-vegetable") return "steaming-bowl";
    return "steaming-bowl";
  }

  // ── Freír / sofrito / rebozar / enharinar ──
  if (action === "rebozar") {
    if (
      /^(enharinar|enharina)\b/i.test(titulo.trim()) ||
      /\b(harina|enharin|pasa por harina)\b/.test(text)
    ) {
      return "flour";
    }
    if (/\b(pan rallado|empanar|empan)\b/.test(text)) return "bread";
    if (/\b(crujiente|aperitivo|snack|palomita)\b/.test(text)) return "popcorn";
    return "flour";
  }
  if (action === "freir" || action === "sofrito") {
    if (/\b(crujiente|aperitivo|snack|palomita)\b/.test(text)) return "popcorn";
    if (subject === "bread") return "bread";
    return "cooking";
  }

  // ── Triturar / emulsionar: técnica + base del plato ──
  if (action === "triturar") {
    if (
      /^emulsionar/.test(titulo.trim().toLowerCase()) ||
      /\b(emulsion|aceite en hilo|en hilo|emulsiona)\b/.test(text)
    ) {
      return "pour";
    }
    // Gazpacho / salmorejo / «triturar base» → tomate (aunque el pan esté en el texto)
    if (
      /\b(gazpacho|salmorejo|porra|ajos?blanco|\bbase\b)\b/.test(text) ||
      subject === "tomato"
    ) {
      return "tomato";
    }
    if (subject === "bread") return "bread";
    return "steaming-bowl";
  }

  // ── Mezclar ──
  if (action === "mezclar") {
    if (/\b(aceite|vinagre|ali[nñ]o|verter|vierte)\b/.test(text)) return "pour";
    if (subject === "bread") return "bread";
    if (subject === "tomato") return "tomato";
    return "cooking";
  }

  if (action === "amasar") {
    if (subject === "bread") return "bread";
    return "burrito";
  }

  if (action === "hornear") {
    if (subject === "bread") return "bread";
    return "cooking";
  }

  // ── Enfriar / secar / escurrir ──
  if (action === "enfriar") {
    if (
      /^(secar|escurrir)\b/i.test(titulo.trim()) ||
      /\b(papel|seca bien|secar|escurr)\b/.test(text)
    ) {
      return "paper";
    }
    return "tropical-drink";
  }

  if (action === "preparar") {
    if (subject) return subject;
    // Reservar / apartar: no fuerza verdura
    if (/\b(reserva|apart|mise)\b/.test(text)) return "cooking";
    return "root-vegetable";
  }

  // ── Cocinar genérico ──
  if (subject) return subject;
  if (/\b(ali[nñ]|verter|vierte|aceite)\b/.test(text)) return "pour";
  if (/\b(hervir|cocer|guiso|caldo|olla)\b/.test(text)) return "steaming-bowl";
  return "cooking";
}
