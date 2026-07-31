"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Stars } from "@/components/recetas/stars";
import { categoriaLabel } from "@/lib/constants";
import { springSnappy } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import type { RecetaResumen } from "@/types/receta";

interface RecipeCardProps {
  receta: RecetaResumen;
  index?: number;
}

export function RecipeCard({ receta, index = 0 }: RecipeCardProps) {
  const favoritos = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const esFav = favoritos.includes(receta.id);
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(index * 0.045, 0.36) }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-transparent transition-shadow hover:shadow-[var(--shadow-soft)]"
    >
      <Link
        href={`/recetas/${receta.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-muted"
      >
        <Image
          src={receta.imagen}
          alt={`${receta.nombre} — receta andaluza de ${receta.provincia}`}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute bottom-2 left-2 rounded-sm bg-azul-ceramica-deep/85 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
          {receta.provincia}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{categoriaLabel(receta.categoria)}</p>
            <Link href={`/recetas/${receta.id}`}>
              <h3 className="font-display text-lg font-semibold leading-snug text-azul-ceramica-deep transition-colors group-hover:text-primary dark:text-azul-claro">
                {receta.nombre}
              </h3>
            </Link>
          </div>
          <motion.button
            type="button"
            onClick={() => toggleFavorito(receta.id)}
            className="btn btn-ghost size-9 min-h-0 shrink-0 p-0"
            aria-label={esFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            aria-pressed={esFav}
            whileTap={reduce ? undefined : { scale: 0.85 }}
            animate={esFav && !reduce ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={springSnappy}
          >
            <Heart
              className={`size-4 transition-colors duration-200 ${
                esFav ? "fill-accent text-accent" : ""
              }`}
            />
          </motion.button>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{receta.descripcion}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {receta.tiempoTotal} min
          </span>
          <span className="capitalize">{receta.dificultad}</span>
          <Stars value={receta.valoracion} />
        </div>
      </div>
    </motion.article>
  );
}
