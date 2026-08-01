"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { RecipeActions } from "@/components/recetas/recipe-actions";
import { ServingsScaler } from "@/components/recetas/servings-scaler";
import { AdSlot } from "@/components/ads/ad-slot";
import type { Receta } from "@/types/receta";

interface RecipeInteractiveProps {
  receta: Receta;
}

export function RecipeInteractive({ receta }: RecipeInteractiveProps) {
  const [raciones, setRaciones] = useState(receta.raciones);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <RecipeActions receta={receta} raciones={raciones} />
      </div>

      <div className="sticky-cook-cta no-print">
        <Link
          href={`/recetas/${receta.id}/cocinar`}
          className="btn btn-primary"
        >
          <ChefHat className="size-5" />
          Empezar a cocinar
        </Link>
      </div>

      <section className="mt-8">
        <ServingsScaler
          racionesBase={receta.raciones}
          ingredientes={receta.ingredientes}
          onRacionesChange={setRaciones}
        />
      </section>

      <div className="no-print my-8">
        <AdSlot position="in-article" />
      </div>

      {receta.informacionNutricional && (
        <section className="app-card mt-2 p-5">
          <h2 className="section-title mt-0 text-xl">
            Información nutricional
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Valores aproximados por ración (base {receta.raciones} raciones).
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["Calorías", receta.informacionNutricional.calorias, "kcal"],
                ["Proteínas", receta.informacionNutricional.proteinas, "g"],
                ["Grasas", receta.informacionNutricional.grasas, "g"],
                ["Carbos", receta.informacionNutricional.carbohidratos, "g"],
              ] as const
            ).map(([label, value, unit]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-display text-xl font-semibold tabular-nums">
                  {value}
                  <span className="ml-0.5 text-sm font-sans font-normal text-muted-foreground">
                    {unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
