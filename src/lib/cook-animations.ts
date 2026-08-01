import type { CookAction } from "@/lib/cook-actions";

/**
 * Animaciones Noto Color Emoji (Google) — WebP animados de internet.
 * https://googlefonts.github.io/noto-emoji-animation/
 * https://fonts.gstatic.com/s/e/notoemoji/latest/{code}/512.webp
 */
export interface CookAnimResolved {
  src: string;
  alt: string;
  secondary?: string;
}

const A = {
  zanahoria: "/animations/cocina/zanahoria.webp",
  cebolla: "/animations/cocina/cebolla.webp",
  ajo: "/animations/cocina/ajo.webp",
  tomate: "/animations/cocina/tomate.webp",
  patata: "/animations/cocina/patata.webp",
  pimiento: "/animations/cocina/pimiento.webp",
  aguacate: "/animations/cocina/aguacate.webp",
  hoja: "/animations/cocina/hoja-verde.webp",
  pollo: "/animations/cocina/pollo.webp",
  bacon: "/animations/cocina/bacon.webp",
  pan: "/animations/cocina/pan.webp",
  pretzel: "/animations/cocina/pretzel.webp",
  naranja: "/animations/cocina/naranja.webp",
  manzana: "/animations/cocina/manzana.webp",
  uvas: "/animations/cocina/uvas.webp",
  sandia: "/animations/cocina/sandia.webp",
  limon: "/animations/cocina/limon.webp",
  fresa: "/animations/cocina/fresa.webp",
  freir: "/animations/cocina/freir.webp",
  fuego: "/animations/cocina/fuego.webp",
  vapor: "/animations/cocina/vapor.webp",
  gota: "/animations/cocina/gota.webp",
  verter: "/animations/cocina/verter.webp",
  mano: "/animations/cocina/mano.webp",
  bebida: "/animations/cocina/bebida-caliente.webp",
  tetera: "/animations/cocina/tetera.webp",
  biberon: "/animations/cocina/biberon.webp",
  /** Brick / cartón de bebida (líquido claro, no café) */
  leche: "/animations/cocina/caja-bebida.webp",
  espagueti: "/animations/cocina/espagueti.webp",
  ensalada: "/animations/cocina/ensalada.webp",
  pancakes: "/animations/cocina/pancakes.webp",
  galleta: "/animations/cocina/galleta.webp",
  pastel: "/animations/cocina/pastel.webp",
  nieve: "/animations/cocina/nieve.webp",
  frio: "/animations/cocina/cara-frio.webp",
  sal: "/animations/cocina/sal.webp",
  plato: "/animations/cocina/plato-cubiertos.webp",
  hierba: "/animations/cocina/hierba.webp",
  champiñon: "/animations/cocina/champiñon.webp",
  pescado: "/animations/cocina/pescado.webp",
  queso: "/animations/cocina/queso.webp",
} as const;

export type CookAnimLiquid =
  | "leche"
  | "tomate"
  | "agua"
  | "miel"
  | "aceite"
  | "vino"
  | "caldo"
  | "otro"
  | null;

/** Resuelve animación Noto según acción + texto del paso (+ líquido si se conoce). */
export function resolveCookAnimation(
  action: CookAction,
  titulo: string,
  descripcion: string,
  liquid: CookAnimLiquid = null,
): CookAnimResolved {
  const text = `${titulo} ${descripcion}`.toLowerCase();

  switch (action) {
    case "hervir": {
      if (/\b(pasta|fideo|espagueti|noodles)\b/.test(text)) {
        return { src: A.espagueti, alt: "Cociendo pasta", secondary: A.vapor };
      }
      // Leche: cartón de bebida (claro) + vapor — no café oscuro ni biberón
      if (/\b(leche|lácteo|lacteo|nata)\b/.test(text)) {
        return { src: A.leche, alt: "Hirviendo leche", secondary: A.vapor };
      }
      if (/\b(escaldar|escalda|tomate)\b/.test(text)) {
        return { src: A.tomate, alt: "Escaldando tomates", secondary: A.vapor };
      }
      if (/\b(infusion|infusión|té|te )\b/.test(text)) {
        return { src: A.tetera, alt: "Infusionando", secondary: A.vapor };
      }
      if (/\b(pescado|marisco|caldo de pescado)\b/.test(text)) {
        return { src: A.pescado, alt: "Cociendo pescado", secondary: A.vapor };
      }
      // vapor (aguas termales) + fuego = olla hirviendo, NO sopa ramen
      return { src: A.vapor, alt: "Hirviendo", secondary: A.fuego };
    }

    case "cortar": {
      if (/\b(pan|rebanada|torrija|miga|telera)\b/.test(text)) {
        return { src: A.pan, alt: "Cortando pan", secondary: A.zanahoria };
      }
      if (/\b(bacon|panceta|tocino)\b/.test(text)) {
        return { src: A.bacon, alt: "Cortando bacon", secondary: A.pollo };
      }
      if (
        /\b(carne|medallón|medallon|solomillo|lomo|choto|filete|jamón|jamon|pollo|cerdo|ternera)\b/.test(
          text,
        )
      ) {
        return { src: A.pollo, alt: "Cortando carne", secondary: A.zanahoria };
      }
      if (/\b(tomate|tomates)\b/.test(text)) {
        return { src: A.tomate, alt: "Cortando tomate", secondary: A.pimiento };
      }
      if (/\b(cebolla|chalota)\b/.test(text)) {
        return { src: A.cebolla, alt: "Cortando cebolla", secondary: A.ajo };
      }
      if (/\b(ajo|ajos)\b/.test(text)) {
        return { src: A.ajo, alt: "Picando ajo", secondary: A.cebolla };
      }
      if (/\b(patata|papa)\b/.test(text)) {
        return { src: A.patata, alt: "Cortando patata", secondary: A.zanahoria };
      }
      if (/\b(pimiento)\b/.test(text)) {
        return { src: A.pimiento, alt: "Cortando pimiento", secondary: A.cebolla };
      }
      if (/\b(aguacate)\b/.test(text)) {
        return { src: A.aguacate, alt: "Cortando aguacate" };
      }
      if (/\b(champiñón|champiñon|seta)\b/.test(text)) {
        return { src: A.champiñon, alt: "Cortando setas", secondary: A.hierba };
      }
      if (/\b(queso)\b/.test(text)) {
        return { src: A.queso, alt: "Cortando queso", secondary: A.pan };
      }
      if (/\b(pescado|filete de)\b/.test(text)) {
        return { src: A.pescado, alt: "Cortando pescado" };
      }
      if (/\b(lechuga|ensalada|verdura|verduras|hortaliza)\b/.test(text)) {
        return { src: A.hoja, alt: "Cortando verdura", secondary: A.tomate };
      }
      return { src: A.zanahoria, alt: "Cortando ingredientes", secondary: A.cebolla };
    }

    case "fruta": {
      if (/\b(uva|uvas)\b/.test(text)) return { src: A.uvas, alt: "Preparando uvas" };
      if (/\b(manzana)\b/.test(text)) return { src: A.manzana, alt: "Preparando manzana" };
      if (/\b(sandía|sandia)\b/.test(text)) return { src: A.sandia, alt: "Preparando sandía" };
      if (/\b(limón|limon)\b/.test(text)) return { src: A.limon, alt: "Preparando limón" };
      if (/\b(fresa|fresas)\b/.test(text)) return { src: A.fresa, alt: "Preparando fresas" };
      if (/\b(aguacate)\b/.test(text)) return { src: A.aguacate, alt: "Preparando aguacate" };
      return { src: A.naranja, alt: "Preparando fruta", secondary: A.manzana };
    }

    case "rebozar": {
      if (/\b(azúcar|azucar|canela|miel)\b/.test(text)) {
        return { src: A.galleta, alt: "Rebozando en azúcar", secondary: A.sal };
      }
      if (/\b(pan rallado|empanar|empan)\b/.test(text)) {
        return { src: A.pan, alt: "Empanando", secondary: A.mano };
      }
      if (/\b(harina|enharin)\b/.test(text)) {
        return { src: A.sal, alt: "Enharinando", secondary: A.pan };
      }
      // Huevo batido: emoji de huevo en sartén (Noto cooking) + pan — no líquido oscuro
      if (/\b(huevo|batido)\b/.test(text)) {
        return { src: A.freir, alt: "Pasando por huevo", secondary: A.pan };
      }
      return { src: A.pan, alt: "Rebozando", secondary: A.mano };
    }

    case "freir": {
      if (/\b(bacon|panceta)\b/.test(text)) {
        return { src: A.bacon, alt: "Fritura de bacon", secondary: A.fuego };
      }
      if (/\b(pescado|boquerón|boqueron|puntill|calamar|ortigu)\b/.test(text)) {
        return { src: A.pescado, alt: "Fritura de pescado", secondary: A.fuego };
      }
      if (/\b(pan|torrija|rebanada)\b/.test(text)) {
        return { src: A.freir, alt: "Fritura", secondary: A.pan };
      }
      return { src: A.freir, alt: "Fritura en la sartén", secondary: A.fuego };
    }

    case "mezclar": {
      if (/\b(harina|masa|crepe)\b/.test(text)) {
        return { src: A.pan, alt: "Mezclando masa", secondary: A.verter };
      }
      if (/\b(tomate|gazpacho)\b/.test(text)) {
        return { src: A.tomate, alt: "Mezclando", secondary: A.verter };
      }
      return { src: A.verter, alt: "Mezclando", secondary: A.sal };
    }

    case "preparar": {
      if (/\b(pescado|marisco|sardina|boquerón|almeja)\b/.test(text)) {
        return { src: A.pescado, alt: "Preparando", secondary: A.mano };
      }
      if (/\b(carne|jamón|jamon|pringá|pringa)\b/.test(text)) {
        return { src: A.pollo, alt: "Preparando", secondary: A.mano };
      }
      return { src: A.mano, alt: "Mise en place", secondary: A.plato };
    }

    case "sofrito": {
      if (/\b(ajo|ajillo)\b/.test(text)) {
        return { src: A.ajo, alt: "Sofriendo ajo", secondary: A.fuego };
      }
      if (/\b(cebolla)\b/.test(text)) {
        return { src: A.cebolla, alt: "Pochando cebolla", secondary: A.fuego };
      }
      return { src: A.tomate, alt: "Sofriendo", secondary: A.fuego };
    }

    case "triturar": {
      if (/\b(tomate|gazpacho|salmorejo|porra)\b/.test(text)) {
        return { src: A.tomate, alt: "Triturando", secondary: A.verter };
      }
      if (/\b(aguacate)\b/.test(text)) {
        return { src: A.aguacate, alt: "Triturando aguacate", secondary: A.gota };
      }
      return { src: A.verter, alt: "Triturando y mezclando", secondary: A.gota };
    }

    case "amasar": {
      if (/\b(galleta|cookie|polvorón|polvoron)\b/.test(text)) {
        return { src: A.galleta, alt: "Preparando masa dulce" };
      }
      if (/\b(pretzel|rosca)\b/.test(text)) {
        return { src: A.pretzel, alt: "Formando masa" };
      }
      return { src: A.pan, alt: "Amasando", secondary: A.pretzel };
    }

    case "hornear": {
      if (/\b(pastel|tarta|bizcocho|cumpleaños)\b/.test(text)) {
        return { src: A.pastel, alt: "Horneando pastel", secondary: A.fuego };
      }
      if (/\b(galleta|cookie|mantecado|polvorón)\b/.test(text)) {
        return { src: A.galleta, alt: "Horneando galletas", secondary: A.fuego };
      }
      if (/\b(pan|hogaza)\b/.test(text)) {
        return { src: A.pan, alt: "Horneando pan", secondary: A.fuego };
      }
      return { src: A.galleta, alt: "Al horno", secondary: A.fuego };
    }

    case "enfriar": {
      if (/\b(helado|hielo)\b/.test(text)) {
        return { src: A.nieve, alt: "Enfriando", secondary: A.frio };
      }
      return { src: A.nieve, alt: "Enfriando", secondary: A.gota };
    }

    case "aliñar": {
      if (/\b(sal|sazonar)\b/.test(text)) {
        return { src: A.sal, alt: "Sazonando", secondary: A.verter };
      }
      if (/\b(ensalada)\b/.test(text)) {
        return { src: A.ensalada, alt: "Aliñando ensalada", secondary: A.verter };
      }
      return { src: A.verter, alt: "Aliñando", secondary: A.ensalada };
    }

    case "empapar": {
      const L = liquid;
      if (L === "miel" || /\b(almíbar|almibar|miel|sirope)\b/.test(text)) {
        return { src: A.pan, alt: "Empapando en miel", secondary: A.verter };
      }
      if (L === "tomate" || /\b(tomate|tomates|jugo)\b/.test(text)) {
        return { src: A.pan, alt: "Remojando pan en tomate", secondary: A.tomate };
      }
      if (L === "agua" || (/\b(agua)\b/.test(text) && L !== "leche")) {
        return { src: A.pan, alt: "Remojando en agua", secondary: A.gota };
      }
      if (L === "leche" || /\b(leche|lácteo|lacteo)\b/.test(text)) {
        return { src: A.pan, alt: "Empapando en leche", secondary: A.leche };
      }
      if (/\b(pan|rebanada|miga|telera)\b/.test(text)) {
        return { src: A.pan, alt: "Remojando pan", secondary: A.gota };
      }
      return { src: A.pan, alt: "Empapando", secondary: A.gota };
    }

    case "servir": {
      if (/\b(ensalada)\b/.test(text)) {
        return { src: A.ensalada, alt: "Sirviendo ensalada", secondary: A.plato };
      }
      return { src: A.plato, alt: "Listo para servir", secondary: A.ensalada };
    }

    case "cocinar":
    default:
      return { src: A.mano, alt: "Cocinando", secondary: A.plato };
  }
}
