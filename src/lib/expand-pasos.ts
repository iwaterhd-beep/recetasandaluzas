import type { Paso } from "@/types/receta";

/**
 * Verbos imperativos típicos de recetas (3ª pers. / infinitivo corto).
 * Solo partimos si varios segmentos EMPIEZAN por uno de estos.
 */
const IMPERATIVE =
  /^(sala|salpimenta|enharina|enharinar|dora|dorar|sella|sellar|fr[ií]e|fre[ií]r|trocea|corta|pica|pela|lava|a[ñn]ade|vierte|bate|tritura|remueve|mezcla|incorpora|empapa|remoja|escalda|cuece|hierve|sofre[ií]|pocha|amasa|hornea|sirve|emplata|reserva|seca|escurre|aparta|limpia|quita|retira|calienta|precalienta|junta|suma|machaca|frota|aplana|envuelve|rellena|dorad|reboza|empan|ba[nñ]a|ali[nñ]a|sazona|desmiga|parte|haz|pon|echa|cubre|sacude|presiona|deja|enfr[ií]a|reposa|infusiona|blanquea|gratin|tuesta|dora)\b/i;

const TITLE_MAP: Record<string, string> = {
  sala: "Salar",
  salpimenta: "Salpimentar",
  enharina: "Enharinar",
  enharinar: "Enharinar",
  dora: "Dorar",
  dorar: "Dorar",
  dorad: "Dorar",
  sella: "Sellar",
  sellar: "Sellar",
  fríe: "Freír",
  frie: "Freír",
  freír: "Freír",
  freir: "Freír",
  trocea: "Trocear",
  corta: "Cortar",
  pica: "Picar",
  pela: "Pelar",
  lava: "Lavar",
  añade: "Añadir",
  anade: "Añadir",
  vierte: "Verter",
  bate: "Batir",
  tritura: "Triturar",
  remueve: "Remover",
  mezcla: "Mezclar",
  incorpora: "Incorporar",
  empapa: "Empapar",
  remoja: "Remojar",
  escalda: "Escaldar",
  cuece: "Cocer",
  hierve: "Hervir",
  sofríe: "Sofreír",
  sofrie: "Sofreír",
  pocha: "Pochar",
  amasa: "Amasar",
  hornea: "Hornear",
  sirve: "Servir",
  emplata: "Emplatar",
  reserva: "Reservar",
  seca: "Secar",
  escurre: "Escurrir",
  aparta: "Apartar",
  limpia: "Limpiar",
  quita: "Quitar",
  retira: "Retirar",
  calienta: "Calentar",
  precalienta: "Precalentar",
  junta: "Juntar",
  suma: "Añadir",
  machaca: "Machacar",
  frota: "Frotar",
  aplana: "Aplanar",
  envuelve: "Envolver",
  rellena: "Rellenar",
  reboza: "Rebozar",
  empan: "Empanar",
  baña: "Bañar",
  bana: "Bañar",
  aliña: "Aliñar",
  alina: "Aliñar",
  sazona: "Sazonar",
  desmiga: "Desmigar",
  parte: "Partir",
  haz: "Preparar",
  pon: "Poner",
  echa: "Echar",
  cubre: "Cubrir",
  sacude: "Sacudir",
  presiona: "Presionar",
  deja: "Dejar",
  enfría: "Enfriar",
  enfria: "Enfriar",
  reposa: "Reposar",
  infusiona: "Infusionar",
  blanquea: "Blanquear",
  tuesta: "Tostar",
};

function normalizeKey(verb: string): string {
  return verb
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function capitalize(s: string): string {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function titleFromAtom(atom: string, fallback: string): string {
  const t = atom.trim();
  const m = t.match(IMPERATIVE);
  if (!m) return fallback;
  const key = normalizeKey(m[1]!);
  if (key === "haz" && /\bcorte\b/i.test(t)) return "Cortar";
  if (key === "deja" && /\brepos/i.test(t)) return "Reposar";
  if (key === "anade" || key === "añade") {
    if (/\b(aceite|en hilo)\b/i.test(t)) return "Añadir aceite";
    if (/\b(px|pedro|vino|caldo)\b/i.test(t)) return "Añadir líquido";
  }
  if (TITLE_MAP[key]) return TITLE_MAP[key]!;
  return capitalize(m[1]!);
}

/** Segmenta una frase en acciones si hay varios imperativos coordinados. */
export function splitActionAtoms(descripcion: string): string[] {
  const sentences = descripcion
    .split(/(?<=[.|;])\s+/)
    .map((s) => s.trim().replace(/[.;]+$/, ""))
    .filter((s) => s.length > 2);

  const atoms: string[] = [];

  for (const sentence of sentences) {
    const parts = sentence
      .split(/,\s*|\s+y\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length < 2) {
      atoms.push(capitalize(sentence));
      continue;
    }

    const verbStarts = parts.filter((p) => IMPERATIVE.test(p));
    // Evitar partir listas de ingredientes: "Bate tomate, pan, ajo…"
    if (verbStarts.length >= 2 && verbStarts.length >= Math.ceil(parts.length * 0.6)) {
      for (const p of parts) {
        atoms.push(capitalize(p));
      }
    } else {
      atoms.push(capitalize(sentence));
    }
  }

  // Deduplicar vacíos / demasiado cortos
  return atoms.filter((a) => a.length > 2);
}

/**
 * Expande pasos compuestos en micro-pasos del modo cocina / ficha.
 * "Sala, enharina y dora las carrilleras. Reserva." → 4 pasos.
 */
export function expandPasos(pasos: Paso[]): Paso[] {
  const expanded: Paso[] = [];

  for (const p of pasos) {
    const atoms = splitActionAtoms(p.descripcion);
    if (atoms.length <= 1) {
      expanded.push(p);
      continue;
    }

    atoms.forEach((atom, i) => {
      const isLast = i === atoms.length - 1;
      const titulo = titleFromAtom(atom, p.titulo);
      const descripcion = /[.!?]$/.test(atom) ? atom : `${atom}.`;
      expanded.push({
        numero: 0,
        titulo,
        descripcion,
        ...(isLast && p.tiempoSegundos != null
          ? { tiempoSegundos: p.tiempoSegundos }
          : {}),
        ...(isLast && p.consejo ? { consejo: p.consejo } : {}),
      });
    });
  }

  return expanded.map((p, i) => ({ ...p, numero: i + 1 }));
}
