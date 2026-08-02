import type { Receta, RecetaResumen } from "@/types/receta";
import { toResumen } from "@/lib/recetas";
import Fuse from "fuse.js";

export type OrdenBusqueda = "relevancia" | "valoracion" | "tiempo" | "recientes";

export interface RecetaSearchDoc extends RecetaResumen {
  ingredientes: string[];
  etiquetas: string[];
  publicadaEn?: string;
}

export interface FiltrosBusqueda {
  query?: string;
  provincia?: string;
  categoria?: string;
  dificultad?: string;
  tiempoMax?: number;
  tiempoMin?: number;
  valoracionMin?: number;
  orden?: OrdenBusqueda;
  /** Ingredientes que el usuario tiene (búsqueda por despensa) */
  ingredientesTengo?: string[];
}

export function toSearchDoc(receta: Receta): RecetaSearchDoc {
  return {
    ...toResumen(receta),
    ingredientes: receta.ingredientes.map((i) => i.nombre),
    etiquetas: receta.etiquetasSEO,
    publicadaEn: receta.publicadaEn,
  };
}

let fuse: Fuse<RecetaSearchDoc> | null = null;

function getFuse(items: RecetaSearchDoc[]) {
  if (!fuse) {
    fuse = new Fuse(items, {
      keys: [
        { name: "nombre", weight: 0.4 },
        { name: "ingredientes", weight: 0.25 },
        { name: "etiquetas", weight: 0.15 },
        { name: "descripcion", weight: 0.1 },
        { name: "provincia", weight: 0.05 },
        { name: "categoria", weight: 0.05 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 1,
    });
  } else {
    fuse.setCollection(items);
  }
  return fuse;
}

export function resetSearchIndex() {
  fuse = null;
}

export function sugerenciasBusqueda(
  items: RecetaSearchDoc[],
  query: string,
  limite = 6,
): RecetaSearchDoc[] {
  const q = query.trim();
  if (!q) return [];

  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");

  const nq = norm(q);

  /** Prioriza coincidencias por nombre mientras se escribe. */
  const byName = items
    .map((item) => {
      const n = norm(item.nombre);
      let score = 0;
      if (n.startsWith(nq)) score = 4;
      else if (n.split(/[\s\-]+/).some((w) => w.startsWith(nq))) score = 3;
      else if (n.includes(nq)) score = 2;
      else if (norm(item.provincia).startsWith(nq)) score = 1;
      else if (item.ingredientes.some((i) => norm(i).includes(nq))) score = 1;
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.item.valoracion - a.item.valoracion ||
        a.item.nombre.localeCompare(b.item.nombre, "es"),
    );

  if (byName.length >= limite || q.length <= 2) {
    return byName.slice(0, limite).map((x) => x.item);
  }

  const seen = new Set(byName.map((x) => x.item.id));
  const merged = byName.map((x) => x.item);
  for (const hit of getFuse(items).search(q)) {
    if (seen.has(hit.item.id)) continue;
    merged.push(hit.item);
    seen.add(hit.item.id);
    if (merged.length >= limite) break;
  }
  return merged.slice(0, limite);
}

function scorePorDespensa(doc: RecetaSearchDoc, tengo: string[]): number {
  if (!tengo.length) return 0;
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");
  const pool = tengo.map(norm);
  let hits = 0;
  for (const ing of doc.ingredientes) {
    const n = norm(ing);
    if (pool.some((t) => n.includes(t) || t.includes(n))) hits += 1;
  }
  return hits;
}

export function buscarRecetas(
  items: RecetaSearchDoc[],
  filtros: FiltrosBusqueda,
): RecetaSearchDoc[] {
  let resultados: RecetaSearchDoc[] = items;
  const scores = new Map<string, number>();

  if (filtros.query?.trim()) {
    const hits = getFuse(items).search(filtros.query.trim());
    resultados = hits.map((h) => {
      scores.set(h.item.id, 1 - (h.score ?? 0));
      return h.item;
    });
  }

  if (filtros.ingredientesTengo?.length) {
    resultados = resultados
      .map((r) => {
        const s = scorePorDespensa(r, filtros.ingredientesTengo!);
        scores.set(r.id, (scores.get(r.id) ?? 0) + s);
        return { r, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);
  }

  if (filtros.provincia) {
    resultados = resultados.filter((r) => r.provincia === filtros.provincia);
  }
  if (filtros.categoria) {
    resultados = resultados.filter((r) => r.categoria === filtros.categoria);
  }
  if (filtros.dificultad) {
    resultados = resultados.filter((r) => r.dificultad === filtros.dificultad);
  }
  if (filtros.tiempoMax != null) {
    resultados = resultados.filter((r) => r.tiempoTotal < filtros.tiempoMax!);
  }
  if (filtros.tiempoMin != null) {
    resultados = resultados.filter((r) => r.tiempoTotal >= filtros.tiempoMin!);
  }
  if (filtros.valoracionMin != null) {
    resultados = resultados.filter((r) => r.valoracion >= filtros.valoracionMin!);
  }

  const orden =
    filtros.orden ??
    (filtros.query || filtros.ingredientesTengo?.length ? "relevancia" : "valoracion");

  if (orden === "relevancia") {
    resultados = [...resultados].sort(
      (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0),
    );
  } else if (orden === "valoracion") {
    resultados = [...resultados].sort(
      (a, b) => b.valoracion - a.valoracion || b.numValoraciones - a.numValoraciones,
    );
  } else if (orden === "tiempo") {
    resultados = [...resultados].sort((a, b) => a.tiempoTotal - b.tiempoTotal);
  } else if (orden === "recientes") {
    resultados = [...resultados].sort((a, b) =>
      (b.publicadaEn ?? "").localeCompare(a.publicadaEn ?? ""),
    );
  }

  return resultados;
}

/** Lista plana de ingredientes únicos para el buscador por despensa */
export function catalogoIngredientes(items: RecetaSearchDoc[]): string[] {
  const set = new Set<string>();
  for (const r of items) {
    for (const i of r.ingredientes) set.add(i);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}
