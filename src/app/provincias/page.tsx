import type { Metadata } from "next";
import { PROVINCIAS } from "@/lib/constants";
import { getAllRecetas } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Recetas por provincia de Andalucía",
  description:
    "Comida típica de las 8 provincias andaluzas: Sevilla, Córdoba, Cádiz, Málaga, Granada, Huelva, Jaén y Almería. Recetas paso a paso.",
  path: "/provincias",
  keywords: [
    "comida típica Andalucía",
    "recetas por provincia",
    "qué comer en Sevilla",
    "comida de Cádiz",
  ],
});

export default function ProvinciasIndexPage() {
  return (
    <div className="bg-background">
      <div className="container-app app-screen">
        <h1 className="app-screen__title">Provincias</h1>
        <p className="app-screen__lead">Ocho despensas andaluzas.</p>

        <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:gap-3">
          {PROVINCIAS.map((p) => {
            const n = getAllRecetas().filter((r) => r.provincia === p.nombre)
              .length;
            return (
              <li key={p.slug}>
                <Link
                  href={`/provincia/${p.slug}`}
                  className="app-card flex min-h-[5.5rem] flex-col items-center justify-center gap-1 px-3 py-5 text-center transition active:scale-[0.98]"
                >
                  <span className="font-sans text-base font-bold text-foreground">
                    {p.nombre}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {n} recetas
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
