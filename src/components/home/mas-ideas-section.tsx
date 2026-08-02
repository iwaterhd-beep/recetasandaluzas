"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Heart, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RecipeImage } from "@/components/recetas/recipe-image";
import { Reveal } from "@/components/ui/reveal";
import { categoriaLabel } from "@/lib/constants";
import { springSnappy } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import type { Categoria } from "@/types/receta";
import type { RecetaResumen } from "@/types/receta";

type IdeaFilter = "todas" | "rapidas" | "tapas" | "guisos" | "postres" | "pescados";

const FILTERS: { id: IdeaFilter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "rapidas", label: "Rápidas" },
  { id: "tapas", label: "Tapas" },
  { id: "guisos", label: "Guisos" },
  { id: "pescados", label: "Pescados" },
  { id: "postres", label: "Postres" },
];

function matchesFilter(r: RecetaResumen, filter: IdeaFilter): boolean {
  if (filter === "todas") return true;
  if (filter === "rapidas") return r.tiempoTotal <= 35;
  return r.categoria === (filter as Categoria);
}

interface MasIdeasSectionProps {
  recetas: RecetaResumen[];
}

export function MasIdeasSection({ recetas }: MasIdeasSectionProps) {
  const [filter, setFilter] = useState<IdeaFilter>("todas");
  const favoritos = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const reduce = useReducedMotion();

  const visible = useMemo(() => {
    const filtered = recetas.filter((r) => matchesFilter(r, filter));
    return filtered.length > 0 ? filtered : recetas.slice(0, 6);
  }, [filter, recetas]);

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
              Clásicos de barra, guisos de cuchara y dulces para otro día.
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
              </button>
            );
          })}
        </div>

        <ul className="mas-ideas__list">
          {visible.map((receta, index) => {
            const esFav = favoritos.includes(receta.id);
            return (
              <li key={receta.id}>
                <motion.article
                  layout
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: reduce ? 0 : Math.min(index * 0.03, 0.2),
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
                            esFav ? "Quitar de favoritos" : "Añadir a favoritos"
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
          })}
        </ul>
      </div>
    </section>
  );
}
