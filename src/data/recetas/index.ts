import type { Receta } from "@/types/receta";
import { guisos } from "./guisos";
import { pescadosArrocesPostres } from "./pescados-arroces-postres";
import { sopasEnsaladas } from "./sopas-ensaladas";
import { tapas } from "./tapas";

/**
 * Índice único de recetas (contenido estático tipado).
 * Equivale al esquema JSON del brief; se mantiene en TS para validación en build.
 */
export const recetasIndex: Receta[] = [
  ...sopasEnsaladas,
  ...tapas,
  ...guisos,
  ...pescadosArrocesPostres,
];

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
