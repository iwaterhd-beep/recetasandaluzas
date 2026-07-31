import type { Receta, RecetaResumen } from "@/types/receta";

/** Tiempo total de una receta en minutos */
export function tiempoTotal(receta: Pick<Receta, "tiempoPreparacion" | "tiempoCoccion">): number {
  return receta.tiempoPreparacion + receta.tiempoCoccion;
}

/** Convierte una receta completa a resumen para listados */
export function toResumen(receta: Receta): RecetaResumen {
  return {
    id: receta.id,
    nombre: receta.nombre,
    provincia: receta.provincia,
    categoria: receta.categoria,
    dificultad: receta.dificultad,
    tiempoTotal: tiempoTotal(receta),
    valoracion: receta.valoracion,
    numValoraciones: receta.numValoraciones,
    imagen: receta.imagenes[0] ?? "/images/placeholder-receta.svg",
    descripcion: receta.descripcion,
  };
}

/**
 * Escala una cantidad de ingrediente según raciones elegidas.
 * Devuelve número (puede ser fraccionario) — formatear con formatCantidad.
 */
export function escalarCantidad(
  cantidadBase: number,
  racionesBase: number,
  racionesElegidas: number,
): number {
  if (racionesBase <= 0) return cantidadBase;
  return (cantidadBase * racionesElegidas) / racionesBase;
}

const FRACCIONES: { valor: number; texto: string }[] = [
  { valor: 0.125, texto: "⅛" },
  { valor: 0.25, texto: "¼" },
  { valor: 0.333, texto: "⅓" },
  { valor: 0.5, texto: "½" },
  { valor: 0.666, texto: "⅔" },
  { valor: 0.75, texto: "¾" },
];

/**
 * Formatea cantidades de cocina de forma legible.
 * Unidades enteras (huevos, dientes) se redondean; el resto admite fracciones Unicode.
 */
export function formatCantidad(
  cantidad: number,
  unidad: string,
  opciones?: { enteroForzado?: boolean },
): string {
  if (unidad === "al gusto" || unidad === "pizca") {
    return "";
  }

  const forzarEntero =
    opciones?.enteroForzado ||
    unidad === "unidad" ||
    unidad === "diente";

  if (forzarEntero) {
    const redondeado = Math.max(1, Math.round(cantidad));
    return String(redondeado);
  }

  if (cantidad < 0.01) return "0";

  const entero = Math.floor(cantidad);
  const decimal = cantidad - entero;

  if (decimal < 0.08) {
    return String(entero || 0);
  }

  if (decimal > 0.92) {
    return String(entero + 1);
  }

  let mejor = FRACCIONES[0];
  let mejorDiff = Math.abs(decimal - mejor.valor);
  for (const f of FRACCIONES) {
    const diff = Math.abs(decimal - f.valor);
    if (diff < mejorDiff) {
      mejor = f;
      mejorDiff = diff;
    }
  }

  if (mejorDiff > 0.08) {
    // No encaja bien en fracción → 1 decimal
    return cantidad.toFixed(1).replace(/\.0$/, "");
  }

  if (entero === 0) return mejor.texto;
  return `${entero} ${mejor.texto}`;
}

export function formatUnidad(unidad: string, cantidad: number): string {
  if (unidad === "al gusto") return "al gusto";
  if (unidad === "pizca") return cantidad > 1 ? "pizcas" : "pizca";
  if (unidad === "cucharada") return cantidad === 1 ? "cucharada" : "cucharadas";
  if (unidad === "cucharadita")
    return cantidad === 1 ? "cucharadita" : "cucharaditas";
  if (unidad === "diente") return cantidad === 1 ? "diente" : "dientes";
  if (unidad === "unidad") return "";
  return unidad;
}

export function formatIngredienteLinea(
  nombre: string,
  cantidad: number,
  unidad: string,
  notas?: string,
): string {
  if (unidad === "al gusto") {
    return notas ? `${nombre} al gusto (${notas})` : `${nombre} al gusto`;
  }

  const cant = formatCantidad(cantidad, unidad);
  const uni = formatUnidad(unidad, cantidad);
  const base = [cant, uni, nombre].filter(Boolean).join(" ");
  return notas ? `${base} (${notas})` : base;
}
