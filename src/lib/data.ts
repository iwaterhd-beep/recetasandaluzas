import type { Receta } from "@/types/receta";
import { toResumen } from "@/lib/recetas";
import type { Categoria, Provincia } from "@/types/receta";
import { recetasIndex } from "@/data/recetas";
import { toSearchDoc, type RecetaSearchDoc } from "@/lib/search";

export function getAllRecetas(): Receta[] {
  return recetasIndex;
}

export function getRecetaById(id: string): Receta | undefined {
  return recetasIndex.find((r) => r.id === id);
}

export function getRecetasByProvincia(provincia: Provincia): Receta[] {
  return recetasIndex.filter((r) => r.provincia === provincia);
}

export function getRecetasByCategoria(categoria: Categoria): Receta[] {
  return recetasIndex.filter((r) => r.categoria === categoria);
}

export function getAllRecetaIds(): string[] {
  return recetasIndex.map((r) => r.id);
}

export function getRecetasRelacionadas(receta: Receta, limite = 4): Receta[] {
  const mismoIngredienteIds = new Set(
    receta.ingredientes.slice(0, 3).map((i) => i.nombre.toLowerCase()),
  );

  return recetasIndex
    .filter((r) => r.id !== receta.id)
    .map((r) => {
      let score = 0;
      if (r.provincia === receta.provincia) score += 3;
      if (r.categoria === receta.categoria) score += 2;
      for (const ing of r.ingredientes) {
        if (mismoIngredienteIds.has(ing.nombre.toLowerCase())) score += 1;
      }
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((x) => x.r);
}

export function getAllResumenes() {
  return getAllRecetas().map(toResumen);
}

export function getAllSearchDocs(): RecetaSearchDoc[] {
  return getAllRecetas().map(toSearchDoc);
}
