"use client";

import Link from "next/link";
import { Printer, Trash2 } from "lucide-react";
import {
  formatCantidad,
  formatUnidad,
} from "@/lib/recetas";
import { useAppStore } from "@/stores/app-store";

export default function ListaCompraClient() {
  const lista = useAppStore((s) => s.listaCompra);
  const toggle = useAppStore((s) => s.toggleItemCompra);
  const eliminar = useAppStore((s) => s.eliminarItemCompra);
  const limpiar = useAppStore((s) => s.limpiarListaCompra);
  const limpiarMarcados = useAppStore((s) => s.limpiarMarcados);

  const pendientes = lista.filter((i) => !i.marcado).length;

  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Mercado</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Lista de la compra</h1>
      <p className="section-lead">
        {lista.length
          ? `${pendientes} pendiente${pendientes === 1 ? "" : "s"} de ${lista.length} ítems.`
          : "Añade ingredientes desde cualquier ficha de receta."}
      </p>

      {lista.length > 0 && (
        <div className="no-print mt-6 flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
            <Printer className="size-4" />
            Imprimir
          </button>
          <button type="button" className="btn btn-ghost" onClick={limpiarMarcados}>
            Quitar marcados
          </button>
          <button type="button" className="btn btn-ghost text-accent" onClick={limpiar}>
            <Trash2 className="size-4" />
            Vaciar lista
          </button>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted-foreground">
            Tu lista está vacía. Abre una receta y pulsa «Lista de la compra».
          </p>
          <Link href="/recetas" className="btn btn-primary mt-6">
            Ver recetas
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {lista.map((item) => {
            const cant = formatCantidad(item.cantidad, item.unidad);
            const uni = formatUnidad(item.unidad, item.cantidad);
            return (
              <li
                key={item.id}
                className={`flex items-start gap-3 py-3.5 ${item.marcado ? "opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={item.marcado}
                  onChange={() => toggle(item.id)}
                  className="mt-1 size-4 accent-[var(--primary)]"
                  aria-label={`Marcar ${item.nombre}`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${item.marcado ? "line-through" : ""}`}
                  >
                    {[cant, uni, item.nombre].filter(Boolean).join(" ")}
                    {item.notas ? (
                      <span className="font-normal text-muted-foreground"> ({item.notas})</span>
                    ) : null}
                  </p>
                  {item.origenRecetas.length > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      De {item.origenRecetas.length} receta
                      {item.origenRecetas.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="no-print btn btn-ghost size-9 min-h-0 p-0"
                  onClick={() => eliminar(item.id)}
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
