import type { Ingrediente, Paso, UnidadIngrediente } from "@/types/receta";

export function ing(
  id: string,
  nombre: string,
  cantidadBase: number,
  unidad: UnidadIngrediente,
  notas?: string,
): Ingrediente {
  return notas
    ? { id, nombre, cantidadBase, unidad, notas }
    : { id, nombre, cantidadBase, unidad };
}

export function paso(
  numero: number,
  titulo: string,
  descripcion: string,
  opts?: { tiempoSegundos?: number; consejo?: string },
): Paso {
  return {
    numero,
    titulo,
    descripcion,
    ...(opts?.tiempoSegundos != null ? { tiempoSegundos: opts.tiempoSegundos } : {}),
    ...(opts?.consejo ? { consejo: opts.consejo } : {}),
  };
}

export const IMG = "/images/placeholder-receta.svg";
