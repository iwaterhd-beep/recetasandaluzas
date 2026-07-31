"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart } from "lucide-react";
import { RecipeCard } from "@/components/recetas/recipe-card";
import { getAllResumenes } from "@/lib/data";
import { useAppStore } from "@/stores/app-store";

export default function FavoritosClient() {
  const favoritos = useAppStore((s) => s.favoritos);
  const all = useMemo(() => getAllResumenes(), []);
  const lista = all.filter((r) => favoritos.includes(r.id));

  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Tu cocina</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Favoritos</h1>
      <p className="section-lead">
        {lista.length
          ? `${lista.length} receta${lista.length === 1 ? "" : "s"} guardada${lista.length === 1 ? "" : "s"} en este dispositivo.`
          : "Aún no has guardado ninguna receta."}
      </p>

      {lista.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
          <Heart className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-muted-foreground">
            Pulsa el corazón en cualquier receta para tenerla siempre a mano.
          </p>
          <Link href="/recetas" className="btn btn-primary mt-6">
            Explorar recetas
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((r, i) => (
            <li key={r.id}>
              <RecipeCard receta={r} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
