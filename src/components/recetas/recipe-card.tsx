"use client";

import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RecipeImage } from "@/components/recetas/recipe-image";
import { categoriaLabel } from "@/lib/constants";
import { springSnappy } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import type { RecetaResumen } from "@/types/receta";

interface RecipeCardProps {
  receta: RecetaResumen;
  index?: number;
  badge?: string;
}

export function RecipeCard({ receta, index = 0, badge }: RecipeCardProps) {
  const favoritos = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const esFav = favoritos.includes(receta.id);
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        delay: reduce ? 0 : Math.min(index * 0.035, 0.28),
      }}
      className="group h-full"
    >
      <Link href={`/recetas/${receta.id}`} className="recipe-card-tm">
        <div className="recipe-card-tm__media">
          <RecipeImage
            src={receta.imagen}
            alt={`${receta.nombre} — receta andaluza de ${receta.provincia}`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorito(receta.id);
            }}
            className="absolute right-2 top-2 grid size-11 place-items-center rounded-full bg-white text-foreground shadow-[var(--shadow-soft)]"
            aria-label={esFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            aria-pressed={esFav}
            whileTap={reduce ? undefined : { scale: 0.88 }}
            animate={esFav && !reduce ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={springSnappy}
          >
            <Heart
              className={`size-4 ${esFav ? "fill-tomate text-tomate" : "text-muted-foreground"}`}
            />
          </motion.button>
          {badge && (
            <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-foreground shadow-sm">
              {badge}
            </span>
          )}
        </div>
        <div className="recipe-card-tm__body">
          <h3 className="recipe-card-tm__title">{receta.nombre}</h3>
          <p className="recipe-card-tm__meta">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-muted-foreground" aria-hidden />
              {receta.tiempoTotal} min
            </span>
            <span aria-hidden>·</span>
            <span className="capitalize">{receta.dificultad}</span>
            <span aria-hidden>·</span>
            <span>
              {badge ? receta.provincia : categoriaLabel(receta.categoria)}
            </span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
