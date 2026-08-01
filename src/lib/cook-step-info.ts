import {
  cookActionLabel,
  cookActionTip,
  detectCookAction,
  type CookAction,
} from "@/lib/cook-actions";
import { splitActionAtoms } from "@/lib/expand-pasos";
import type { Ingrediente, Paso, Receta } from "@/types/receta";

export interface CookStepSideInfo {
  action: CookAction;
  actionLabel: string;
  tip: string;
  progressLabel: string;
  checklist: string[];
  ingredientes: Ingrediente[];
  tiempoLabel: string | null;
  prevTitulo: string | null;
  nextTitulo: string | null;
  liquid: StepLiquid;
}

function normalize(s: string): string {
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

/** Medio líquido del paso (para tips/checklist/animación coherentes). */
export type StepLiquid =
  | "leche"
  | "tomate"
  | "agua"
  | "miel"
  | "aceite"
  | "vino"
  | "caldo"
  | "otro"
  | null;

export function detectStepLiquid(
  titulo: string,
  descripcion: string,
  receta?: Receta,
): StepLiquid {
  // Texto sin tildes: "baña" → "bana", para que los regex no fallen
  const text = normalize(`${titulo}. ${descripcion}`);

  if (/\b(miel|almibar|sirope)\b/.test(text)) return "miel";
  if (/\b(jugo de (los )?tomates?|tomate|tomates)\b/.test(text)) return "tomate";
  // "nata" solo como lácteo real, no metáforas tipo "textura de nata"
  if (
    /\b(leche|lacteo)\b/.test(text) ||
    (/\bnata\b/.test(text) && !/textura de nata/.test(text))
  ) {
    return "leche";
  }
  if (/\b(caldo|fumet)\b/.test(text)) return "caldo";
  if (/\b(vino)\b/.test(text)) return "vino";
  if (/\b(aceite)\b/.test(text) && /\b(bana|remoja|unta|alin)/.test(text)) return "aceite";
  if (/\b(agua)\b/.test(text)) return "agua";

  // Paso vago ("Empapar", "Baña las rebanadas…"): mirar receta
  if (receta && /\b(empap|remoja|bana|humedece)\b/.test(text)) {
    const names = receta.ingredientes.map((i) => normalize(i.nombre)).join(" ");
    const hasLeche = /\bleche\b/.test(names);
    const hasTomate = /\btomate\b/.test(names);
    const mentionsPan = /\b(pan|rebanadas?|miga|telera)\b/.test(text);
    const vague = !/\b(tomate|jugo|leche|agua|miel)\b/.test(text);
    if (hasLeche && (mentionsPan || vague) && !hasTomate) return "leche";
    if (hasTomate && (mentionsPan || vague)) return "tomate";
    if (/\bagua\b/.test(names) && (mentionsPan || vague) && !hasLeche) return "agua";
  }

  return null;
}

/** Parte la descripción en micro-pasos reales cuando se puede. */
function checklistFromDescription(descripcion: string): string[] | null {
  const atoms = splitActionAtoms(descripcion);
  if (atoms.length >= 2) {
    return atoms.slice(0, 6).map(capitalize);
  }
  return null;
}

function checklistFallback(
  action: CookAction,
  titulo: string,
  descripcion: string,
  liquid: StepLiquid,
): string[] {
  const text = normalize(`${titulo} ${descripcion}`);

  if (action === "empapar") {
    if (liquid === "tomate") {
      return [
        "Trocea o parte el pan",
        "Remoja con el jugo de tomate",
        "Que quede húmedo, no hecho papilla",
      ];
    }
    if (liquid === "leche") {
      return [
        "Ten la leche tibia lista",
        "Empapa las rebanadas sin saturar",
        "Escurre el exceso",
      ];
    }
    if (liquid === "agua") {
      return [
        "Prepara el agua (fría o tibia según el paso)",
        "Remoja el tiempo indicado",
        "Escurre bien antes de seguir",
      ];
    }
    if (liquid === "miel") {
      return [
        "Calienta la miel hasta que esté fluida",
        "Baña o espolvorea",
        "Deja orear sobre rejilla",
      ];
    }
    return [
      "Prepara el líquido del paso",
      "Humedece sin saturar",
      "Escurre el exceso",
    ];
  }

  if (action === "rebozar") {
    if (/\bhuevo|batido\b/.test(text)) {
      return ["Bate los huevos", "Pasa por ambos lados", "Deja escurrir el exceso"];
    }
    if (/\bharina|enharin\b/.test(text)) {
      return ["Prepara la harina", "Cubre con capa fina", "Sacude el exceso"];
    }
    if (/\bpan rallado|empan\b/.test(text)) {
      return ["Pasa por harina si indica", "Huevo y pan rallado", "Presiona para que agarre"];
    }
    if (/\bazucar|canela|miel\b/.test(text)) {
      return ["Ten el rebozado listo", "Pasa aún tibio", "Deja reposar un momento"];
    }
    return ["Prepara el rebozado", "Cubre por completo", "Sacude el exceso"];
  }

  if (action === "hervir") {
    if (liquid === "leche" || /\bleche\b/.test(text)) {
      return ["Vierte la leche", "Añade aromas y endulza", "Infusiona y deja templar"];
    }
    if (/\bescalda|tomate\b/.test(text)) {
      return ["Hierve agua abundante", "Escalda el tiempo indicado", "Pasa a frío y pela"];
    }
    if (/\balmibar|azucar\b/.test(text)) {
      return ["Junta agua y azúcar", "Hierve hasta el punto", "Retira del fuego"];
    }
    return ["Prepara el recipiente", "Lleva a ebullición suave", "Controla el punto"];
  }

  if (action === "freir") {
    return ["Calienta el aceite", "Fríe sin amontonar", "Escurre sobre papel"];
  }
  if (action === "sofrito") {
    return ["Corta lo necesario", "Sofríe a fuego medio-bajo", "No dejes que se queme"];
  }
  if (action === "cortar") {
    if (/\bpan|rebanada\b/.test(text)) {
      return ["Prepara el pan", "Corta en trozos o rebanadas regulares", "Reserva"];
    }
    return ["Prepara tabla y cuchillo", "Corta en trozos regulares", "Reserva listo para usar"];
  }
  if (action === "triturar") {
    if (/\bemulsion|aceite\b/.test(text)) {
      return ["Con la base ya triturada", "Añade el aceite en hilo", "Hasta emulsión sedosa"];
    }
    return ["Echa todo en la batidora", "Tritura a pulsos", "Ajusta sal y textura"];
  }
  if (action === "mezclar") {
    return ["Junta los ingredientes", "Mezcla hasta integrar", "Revisa la textura"];
  }
  if (action === "amasar") {
    return ["Amasa hasta lisura", "Forma las piezas", "Deja reposar si indica"];
  }
  if (action === "hornear") {
    return ["Precalienta el horno", "Hornea el tiempo indicado", "Comprueba el punto"];
  }
  if (action === "enfriar") {
    if (/\brepos\b/.test(text)) {
      return ["Pasa a un recipiente", "Enfría en la nevera", "Prueba y ajusta antes de servir"];
    }
    return ["Deja templar", "Pasa a frío si toca", "No tapes si debe secar"];
  }
  if (action === "aliñar") {
    return ["Prepara el aliño", "Prueba y ajusta", "Aliña al final"];
  }
  if (action === "fruta") {
    return ["Lava y pela", "Corta o separa gajos", "Reserva los jugos"];
  }
  if (action === "preparar") {
    return ["Reúne lo del paso", "Limpia o corta si hace falta", "Deja todo a mano"];
  }
  if (action === "servir") {
    if (/\bazucar|canela|miel\b/.test(text)) {
      return ["Prepara el remate dulce", "Reboza o baña", "Sirve al gusto (tibio o frío)"];
    }
    return ["Emplata con cuidado", "Añade el remate", "Sirve al momento"];
  }
  return ["Lee el paso entero", "Ten a mano lo necesario", "Sigue al siguiente"];
}

export function checklistDelPaso(
  action: CookAction,
  titulo: string,
  descripcion: string,
  receta?: Receta,
): string[] {
  const fromText = checklistFromDescription(descripcion);
  if (fromText) return fromText;

  // Paso ya atómico (p. ej. «Sala.» / «Reserva.»): una sola casilla clara
  const clean = descripcion.trim().replace(/[.;]+$/, "");
  if (clean.length > 0 && clean.length <= 72) {
    return [capitalize(clean)];
  }

  const liquid = detectStepLiquid(titulo, descripcion, receta);
  return checklistFallback(action, titulo, descripcion, liquid);
}

/** Sinónimos / raíces para emparejar texto del paso ↔ ingredientes. */
const ING_ALIASES: Record<string, string[]> = {
  pan: ["pan", "telera", "candeal", "miga", "rebanada", "hogaza"],
  tomate: ["tomate", "tomates", "jugo"],
  leche: ["leche", "nata", "lacteo"],
  huevo: ["huevo", "huevos", "yema"],
  ajo: ["ajo", "ajos"],
  aceite: ["aceite", "aove"],
  harina: ["harina"],
  azucar: ["azucar", "azúcar"],
  canela: ["canela"],
  limon: ["limon", "limón"],
  miel: ["miel"],
  vinagre: ["vinagre"],
  sal: ["sal"],
  agua: ["agua"],
  pepino: ["pepino"],
  pimiento: ["pimiento"],
  almendra: ["almendra", "almendras"],
  jamon: ["jamon", "jamón"],
  pescado: ["pescado", "boqueron", "calamar", "puntill", "salmonete"],
};

function stepKeywords(titulo: string, descripcion: string): Set<string> {
  const text = normalize(`${titulo} ${descripcion}`);
  const words = new Set(
    text.split(/[^a-z0-9ñ]+/).filter((w) => w.length >= 3),
  );
  // Expand aliases when a cue word appears
  for (const [key, aliases] of Object.entries(ING_ALIASES)) {
    if (aliases.some((a) => words.has(normalize(a)) || text.includes(normalize(a)))) {
      words.add(key);
      for (const a of aliases) words.add(normalize(a));
    }
  }
  return words;
}

export function ingredientesDelPaso(
  paso: Paso,
  ingredientes: Ingrediente[],
  action: CookAction,
  receta?: Receta,
): Ingrediente[] {
  const keys = stepKeywords(paso.titulo, paso.descripcion);
  const liquid = detectStepLiquid(paso.titulo, paso.descripcion, receta);

  // Añadir el líquido detectado por contexto (p. ej. torrijas "Empapar" → leche)
  if (liquid === "leche") keys.add("leche");
  if (liquid === "tomate") {
    keys.add("tomate");
    keys.add("tomates");
  }
  if (liquid === "agua") keys.add("agua");
  if (liquid === "miel") keys.add("miel");

  const scored = ingredientes
    .map((ing) => {
      const name = normalize(ing.nombre);
      const nameParts = name.split(/[^a-z0-9ñ]+/).filter(Boolean);
      let score = 0;
      for (const part of nameParts) {
        if (part.length < 3) continue;
        if (keys.has(part)) score += 3;
        else if ([...keys].some((k) => k.length >= 4 && (part.includes(k) || k.includes(part)))) {
          score += 2;
        }
      }
      // No empujar aceite/sal a cada paso solo por ser ubicuos
      if (score > 0 && /^(sal|pimienta)$/.test(nameParts[0] ?? "") && !keys.has("sal")) {
        score = 0;
      }
      return { ing, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  let list = scored.map((x) => x.ing).slice(0, 5);

  // Si el paso es freír y no salió aceite, añádelo
  if (action === "freir") {
    const oil = ingredientes.find((i) => /aceite/.test(normalize(i.nombre)));
    if (oil && !list.some((i) => i.id === oil.id)) list = [oil, ...list].slice(0, 5);
  }

  return list;
}

export function getCookStepSideInfo(
  receta: Receta,
  stepIndex: number,
): CookStepSideInfo {
  const paso = receta.pasos[stepIndex]!;
  const total = receta.pasos.length;
  const action = detectCookAction(paso.titulo, paso.descripcion);
  const liquid = detectStepLiquid(paso.titulo, paso.descripcion, receta);
  const tip =
    paso.consejo?.trim() ||
    cookActionTip(action, paso.titulo, paso.descripcion, liquid);

  return {
    action,
    actionLabel: cookActionLabel(action, paso.titulo),
    tip,
    progressLabel: `Paso ${paso.numero} de ${total}`,
    checklist: checklistDelPaso(action, paso.titulo, paso.descripcion, receta),
    ingredientes: ingredientesDelPaso(paso, receta.ingredientes, action, receta),
    tiempoLabel: paso.tiempoSegundos
      ? paso.tiempoSegundos >= 60
        ? `${Math.round(paso.tiempoSegundos / 60)} min en este paso`
        : `${paso.tiempoSegundos} s en este paso`
      : null,
    prevTitulo: stepIndex > 0 ? (receta.pasos[stepIndex - 1]?.titulo ?? null) : null,
    nextTitulo:
      stepIndex < total - 1 ? (receta.pasos[stepIndex + 1]?.titulo ?? null) : null,
    liquid,
  };
}
