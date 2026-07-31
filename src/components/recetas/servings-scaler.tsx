"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  escalarCantidad,
  formatIngredienteLinea,
} from "@/lib/recetas";
import type { Ingrediente } from "@/types/receta";

interface ServingsScalerProps {
  racionesBase: number;
  ingredientes: Ingrediente[];
  onRacionesChange?: (raciones: number) => void;
}

export function ServingsScaler({
  racionesBase,
  ingredientes,
  onRacionesChange,
}: ServingsScalerProps) {
  const [raciones, setRaciones] = useState(racionesBase);

  const set = (n: number) => {
    const next = Math.min(20, Math.max(1, n));
    setRaciones(next);
    onRacionesChange?.(next);
  };

  const lineas = useMemo(
    () =>
      ingredientes.map((i) => ({
        id: i.id,
        texto: formatIngredienteLinea(
          i.nombre,
          escalarCantidad(i.cantidadBase, racionesBase, raciones),
          i.unidad,
          i.notas,
        ),
      })),
    [ingredientes, racionesBase, raciones],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Ingredientes</h2>
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-muted/60 p-1">
          <button
            type="button"
            className="btn btn-ghost size-10 min-h-0 p-0"
            onClick={() => set(raciones - 1)}
            aria-label="Menos raciones"
            disabled={raciones <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span
            className="min-w-[5.5rem] text-center text-sm font-semibold tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {raciones} ración{raciones === 1 ? "" : "es"}
          </span>
          <button
            type="button"
            className="btn btn-ghost size-10 min-h-0 p-0"
            onClick={() => set(raciones + 1)}
            aria-label="Más raciones"
            disabled={raciones >= 20}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Cantidades recalculadas desde {racionesBase} raciones base.
      </p>
      <ul className="mt-4 space-y-2">
        {lineas.map((l) => (
          <li key={l.id} className="border-b border-border py-2.5 text-sm">
            {l.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}
