"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { RecipeCard } from "@/components/recetas/recipe-card";
import { RecipeGridSkeleton } from "@/components/ui/skeleton";
import {
  CATEGORIAS,
  DIFICULTADES,
  PROVINCIAS,
  TIEMPO_FILTROS,
} from "@/lib/constants";
import {
  buscarRecetas,
  catalogoIngredientes,
  sugerenciasBusqueda,
  type OrdenBusqueda,
  type RecetaSearchDoc,
} from "@/lib/search";
import Link from "next/link";

interface RecipeSearchProps {
  docs: RecetaSearchDoc[];
  initialCategoria?: string;
  initialProvincia?: string;
  initialQuery?: string;
}

export function RecipeSearch({
  docs,
  initialCategoria,
  initialProvincia,
  initialQuery = "",
}: RecipeSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [provincia, setProvincia] = useState(initialProvincia ?? "");
  const [categoria, setCategoria] = useState(initialCategoria ?? "");
  const [dificultad, setDificultad] = useState("");
  const [tiempoId, setTiempoId] = useState("");
  const [valoracionMin, setValoracionMin] = useState(0);
  const [orden, setOrden] = useState<OrdenBusqueda>("valoracion");
  const [despensa, setDespensa] = useState<string[]>([]);
  const [despensaInput, setDespensaInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const deferredQuery = useDeferredValue(query);
  const ingredientes = useMemo(() => catalogoIngredientes(docs), [docs]);

  const tiempoFiltro = TIEMPO_FILTROS.find((t) => t.id === tiempoId);

  const resultados = useMemo(
    () =>
      buscarRecetas(docs, {
        query: deferredQuery,
        provincia: provincia || undefined,
        categoria: categoria || undefined,
        dificultad: dificultad || undefined,
        tiempoMin: tiempoFiltro && "min" in tiempoFiltro ? tiempoFiltro.min : undefined,
        tiempoMax: tiempoFiltro && "max" in tiempoFiltro ? tiempoFiltro.max : undefined,
        valoracionMin: valoracionMin || undefined,
        orden,
        ingredientesTengo: despensa.length ? despensa : undefined,
      }),
    [
      docs,
      deferredQuery,
      provincia,
      categoria,
      dificultad,
      tiempoFiltro,
      valoracionMin,
      orden,
      despensa,
    ],
  );

  const sugerencias = useMemo(
    () => sugerenciasBusqueda(docs, query, 6),
    [docs, query],
  );

  const despensaSugeridas = useMemo(() => {
    const q = despensaInput.trim().toLowerCase();
    if (!q) return [];
    return ingredientes
      .filter((i) => i.toLowerCase().includes(q) && !despensa.includes(i))
      .slice(0, 8);
  }, [despensaInput, ingredientes, despensa]);

  const clearFilters = () => {
    setQuery("");
    setProvincia(initialProvincia ?? "");
    setCategoria(initialCategoria ?? "");
    setDificultad("");
    setTiempoId("");
    setValoracionMin(0);
    setOrden("valoracion");
    setDespensa([]);
  };

  return (
    <div>
      {/* Search bar Spotlight-style */}
      <div className="relative">
        <label htmlFor="buscador-recetas" className="sr-only">
          Buscar recetas
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="buscador-recetas"
          type="search"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setShowSuggest(true);
            startTransition(() => {
              setQuery(v);
              if (v.trim()) setOrden("relevancia");
            });
          }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          placeholder="Busca por nombre, ingrediente, provincia…"
          className="w-full rounded-full border border-border-strong bg-surface py-3.5 pr-12 pl-11 text-base shadow-[var(--shadow-soft)] outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setQuery("")}
            aria-label="Limpiar búsqueda"
          >
            <X className="size-4" />
          </button>
        )}

        {showSuggest && query.trim() && sugerencias.length > 0 && (
          <ul
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-lift)]"
            role="listbox"
          >
            {sugerencias.map((s) => (
              <li key={s.id} role="option">
                <Link
                  href={`/recetas/${s.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-surface-muted"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span>
                    <span className="font-semibold text-foreground">{s.nombre}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {s.provincia} · {s.tiempoTotal} min
                    </span>
                  </span>
                  <span className="text-xs text-aceite">★ {s.valoracion.toFixed(1)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chips categoría one-tap (Explore) */}
      {!initialCategoria && (
        <ul className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="shrink-0">
            <button
              type="button"
              className={`meta-chip min-h-9 px-3.5 ${!categoria ? "meta-chip--accent" : ""}`}
              onClick={() => setCategoria("")}
            >
              Todas
            </button>
          </li>
          {CATEGORIAS.map((c) => (
            <li key={c.slug} className="shrink-0">
              <button
                type="button"
                className={`meta-chip min-h-9 px-3.5 ${
                  categoria === c.slug ? "meta-chip--accent" : ""
                }`}
                onClick={() =>
                  setCategoria((prev) => (prev === c.slug ? "" : c.slug))
                }
              >
                {c.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="size-4" />
          Filtros
        </button>

        <label className="sr-only" htmlFor="orden">
          Ordenar
        </label>
        <select
          id="orden"
          value={orden}
          onChange={(e) => setOrden(e.target.value as OrdenBusqueda)}
          className="rounded-full border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="relevancia">Relevancia</option>
          <option value="valoracion">Valoración</option>
          <option value="tiempo">Tiempo</option>
          <option value="recientes">Más recientes</option>
        </select>

        <span className="ml-auto text-sm text-muted-foreground">
          {resultados.length} resultado{resultados.length === 1 ? "" : "s"}
        </span>
      </div>

      {showFilters && (
        <div className="app-card mt-4 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Provincia">
            <select
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              className="field-select"
            >
              <option value="">Todas</option>
              {PROVINCIAS.map((p) => (
                <option key={p.slug} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Categoría">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="field-select"
            >
              <option value="">Todas</option>
              {CATEGORIAS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Dificultad">
            <select
              value={dificultad}
              onChange={(e) => setDificultad(e.target.value)}
              className="field-select"
            >
              <option value="">Cualquiera</option>
              {DIFICULTADES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tiempo">
            <select
              value={tiempoId}
              onChange={(e) => setTiempoId(e.target.value)}
              className="field-select"
            >
              <option value="">Cualquiera</option>
              {TIEMPO_FILTROS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Valoración mínima">
            <select
              value={valoracionMin}
              onChange={(e) => setValoracionMin(Number(e.target.value))}
              className="field-select"
            >
              <option value={0}>Cualquiera</option>
              <option value={4}>★ 4+</option>
              <option value={4.5}>★ 4.5+</option>
              <option value={4.8}>★ 4.8+</option>
            </select>
          </Field>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Qué puedo cocinar con…
            </p>
            <div className="relative">
              <input
                type="text"
                value={despensaInput}
                onChange={(e) => setDespensaInput(e.target.value)}
                placeholder="Escribe un ingrediente (tomate, ajo, pan…)"
                className="field-select w-full"
              />
              {despensaSugeridas.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-surface shadow-md">
                  {despensaSugeridas.map((ing) => (
                    <li key={ing}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                        onClick={() => {
                          setDespensa((d) => [...d, ing]);
                          setDespensaInput("");
                          setOrden("relevancia");
                        }}
                      >
                        {ing}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {despensa.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {despensa.map((ing) => (
                  <li key={ing}>
                    <button
                      type="button"
                      className="chip gap-1.5 border-primary/40 text-primary"
                      onClick={() => setDespensa((d) => d.filter((x) => x !== ing))}
                    >
                      {ing}
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <button type="button" className="btn btn-ghost" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {!mounted ? (
        <div className="mt-8">
          <RecipeGridSkeleton />
        </div>
      ) : resultados.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No hay recetas con esos criterios. Prueba a quitar filtros o cambiar la búsqueda.
        </p>
      ) : (
        <ul
          className={`explore-grid mt-8 ${isPending ? "opacity-70" : ""} transition-opacity duration-200`}
        >
          {resultados.map((r, i) => (
            <li key={r.id}>
              <RecipeCard receta={r} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {label}
      <span className="mt-1.5 block font-normal normal-case">{children}</span>
    </label>
  );
}
