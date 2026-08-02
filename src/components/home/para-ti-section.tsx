"use client";

import Link from "next/link";
import { ArrowRight, ChefHat, Clock, Heart, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RecipeImage } from "@/components/recetas/recipe-image";
import { Reveal } from "@/components/ui/reveal";
import { springSnappy } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import type { RecetaResumen } from "@/types/receta";

interface ParaTiSectionProps {
  recetas: RecetaResumen[];
}

export function ParaTiSection({ recetas }: ParaTiSectionProps) {
  const favoritos = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const reduce = useReducedMotion();

  return (
    <section className="para-ti" aria-labelledby="para-ti-title">
      <div className="container-app para-ti__head">
        <Reveal>
          <div className="para-ti__intro">
            <p className="section-label">Hoy en la cocina</p>
            <div className="para-ti__title-row">
              <h2 id="para-ti-title" className="app-screen__title !text-[length:var(--text-xl)]">
                Para ti
              </h2>
              <Link href="/recetas" className="para-ti__all">
                Ver todas
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <p className="app-screen__lead">
              Ideas fáciles y bien valoradas para ponerte al fuego ya.
            </p>
          </div>
        </Reveal>
      </div>

      <ul className="para-ti__rail" aria-label="Recetas recomendadas para ti">
        {recetas.map((receta, index) => {
          const esFav = favoritos.includes(receta.id);
          const lead = index === 0;
          return (
            <li
              key={receta.id}
              className={`para-ti__item${lead ? " para-ti__item--lead" : ""}`}
            >
              <motion.article
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: reduce ? 0 : Math.min(index * 0.04, 0.28),
                }}
                className="group h-full"
              >
                <Link
                  href={`/recetas/${receta.id}`}
                  className={`para-ti-card${lead ? " para-ti-card--lead" : ""}`}
                >
                  <div className="para-ti-card__media">
                    <RecipeImage
                      src={receta.imagen}
                      alt={`${receta.nombre} — receta andaluza de ${receta.provincia}`}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      sizes={
                        lead
                          ? "(max-width: 768px) 78vw, 22rem"
                          : "(max-width: 768px) 68vw, 15rem"
                      }
                      priority={index < 2}
                    />
                    <div className="para-ti-card__shade" aria-hidden />
                    <div className="para-ti-card__chips">
                      <span className="para-ti-card__chip">
                        <Clock className="size-3.5" aria-hidden />
                        {receta.tiempoTotal} min
                      </span>
                      <span className="para-ti-card__chip para-ti-card__chip--rating">
                        <Star className="size-3.5 fill-current" aria-hidden />
                        {receta.valoracion.toFixed(1)}
                      </span>
                    </div>
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorito(receta.id);
                      }}
                      className="para-ti-card__fav"
                      aria-label={
                        esFav ? "Quitar de favoritos" : "Añadir a favoritos"
                      }
                      aria-pressed={esFav}
                      whileTap={reduce ? undefined : { scale: 0.88 }}
                      animate={
                        esFav && !reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }
                      }
                      transition={springSnappy}
                    >
                      <Heart
                        className={`size-4 ${esFav ? "fill-tomate text-tomate" : "text-muted-foreground"}`}
                      />
                    </motion.button>
                  </div>
                  <div className="para-ti-card__body">
                    <p className="para-ti-card__place">{receta.provincia}</p>
                    <h3 className="para-ti-card__title">{receta.nombre}</h3>
                    <p className="para-ti-card__cta">
                      <ChefHat className="size-3.5" aria-hidden />
                      Empezar a cocinar
                    </p>
                  </div>
                </Link>
              </motion.article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
