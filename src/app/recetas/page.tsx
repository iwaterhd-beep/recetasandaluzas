import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { getAllSearchDocs } from "@/lib/data";
import { RecipeSearch } from "@/components/recetas/recipe-search";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Buscador de recetas andaluzas",
  description:
    "Busca recetas de cocina andaluza por nombre, ingrediente, provincia o dificultad. Gazpacho, tapas, guisos y postres.",
  path: "/recetas",
  keywords: ["buscar recetas andaluzas", "recetas por ingredientes", "cocina andaluza"],
});

export default function RecetasPage() {
  const docs = getAllSearchDocs();

  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Recetario</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Todas las recetas</h1>
      <p className="section-lead">
        Busca por nombre o ingrediente, filtra por provincia y tiempo, o dime qué tienes en la
        nevera.
      </p>

      <div className="no-print mt-6">
        <AdSlot position="banner" />
      </div>

      <div className="mt-8">
        <RecipeSearch docs={docs} />
      </div>
    </div>
  );
}
