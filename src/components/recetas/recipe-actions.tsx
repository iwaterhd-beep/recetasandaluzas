"use client";

import { useState } from "react";
import {
  Check,
  Heart,
  Printer,
  Share2,
  ShoppingBasket,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Toast } from "@/components/ui/toast";
import { escalarCantidad } from "@/lib/recetas";
import { springSnappy } from "@/lib/motion";
import { useAppStore } from "@/stores/app-store";
import type { Receta } from "@/types/receta";

interface RecipeActionsProps {
  receta: Receta;
  raciones: number;
}

export function RecipeActions({ receta, raciones }: RecipeActionsProps) {
  const favoritos = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const anadirALista = useAppStore((s) => s.anadirALista);
  const [toast, setToast] = useState(false);
  const reduce = useReducedMotion();
  const esFav = favoritos.includes(receta.id);

  const addToList = () => {
    const items = receta.ingredientes
      .filter((i) => i.unidad !== "al gusto")
      .map((i) => ({
        id: `${receta.id}-${i.id}`,
        nombre: i.nombre,
        cantidad: escalarCantidad(i.cantidadBase, receta.raciones, raciones),
        unidad: i.unidad,
        notas: i.notas,
      }));
    anadirALista(items, receta.id);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = {
      title: receta.nombre,
      text: `${receta.nombre} — receta andaluza de ${receta.provincia}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(url);
        setToast(true);
        setTimeout(() => setToast(false), 2200);
      }
    } catch {
      /* cancelado */
    }
  };

  return (
    <>
      <div className="no-print flex flex-wrap gap-2">
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={addToList}
          whileTap={reduce ? undefined : { scale: 0.97 }}
        >
          {toast ? <Check className="size-4" /> : <ShoppingBasket className="size-4" />}
          Lista de la compra
        </motion.button>

        <motion.button
          type="button"
          className="btn btn-secondary"
          onClick={() => toggleFavorito(receta.id)}
          aria-pressed={esFav}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          animate={esFav && !reduce ? { scale: [1, 1.06, 1] } : {}}
          transition={springSnappy}
        >
          <Heart className={`size-4 ${esFav ? "fill-accent text-accent" : ""}`} />
          {esFav ? "En favoritos" : "Favorito"}
        </motion.button>

        <button type="button" className="btn btn-secondary" onClick={() => void share()}>
          <Share2 className="size-4" />
          Compartir
        </button>

        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
          <Printer className="size-4" />
          Imprimir
        </button>
      </div>

      <Toast show={toast} message="Añadido a la lista de la compra" />
    </>
  );
}
