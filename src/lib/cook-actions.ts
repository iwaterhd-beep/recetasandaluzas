/** Acción visual del modo cocina, detectada del texto del paso. */
export type CookAction =
  | "cortar"
  | "fruta"
  | "hervir"
  | "freir"
  | "rebozar"
  | "sofrito"
  | "triturar"
  | "mezclar"
  | "amasar"
  | "hornear"
  | "enfriar"
  | "aliñar"
  | "empapar"
  | "preparar"
  | "servir"
  | "cocinar";

/** Títulos cortos de acción: tienen prioridad sobre la descripción. */
const TITLE_RULES: { action: CookAction; patterns: RegExp }[] = [
  { action: "rebozar", patterns: /^(rebozar|empanar|enharinar)\b/i },
  { action: "empapar", patterns: /^(empapar|bañar|remojar)\b/i },
  { action: "freir", patterns: /^(freír|freir|fritura|sellar|dorar)\b/i },
  { action: "sofrito", patterns: /^(sofrito|sofreír|sofreir|pochar|saltear|rehogar)\b/i },
  { action: "aliñar", patterns: /^(salar|salpimentar)\b/i },
  {
    action: "hervir",
    patterns:
      /^(hervir|cocer|cocinar|guisar|estofar|escaldar|blanquear|infusionar|infusion|leche|caldo|almíbar|almibar|cocción|coccion)\b/i,
  },
  { action: "cortar", patterns: /^(cortar|trocear|picar|laminar|rebanar|desmigar|aplanar)\b/i },
  { action: "triturar", patterns: /^(triturar|batir|licuar|emulsionar|machacar|mayonesa)\b/i },
  { action: "mezclar", patterns: /^(mezclar|masa|incorporar)\b/i },
  { action: "amasar", patterns: /^(amasar|envolver|rellenar)\b/i },
  { action: "hornear", patterns: /^(hornear|asar|gratinar|tostar)\b/i },
  { action: "enfriar", patterns: /^(enfriar|reposar|secar|escurrir)\b/i },
  { action: "aliñar", patterns: /^(aliñar|aderezar|sazonar|marinar|adobo)\b/i },
  { action: "fruta", patterns: /^(fruta|gajos|naranja)\b/i },
  { action: "preparar", patterns: /^(preparar|reservar|apartar)\b/i },
  { action: "servir", patterns: /^(servir|emplatar|acabar|presentar)\b/i },
];

const RULES: { action: CookAction; patterns: RegExp }[] = [
  {
    action: "rebozar",
    patterns:
      /\b(rebozar|reboza|empanar|empana|enharinar|enharina|pasa por huevo|pasa por harina|pasa por pan|pasa por azúcar|pasa por azucar|huevo batido|pan rallado|sacude (el )?exceso|sacudiendo)\b/i,
  },
  {
    action: "empapar",
    patterns:
      /\b(empapar|empapa|baña|bañar|remoja|remojar|embeber|moja las|mojar las|hasta empapar|humedece el pan)\b/i,
  },
  {
    action: "freir",
    patterns:
      /\b(freír|freir|fríe|frie|fritura|aceite caliente|aceite muy caliente)\b/i,
  },
  {
    action: "sofrito",
    patterns:
      /\b(sofrito|sofreír|sofreir|sofríe|sofrie|pochar|pocha|poha|saltear|saltea|rehogar|rehoga|sellar|sella|dorar|dora |ajillo|marca los|tuesta|confit|reduce|reducir|unta con)\b/i,
  },
  {
    action: "hervir",
    patterns:
      /\b(hervir|hierve|hirviendo|olla|cocer|cuece|cuecen|cociendo|cocinar|se cocina|cocción|coccion|escaldar|escalda|blanquear|potaje|puchero|guisar|guiso|estofar|estofa|caldo|fumet|infusion|infusión|ebullición|almíbar|almibar|hebra|calienta la miel|a fuego (lento|medio|suave)|chup[- ]?chup)\b/i,
  },
  {
    action: "fruta",
    patterns:
      /\b(fruta|naranja|melón|melon|sandía|sandia|manzana|uva|gajos de naranja|pela naranjas|a vivo)\b/i,
  },
  {
    action: "cortar",
    patterns:
      /\b(cortar|corta|trocear|trocea|medallón|medallon|medallones|laminar|lamina|juliana|dados|picar|pica|filetear|rebanar|en rodajas|en gajos|en tiras|chasc|partir|desmiga|desmenuza|aplana|limpia las|limpia los)\b/i,
  },
  {
    action: "triturar",
    patterns:
      /\b(triturar|tritura|batir|bate|emulsionar|emulsiona|emulsión|emulsion|licuar|mixer|batidora|puré|pure|crema homogénea|machaca|cuaja huevos|revueltos)\b/i,
  },
  {
    action: "mezclar",
    patterns:
      /\b(mezclar|mezcla|incorpora|incorporar|remueve|remover|montar|monta )\b/i,
  },
  {
    action: "amasar",
    patterns:
      /\b(amasar|amasa|forma |formar|extender masa|envolver|rellenar|ensarta|divide la masa|estira)\b/i,
  },
  {
    action: "hornear",
    patterns: /\b(hornear|horno|hornea|gratinar|asados?|asar|\basa\b|soplete|quema con)\b/i,
  },
  {
    action: "enfriar",
    patterns:
      /\b(enfriar|enfría|enfria|refriger|reposar|reposa|dejar reposar|nevera|seca bien|secar|escurr)\b/i,
  },
  {
    action: "aliñar",
    patterns:
      /\b(aliñar|aliña|aderezar|sazonar|sal y pimienta|vinagre|aceite de oliva|marinar|adobo)\b/i,
  },
  {
    action: "preparar",
    patterns:
      /\b(preparar los ingredientes|prepara un|mise en place|reserva cáscaras|forra molde)\b/i,
  },
  {
    action: "servir",
    patterns: /\b(servir|sirve|emplatar|terminar y servir|presentar|reparte en)\b/i,
  },
  {
    action: "sofrito",
    // ligar / cocinar en sartén sin verbo más específico
    patterns: /\b(ligar|salsa ligera|fuego medio)\b/i,
  },
];

const LABELS: Record<CookAction, string> = {
  cortar: "Cortar",
  fruta: "Preparar fruta",
  hervir: "Hervir",
  freir: "Freír",
  rebozar: "Rebozar",
  sofrito: "Sofreír",
  triturar: "Triturar",
  mezclar: "Mezclar",
  amasar: "Amasar",
  hornear: "Hornear",
  enfriar: "Enfriar",
  aliñar: "Aliñar",
  empapar: "Empapar",
  preparar: "Preparar",
  servir: "Servir",
  cocinar: "Cocinar",
};

const TIPS: Record<CookAction, string> = {
  cortar: "Cuchillo afilado y tabla estable. Piezas del mismo tamaño cuecen igual.",
  fruta: "Pela con cuidado y reserva los jugos: aportan sabor al aliño.",
  hervir: "Fuego medio: que hierva suave sin salirse de la olla.",
  freir: "Aceite caliente pero sin humear. Escurre bien sobre papel.",
  rebozar: "Cubre bien y sacude el exceso: así no se desprende al freír.",
  sofrito: "Fuego medio-bajo: el ajo y la cebolla deben sudar, no quemarse.",
  triturar: "Empieza a pulsos. Añade líquido poco a poco hasta la textura deseada.",
  mezclar: "Incorpora con movimientos envolventes para no perder aire ni textura.",
  amasar: "Si pega un poco, humedece las manos; no abuses de harina extra.",
  hornear: "Precalienta siempre. Abre el horno lo justo para no perder calor.",
  enfriar: "Deja templar antes de nevera si el recipiente está muy caliente.",
  aliñar: "Prueba y ajusta sal, vinagre y AOVE al final.",
  empapar: "Humedece lo justo: debe absorber líquido sin deshacerse ni quedar encharcado.",
  preparar: "Ten todo a mano antes de encender el fuego: mise en place.",
  servir: "Emplata con cuidado, añade el remate y sirve al punto indicado (caliente o frío).",
  cocinar: "Lee el paso entero antes de moverte. Ten a mano lo que necesitas.",
};

/**
 * Detecta la acción del paso.
 * 1) Título corto de acción ("Rebozar", "Freír"…) — prioridad.
 * 2) Título + descripción con reglas ordenadas de más a menos específicas.
 */
export function detectCookAction(titulo: string, descripcion: string): CookAction {
  const t = titulo.trim();
  for (const rule of TITLE_RULES) {
    if (rule.patterns.test(t)) return rule.action;
  }
  const text = `${t}. ${descripcion}`;
  for (const rule of RULES) {
    if (rule.patterns.test(text)) return rule.action;
  }
  return "cocinar";
}

/**
 * Etiqueta visible de la técnica.
 * Si hay título de paso, prioriza el verbo concreto (Escaldar, Remojar…).
 */
export function cookActionLabel(action: CookAction, titulo = ""): string {
  const t = titulo.trim().toLowerCase();
  if (/^escaldar/.test(t)) return "Escaldar";
  if (/^remojar/.test(t)) return "Remojar";
  if (/^emulsionar/.test(t)) return "Emulsionar";
  if (/^secar/.test(t)) return "Secar";
  if (/^escurrir/.test(t)) return "Escurrir";
  if (/^repos/.test(t)) return "Reposar";
  if (/^enharinar/.test(t)) return "Enharinar";
  if (/^empanar/.test(t)) return "Empanar";
  if (/^salar/.test(t)) return "Salar";
  if (/^dorar/.test(t)) return "Dorar";
  if (/^sellar/.test(t)) return "Sellar";
  if (/^reservar/.test(t)) return "Reservar";
  if (/^blanquear/.test(t)) return "Blanquear";
  if (/^guisar/.test(t)) return "Guisar";
  if (/^estofar/.test(t)) return "Estofar";
  if (/^cocer/.test(t)) return "Cocer";
  if (/^cocinar/.test(t)) return "Cocinar";
  return LABELS[action];
}

export type CookTipLiquid =
  | "leche"
  | "tomate"
  | "agua"
  | "miel"
  | "aceite"
  | "vino"
  | "caldo"
  | "otro"
  | null;

/** Consejo contextual según acción + texto (y líquido detectado) del paso. */
export function cookActionTip(
  action: CookAction,
  titulo = "",
  descripcion = "",
  liquid: CookTipLiquid = null,
): string {
  const text = `${titulo}. ${descripcion}`.toLowerCase();

  if (action === "hervir") {
    if (liquid === "leche" || /\b(leche|lácteo|lacteo|nata)\b/.test(text)) {
      return "Remueve a menudo para que no se pegue ni se desborde. Apaga y deja infusionar; debe quedar tibia, no hirviendo.";
    }
    if (/\b(escaldar|escalda|tomate)\b/.test(text)) {
      return "Agua a bullición: escalda poco tiempo, pasa a agua fría y pela con facilidad.";
    }
    if (/\b(pasta|fideo|espagueti)\b/.test(text)) {
      return "Agua abundante y en ebullición antes de echar la pasta. Remueve al empezar.";
    }
    if (/\b(caldo|fumet|pescado|marisco)\b/.test(text)) {
      return "Hierve suave y espuma si hace falta. Cuece lo justo para no enturbiar el caldo.";
    }
    if (/\b(almíbar|almibar|azúcar|azucar)\b/.test(text)) {
      return "No remuevas en exceso una vez hierva: espera el punto (hebra) sin quemar.";
    }
  }

  if (action === "rebozar") {
    if (/\b(pan rallado|empanar|empan)\b/.test(text)) {
      return "Orden: harina → huevo → pan rallado. Presiona bien; la doble capa aguanta mejor la fritura.";
    }
    if (/\b(huevo|batido)\b/.test(text)) {
      return "Bate el huevo, pasa por ambos lados y deja escurrir el exceso antes de freír.";
    }
    if (/\b(harina|enharin)\b/.test(text)) {
      return "Capa fina y uniforme: sacude bien; el exceso de harina quema el aceite.";
    }
    if (/\b(azúcar|azucar|canela|miel)\b/.test(text)) {
      return "Reboza aún tibio para que el azúcar o la miel se peguen bien.";
    }
  }

  if (action === "empapar") {
    if (liquid === "tomate" || /\b(jugo|tomate)\b/.test(text)) {
      return "Solo un poco de jugo: el pan debe humedecerse para triturar mejor, no convertirse en papilla.";
    }
    if (liquid === "leche" || /\b(leche|lácteo|lacteo)\b/.test(text)) {
      return "Leche tibia, no hirviendo. Empapa sin saturar o la rebanada se deshará al freír.";
    }
    if (liquid === "agua" || /\b(agua)\b/.test(text)) {
      return "Remoja el tiempo indicado y escurre bien: el exceso de agua diluye el sabor.";
    }
    if (liquid === "miel" || /\b(miel|almíbar|almibar)\b/.test(text)) {
      return "Baña por ambos lados y deja orear unos minutos sobre rejilla.";
    }
  }

  if (action === "aliñar") {
    if (/\b(sala|salar|salpiment|pizca de sal)\b/.test(text) && !/\b(vinagre|ali[nñ]|aceite)\b/.test(text)) {
      return "Sala de forma uniforme. En carnes, ayuda a que se doren mejor al sellar.";
    }
  }

  if (action === "freir") {
    if (/\b(sella|dorar|dora |carriller|medall|carne|rabo)\b/.test(text)) {
      return "Aceite caliente y sartén sin amontonar: dora bien por todos lados y reserva. El color da el sabor.";
    }
    if (/\b(torrija|rebanada|pan|dorad)/.test(text)) {
      return "Aceite medio-alto. Dora un lado, da la vuelta y escurre sobre papel.";
    }
    if (/\b(pescado|boquerón|calamar|puntill)\b/.test(text)) {
      return "Aceite muy caliente y tandas pequeñas: deben quedar crujientes, no aceitosas.";
    }
  }

  if (action === "sofrito") {
    if (/\b(reduce|reducir|a la mitad|px|pedro|vino|caldo)\b/.test(text)) {
      return "Fuego medio-alto al principio: reduce el líquido a la mitad para concentrar el sabor sin quemar los azúcares.";
    }
    if (/\b(ajo|ajillo)\b/.test(text)) {
      return "El ajo debe dorarse sin quemarse: en cuanto huele, sigue al siguiente paso.";
    }
    if (/\b(cebolla)\b/.test(text)) {
      return "Fuego medio-bajo: la cebolla debe quedar transparente y dulce, no tostada.";
    }
  }

  if (action === "preparar") {
    if (/\b(reserva|apart)\b/.test(text)) {
      return "Aparta en un plato: lo reincorporarás más adelante para que no se reseque en la sartén.";
    }
  }

  if (action === "cortar") {
    if (/\b(aplana|filete|lomo)\b/.test(text)) {
      return "Entre film, golpea con suavidad hasta un grosor uniforme sin romper la carne.";
    }
    if (/\b(pan|rebanada|torrija)\b/.test(text)) {
      return "Trozo o rebanada regular: así se empapa y cocina por igual.";
    }
    if (/\b(cebolla|ajo|tomate|verdura|pepino|pimiento)\b/.test(text)) {
      return "Trozo regular: así todo se cocina (o se tritura) al mismo tiempo.";
    }
  }

  if (action === "triturar") {
    if (/\b(emulsion|aceite en hilo|en hilo)\b/.test(text)) {
      return "Aceite en hilo fino, sin prisa: si se corta, añade un chorrito de agua fría y sigue.";
    }
    if (/\b(tomate|gazpacho|salmorejo|porra|ajo)\b/.test(text)) {
      return "Tritura primero sólidos con un poco de líquido; reserva aceite para emulsionar después.";
    }
  }

  if (action === "servir") {
    if (/\b(azúcar|canela|miel)\b/.test(text)) {
      return "Espolvorea o baña al momento de servir para que quede crujiente o brillante.";
    }
    if (/\b(fr[ií]o|helad|nevera)\b/.test(text)) {
      return "Sirve bien frío; añade el remate (uvas, jamón, huevo…) en el último momento.";
    }
    if (/\b(jamón|huevo|atún)\b/.test(text)) {
      return "El remate (jamón, huevo…) al final, para que no se reseque ni se hunda.";
    }
  }

  if (action === "enfriar") {
    if (/\b(secar|seca bien|papel|escurr)\b/.test(text)) {
      return "Seca bien con papel de cocina: la humedad hace que salpique el aceite y el rebozado no agarre.";
    }
    if (/\brepos|enfr[ií]|refrigera|nevera|fr[ií]o/.test(text)) {
      return "El frío redondea el sabor. Prueba sal y vinagre justo antes de servir.";
    }
  }

  if (action === "amasar") {
    if (/\b(enrolla|rellen|palillo|film)\b/.test(text)) {
      return "Enrolla apretado y uniforme; el frío ayuda a que no se abra al freír.";
    }
  }

  return TIPS[action];
}
