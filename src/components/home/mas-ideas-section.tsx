"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChefHat, Clock, Heart, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RecipeImage } from "@/components/recetas/recipe-image";
import { Reveal } from "@/components/ui/reveal";
import { categoriaLabel } from "@/lib/constants";
import { springSnappy } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import type { Categoria, RecetaResumen } from "@/types/receta";

type IdeaFilter =
  | "todas"
  | "rapidas"
  | "tapas"
  | "guisos"
  | "pescados"
  | "postres"
  | "sopas-frias";

const FILTERS: {
  id: IdeaFilter;
  label: string;
  lead: string;
  href: string;
  cta: string;
}[] = [
  {
    id: "todas",
    label: "Todas",
    lead: "Selección del recetario para seguir explorando Andalucía.",
    href: "/recetas",
    cta: "Ver todas las recetas",
  },
  {
    id: "rapidas",
    label: "Rápidas",
    lead: "Platos en 35 minutos o menos: ideal entre semana.",
    href: "/recetas",
    cta: "Explorar recetario",
  },
  {
    id: "tapas",
    label: "Tapas",
    lead: "De barra y de mesa: freiduría, montaditos y clásicos para picar.",
    href: "/categoria/tapas",
    cta: "Ver todas las tapas",
  },
  {
    id: "guisos",
    label: "Guisos",
    lead: "Olla lenta, caldo y cuchara: pucheros, berzas y estofados.",
    href: "/categoria/guisos",
    cta: "Ver todos los guisos",
  },
  {
    id: "pescados",
    label: "Pescados",
    lead: "De la costa: fritura, marinera y pescados a la plancha.",
    href: "/categoria/pescados",
    cta: "Ver todos los pescados",
  },
  {
    id: "postres",
    label: "Postres",
    lead: "Dulces de convento, Semana Santa y sobremesa andaluza.",
    href: "/categoria/postres",
    cta: "Ver todos los postres",
  },
  {
    id: "sopas-frias",
    label: "Sopas frías",
    lead: "Gazpacho, salmorejo, ajoblanco y cremas de verano.",
    href: "/categoria/sopas-frias",
    cta: "Ver sopas frías",
  },
];

const LIMIT = 10;

function matchesFilter(r: RecetaResumen, filter: IdeaFilter): boolean {
  if (filter === "todas") return true;
  if (filter === "rapidas") {
    return r.tiempoTotal <= 35 && r.dificultad !== "difícil";
  }
  return r.categoria === (filter as Categoria);
}

function sortIdeas(list: RecetaResumen[]): RecetaResumen[] {
  return [...list].sort(
    (a, b) =>
      b.valoracion - a.valoracion ||
      b.numValoraciones - a.numValoraciones ||
      a.tiempoTotal - b.tiempoTotal,
  );
}

interface MasIdeasSectionProps {
  recetas: RecetaResumen[];
}

export function MasIdeasSection({ recetas }: MasIdeasSectionProps) {
  const [filter, setFilter] = useState<IdeaFilter>("todas");
  const favoritos = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const map = new Map<IdeaFilter, number>();
    for (const f of FILTERS) {
      map.set(f.id, recetas.filter((r) => matchesFilter(r, f.id)).length);
    }
    return map;
  }, [recetas]);

  const activeMeta = FILTERS.find((f) => f.id === filter) ?? FILTERS[0]!;

  const filtered = useMemo(
    () => sortIdeas(recetas.filter((r) => matchesFilter(r, filter))),
    [filter, recetas],
  );

  const visible = filtered.slice(0, LIMIT);
  const remaining = Math.max(0, filtered.length - visible.length);
  const totalInFilter = filtered.length;

  return (
    <section className="mas-ideas" aria-labelledby="mas-ideas-title">
      <div className="container-app">
        <Reveal>
          <div className="mas-ideas__intro">
            <p className="section-label">Explora el recetario</p>
            <div className="mas-ideas__title-row">
              <h2
                id="mas-ideas-title"
                className="app-screen__title !text-[length:var(--text-xl)]"
              >
                Más ideas
              </h2>
              <Link href="/recetas" className="mas-ideas__all">
                Explorar
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <p className="app-screen__lead">
              Filtra por estilo de cocina y abre fichas completas con pasos y modo cocina.
            </p>
          </div>
        </Reveal>

        <div
          className="mas-ideas__filters"
          role="tablist"
          aria-label="Filtrar ideas"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            const n = counts.get(f.id) ?? 0;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`mas-ideas__chip${active ? " is-active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span className="mas-ideas__chip-count">{n}</span>
              </button>
            );
          })}
        </div>

        <div className="mas-ideas__panel" role="tabpanel">
          <div className="mas-ideas__panel-head">
            <div>
              <p className="mas-ideas__panel-title">
                {activeMeta.label}
                <span className="mas-ideas__panel-count">
                  {totalInFilter} receta{totalInFilter === 1 ? "" : "s"}
                </span>
              </p>
              <p className="mas-ideas__panel-lead">{activeMeta.lead}</p>
            </div>
            <Link href={activeMeta.href} className="mas-ideas__panel-link">
              {activeMeta.cta}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={filter}
              className="mas-ideas__list"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
            >
              {visible.length === 0 ? (
                <li className="mas-ideas__empty">
                  No hay recetas en este filtro. Prueba otra categoría.
                </li>
              ) : (
                visible.map((receta, index) => {
                  const esFav = favoritos.includes(receta.id);
                  return (
                    <li key={receta.id}>
                      <motion.article
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: reduce ? 0 : Math.min(index * 0.03, 0.24),
                        }}
                        className="group"
                      >
                        <Link
                          href={`/recetas/${receta.id}`}
                          className="idea-card"
                        >
                          <div className="idea-card__media">
                            <RecipeImage
                              src={receta.imagen}
                              alt={`${receta.nombre} — receta andaluza de ${receta.provincia}`}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                              sizes="(max-width: 768px) 34vw, 220px"
                            />
                          </div>
                          <div className="idea-card__body">
                            <div className="idea-card__top">
                              <span className="idea-card__cat">
                                {categoriaLabel(receta.categoria)}
                              </span>
                              <motion.button
                                type="button"
                                className="idea-card__fav"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorito(receta.id);
                                }}
                                aria-label={
                                  esFav
                                    ? "Quitar de favoritos"
                                    : "Añadir a favoritos"
                                }
                                aria-pressed={esFav}
                                whileTap={reduce ? undefined : { scale: 0.88 }}
                                transition={springSnappy}
                              >
                                <Heart
                                  className={`size-4 ${esFav ? "fill-tomate text-tomate" : ""}`}
                                />
                              </motion.button>
                            </div>
                            <h3 className="idea-card__title">{receta.nombre}</h3>
                            <p className="idea-card__desc">{receta.descripcion}</p>
                            <p className="idea-card__meta">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3.5" aria-hidden />
                                {receta.tiempoTotal} min
                              </span>
                              <span aria-hidden>·</span>
                              <span className="inline-flex items-center gap-1 capitalize">
                                <ChefHat className="size-3.5" aria-hidden />
                                {receta.dificultad}
                              </span>
                              <span aria-hidden>·</span>
                              <span className="inline-flex items-center gap-1">
                                <Star
                                  className="size-3.5 fill-current text-olivo"
                                  aria-hidden
                                />
                                {receta.valoracion.toFixed(1)}
                              </span>
                              <span aria-hidden>·</span>
                              <span>{receta.provincia}</span>
                            </p>
                          </div>
                        </Link>
                      </motion.article>
                    </li>
                  );
                })
              )}
            </motion.ul>
          </AnimatePresence>

          {(remaining > 0 || totalInFilter > 0) && (
            <div className="mas-ideas__footer">
              {remaining > 0 ? (
                <p className="mas-ideas__more">
                  +{remaining} más en este filtro
                </p>
              ) : null}
              <Link href={activeMeta.href} className="btn btn-secondary min-h-11">
                {activeMeta.cta}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
