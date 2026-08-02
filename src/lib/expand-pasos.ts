import type { Paso } from "@/types/receta";

/**
 * Verbos imperativos típicos de recetas (3ª pers. / infinitivo corto).
 * Solo partimos si varios segmentos EMPIEZAN por uno de estos.
 */
const IMPERATIVE =
  /^(sala|salpimenta|enharina|enharinar|dora|dorar|sella|sellar|fr[ií]e|fre[ií]r|trocea|corta|pica|pela|lava|a[ñn]ade|vierte|bate|tritura|remueve|mezcla|incorpora|empapa|remoja|escalda|cuece|hierve|sofre[ií]|pocha|amasa|hornea|sirve|emplata|reserva|seca|escurre|aparta|limpia|quita|retira|calienta|precalienta|junta|suma|machaca|frota|aplana|envuelve|rellena|dorad|reboza|empan|ba[nñ]a|ali[nñ]a|sazona|desmiga|parte|haz|pon|echa|cubre|sacude|presiona|deja|enfr[ií]a|reposa|infusiona|blanquea|gratin|tuesta|dora|nap[aá]|reduce|cuela|deshuesa|deshaz)\b/i;

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
  napa: "Napar",
  napá: "Napar",
  reduce: "Reducir",
  cuela: "Colar",
  deshuesa: "Deshuesar",
  deshaz: "Deshacer",
};

/** Acciones de remate: nunca llevan temporizador. */
const SERVE_TITLE =
  /^(servir|emplatar|terminar y servir|acabar y servir|presentar)$/i;

/** Acciones que sí justifican un temporizador (espera / cocción). */
const TIMED_ACTION =
  /\b(reposar|reposa|enfriar|enfr[ií]a|remojar|remoja|marinar|marina|cocer|cuece|cocina|cocinar|cocci[oó]n|hervir|hierve|fre[ií]r|fr[ií]e|hornear|hornea|estofar|estofa|confitar|confita|blanquear|blanquea|gratinar|escalfar|dejar|deja|infusionar|reducir\s+\d|durante\s+\d|\d+\s*[-–]?\s*\d*\s*min|\d+\s*h(?:oras?)?|segundos?)\b/i;

function normalizeKey(verb: string): string {
  return verb
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function normalizeText(s: string): string {
  return s
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
  if (key === "deja" && /\benfr/i.test(t)) return "Enfriar";
  if (key === "anade" || key === "añade") {
    if (/\b(aceite|en hilo)\b/i.test(t)) return "Añadir aceite";
    if (/\b(px|pedro|vino|caldo)\b/i.test(t)) return "Añadir líquido";
  }
  if (TITLE_MAP[key]) return TITLE_MAP[key]!;
  return capitalize(m[1]!);
}

export function isServePaso(paso: Pick<Paso, "titulo" | "descripcion">): boolean {
  const titulo = paso.titulo.trim();
  if (SERVE_TITLE.test(titulo)) return true;
  const n = normalizeText(titulo);
  if (n === "servir" || n === "emplatar") return true;
  // Micro-paso solo de servicio (sin espera)
  const d = normalizeText(paso.descripcion);
  if (/^(sirve|emplata|acompan)\b/.test(d) && !TIMED_ACTION.test(paso.descripcion)) {
    return true;
  }
  return false;
}

export function isTimedPaso(paso: Pick<Paso, "titulo" | "descripcion">): boolean {
  if (isServePaso(paso)) return false;
  return TIMED_ACTION.test(`${paso.titulo} ${paso.descripcion}`);
}

/** Índice del átomo que debe heredar el temporizador del paso original. */
function timerAtomIndex(atoms: string[], fallbackTitle: string): number {
  const scored = atoms.map((atom, i) => {
    const titulo = titleFromAtom(atom, fallbackTitle);
    const paso = { titulo, descripcion: atom };
    if (isServePaso(paso)) return { i, score: -10 };
    if (isTimedPaso(paso)) return { i, score: 5 };
    // Preferir cocción / reposo por título
    if (/^(cocer|hervir|freír|hornear|reposar|enfriar|remojar|marinar|estofar|blanquear)$/i.test(titulo)) {
      return { i, score: 4 };
    }
    return { i, score: 0 };
  });

  scored.sort((a, b) => b.score - a.score || b.i - a.i);
  const best = scored[0];
  if (best && best.score > 0) return best.i;

  // Último átomo que no sea servir
  for (let i = atoms.length - 1; i >= 0; i--) {
    const titulo = titleFromAtom(atoms[i]!, fallbackTitle);
    if (!isServePaso({ titulo, descripcion: atoms[i]! })) return i;
  }
  return -1; // todos son servir → no asignar timer
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

  return atoms.filter((a) => a.length > 2);
}

/**
 * Quita temporizadores de pasos de servir / remate y de acciones
 * que no implican espera real. Infiere tiempos explícitos del texto
 * (p. ej. «reposa 10 min», «enfría 1 hora») en pasos de espera.
 */
export function sanitizePasoTimers(pasos: Paso[]): Paso[] {
  return pasos.map((p) => {
    if (isServePaso(p)) {
      if (p.tiempoSegundos == null) return p;
      const { tiempoSegundos: _t, ...rest } = p;
      return rest;
    }

    if (
      /^(escurrir|reservar|secar|apartar|retirar)$/i.test(p.titulo.trim()) &&
      !TIMED_ACTION.test(p.descripcion)
    ) {
      if (p.tiempoSegundos == null) return p;
      const { tiempoSegundos: _t, ...rest } = p;
      return rest;
    }

    if (p.tiempoSegundos != null) return p;

    const inferred = inferTiempoSegundos(p.descripcion);
    if (inferred != null && isTimedPaso(p)) {
      return { ...p, tiempoSegundos: inferred };
    }
    return p;
  });
}

/** Extrae duración explícita del texto de un paso (minutos / horas). */
export function inferTiempoSegundos(text: string): number | undefined {
  const n = normalizeText(text);

  if (/\btoda la noche\b|\bdurante la noche\b/.test(n)) return 8 * 3600;

  const range = text.match(/(\d+)\s*[-–]\s*(\d+)\s*min/i);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return Math.round((a + b) / 2) * 60;
  }

  const minWord = n.match(
    /\b(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|quince|veinte|treinta|cuarenta|cuarenta y cinco|sesenta)\s+minutos?\b/,
  );
  if (minWord) {
    const words: Record<string, number> = {
      un: 1,
      una: 1,
      dos: 2,
      tres: 3,
      cuatro: 4,
      cinco: 5,
      seis: 6,
      siete: 7,
      ocho: 8,
      nueve: 9,
      diez: 10,
      quince: 15,
      veinte: 20,
      treinta: 30,
      cuarenta: 40,
      "cuarenta y cinco": 45,
      sesenta: 60,
    };
    const v = words[minWord[1]!];
    if (v) return v * 60;
  }

  const min = text.match(/(\d+)\s*min/i);
  if (min) return Number(min[1]) * 60;

  if (/\b(una|1)\s*hora\b/.test(n) || /\bal menos (una|1) hora\b/.test(n)) {
    return 3600;
  }

  const horas = text.match(/(\d+[.,]?\d*)\s*[-–]?\s*(\d+[.,]?\d*)?\s*h(?:oras?)?\b/i);
  if (horas) {
    const a = Number(String(horas[1]).replace(",", "."));
    const b = horas[2] ? Number(String(horas[2]).replace(",", ".")) : a;
    return Math.round(((a + b) / 2) * 3600);
  }

  const segs = text.match(/(\d+)\s*segundos?\b/i);
  if (segs) return Number(segs[1]);

  return undefined;
}

/**
 * Expande pasos compuestos en micro-pasos del modo cocina / ficha.
 * "Sala, enharina y dora las carrilleras. Reserva." → 4 pasos.
 * El temporizador va al átomo de espera/cocción, nunca a «Servir».
 */
export function expandPasos(pasos: Paso[]): Paso[] {
  const expanded: Paso[] = [];

  for (const p of pasos) {
    const atoms = splitActionAtoms(p.descripcion);
    if (atoms.length <= 1) {
      expanded.push(p);
      continue;
    }

    const timerIdx =
      p.tiempoSegundos != null ? timerAtomIndex(atoms, p.titulo) : -1;

    atoms.forEach((atom, i) => {
      const titulo = titleFromAtom(atom, p.titulo);
      const descripcion = /[.!?]$/.test(atom) ? atom : `${atom}.`;
      expanded.push({
        numero: 0,
        titulo,
        descripcion,
        ...(i === timerIdx && p.tiempoSegundos != null
          ? { tiempoSegundos: p.tiempoSegundos }
          : {}),
        ...(i === atoms.length - 1 && p.consejo ? { consejo: p.consejo } : {}),
      });
    });
  }

  return sanitizePasoTimers(
    expanded.map((p, i) => ({ ...p, numero: i + 1 })),
  );
}
