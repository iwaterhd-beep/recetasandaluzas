"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Search, X } from "lucide-react";
import { RecipeImage } from "@/components/recetas/recipe-image";
import { recetasIndex } from "@/data/recetas";
import { sugerenciasBusqueda, toSearchDoc } from "@/lib/search";

const CATALOG = recetasIndex.map(toSearchDoc);

type Variant = "header" | "sheet" | "hero";

interface RecipeSearchBoxProps {
  variant?: Variant;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function RecipeSearchBox({
  variant = "header",
  placeholder = "Buscar recetas…",
  className = "",
  autoFocus = false,
  onNavigate,
}: RecipeSearchBoxProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = useMemo(
    () => sugerenciasBusqueda(CATALOG, q, variant === "hero" ? 6 : 8),
    [q, variant],
  );

  useEffect(() => {
    setActive(-1);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const goCatalog = (query = q) => {
    const trimmed = query.trim();
    setOpen(false);
    onNavigate?.();
    router.push(trimmed ? `/recetas?q=${encodeURIComponent(trimmed)}` : "/recetas");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) {
      setOpen(false);
      onNavigate?.();
      router.push(`/recetas/${suggestions[active]!.id}`);
      return;
    }
    goCatalog();
  };

  const showList = open && q.trim().length > 0;

  return (
    <div
      ref={rootRef}
      className={`recipe-live-search recipe-live-search--${variant} ${className}`}
    >
      <form
        onSubmit={onSubmit}
        className={
          variant === "hero"
            ? "recipe-live-search__hero-form"
            : "search-pill recipe-live-search__form"
        }
        role="search"
      >
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-label="Buscar recetas"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showList}
          role="combobox"
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showList || suggestions.length === 0) {
              if (e.key === "Escape") setOpen(false);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
            } else if (e.key === "Escape") {
              setOpen(false);
              setActive(-1);
            }
          }}
        />
        {q && (
          <button
            type="button"
            className="recipe-live-search__clear"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setQ("");
              setActive(-1);
              setOpen(false);
            }}
          >
            <X className="size-3.5" />
          </button>
        )}
        {variant === "hero" && (
          <button type="submit" className="btn btn-primary min-h-11 rounded-full px-5">
            Buscar
          </button>
        )}
      </form>

      {showList && (
        <div
          id={listId}
          className="recipe-live-search__panel"
          role="listbox"
          aria-label="Recetas encontradas"
        >
          {suggestions.length === 0 ? (
            <p className="recipe-live-search__empty">
              No hay recetas con «{q.trim()}»
            </p>
          ) : (
            <ul className="recipe-live-search__list">
              {suggestions.map((s, i) => (
                <li key={s.id} role="option" aria-selected={i === active}>
                  <Link
                    href={`/recetas/${s.id}`}
                    className={`recipe-live-search__item${i === active ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                  >
                    <span className="recipe-live-search__thumb">
                      <RecipeImage
                        src={s.imagen}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <span className="recipe-live-search__meta">
                      <span className="recipe-live-search__name">{s.nombre}</span>
                      <span className="recipe-live-search__sub">
                        {s.provincia} · {s.tiempoTotal} min
                      </span>
                    </span>
                    <span className="recipe-live-search__rating">
                      ★ {s.valoracion.toFixed(1)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="recipe-live-search__all"
            onClick={() => goCatalog()}
          >
            Ver todos los resultados
            {q.trim() ? ` de «${q.trim()}»` : ""}
          </button>
        </div>
      )}
    </div>
  );
}
