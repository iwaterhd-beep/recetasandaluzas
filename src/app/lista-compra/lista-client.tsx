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
    <div className="container-app app-screen">
      <h1 className="app-screen__title">Lista</h1>
      <p className="app-screen__lead">
        {lista.length
          ? `${pendientes} pendiente${pendientes === 1 ? "" : "s"} de ${lista.length}.`
          : "Añade ingredientes desde cualquier receta."}
      </p>

      {lista.length > 0 && (
        <div className="no-print mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary min-h-11" onClick={() => window.print()}>
            <Printer className="size-4" />
            Imprimir
          </button>
          <button type="button" className="btn btn-ghost min-h-11" onClick={limpiarMarcados}>
            Quitar marcados
          </button>
          <button type="button" className="btn btn-ghost min-h-11 text-accent" onClick={limpiar}>
            <Trash2 className="size-4" />
            Vaciar
          </button>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="app-card mt-8 border-dashed px-6 py-12 text-center shadow-none">
          <p className="text-muted-foreground">
            Tu lista está vacía. Abre una receta y pulsa «Lista de la compra».
          </p>
          <Link href="/recetas" className="btn btn-primary mt-6">
            Ver recetas
          </Link>
        </div>
      ) : (
        <ul className="app-card mt-8 divide-y divide-border px-4">
          {lista.map((item) => {
            const cant = formatCantidad(item.cantidad, item.unidad);
            const uni = formatUnidad(item.unidad, item.cantidad);
            return (
              <li
                key={item.id}
                className={`ing-check ${item.marcado ? "is-checked" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={item.marcado}
                  onChange={() => toggle(item.id)}
                  aria-label={`Marcar ${item.nombre}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {[cant, uni, item.nombre].filter(Boolean).join(" ")}
                    {item.notas ? (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        ({item.notas})
                      </span>
                    ) : null}
                  </p>
                  {item.origenRecetas.length > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground no-underline">
                      De {item.origenRecetas.length} receta
                      {item.origenRecetas.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="no-print btn btn-ghost size-9 min-h-0 shrink-0 p-0"
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
