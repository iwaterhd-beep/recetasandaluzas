import type { Receta } from "@/types/receta";
import { ampliacionRecetas } from "./ampliacion";
import { extraRecetas } from "./extra";
import { guisos } from "./guisos";
import { pescadosArrocesPostres } from "./pescados-arroces-postres";
import { sopasEnsaladas } from "./sopas-ensaladas";
import { tapas } from "./tapas";

/** Ruta WebP local (Commons → scripts/fetch-recipe-images.mjs). */
export function recetaImagePath(id: string): string {
  return `/images/recetas/${id}.webp`;
}

/**
 * Índice único de recetas (contenido estático tipado).
 * Equivale al esquema JSON del brief; se mantiene en TS para validación en build.
 * Las imágenes se resuelven por id hacia public/images/recetas/{id}.webp.
 */
export const recetasIndex: Receta[] = [
  ...sopasEnsaladas,
  ...tapas,
  ...guisos,
  ...pescadosArrocesPostres,
  ...extraRecetas,
  ...ampliacionRecetas,
].map((r) => ({
  ...r,
  imagenes: [recetaImagePath(r.id)],
}));


export function assertRecetasUnicas(recetas: Receta[] = recetasIndex): void {
  const ids = new Set<string>();
  for (const r of recetas) {
    if (ids.has(r.id)) {
      throw new Error(`ID de receta duplicado: ${r.id}`);
    }
    ids.add(r.id);
  }
}

assertRecetasUnicas();
