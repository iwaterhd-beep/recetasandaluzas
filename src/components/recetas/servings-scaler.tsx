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
  const [checked, setChecked] = useState<Record<string, boolean>>({});

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

  const done = lineas.filter((l) => checked[l.id]).length;

  return (
    <div className="app-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="section-title mt-0 text-xl">Ingredientes</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {done > 0 ? `${done}/${lineas.length} listos · ` : ""}
            Desde {racionesBase} raciones base
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-surface-muted/80 p-1">
          <button
            type="button"
            className="btn btn-ghost size-11 min-h-0 rounded-full p-0"
            onClick={() => set(raciones - 1)}
            aria-label="Menos raciones"
            disabled={raciones <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span
            className="min-w-[4.5rem] text-center font-display text-lg font-semibold tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {raciones}
          </span>
          <button
            type="button"
            className="btn btn-ghost size-11 min-h-0 rounded-full p-0"
            onClick={() => set(raciones + 1)}
            aria-label="Más raciones"
            disabled={raciones >= 20}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <ul className="mt-2">
        {lineas.map((l) => {
          const on = Boolean(checked[l.id]);
          return (
            <li key={l.id}>
              <label className={`ing-check ${on ? "is-checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    setChecked((prev) => ({ ...prev, [l.id]: !prev[l.id] }))
                  }
                />
                <span>{l.texto}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
