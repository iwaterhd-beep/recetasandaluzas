import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { RecipeSearch } from "@/components/recetas/recipe-search";
import { getAllSearchDocs } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Recetas andaluzas",
  description:
    "Busca entre gazpachos, tapas, guisos, pescados y postres andaluces. Filtra por provincia, tiempo e ingredientes.",
  path: "/recetas",
  keywords: ["buscar recetas andaluzas", "recetario andalucía", "tapas", "guisos"],
});

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function RecetasPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const docs = getAllSearchDocs();

  return (
    <div className="bg-background">
      <div className="container-app app-screen">
        <header>
          <h1 className="app-screen__title">Explorar</h1>
          <p className="app-screen__lead">
            Busca por nombre o ingrediente.
          </p>
        </header>

        <div className="no-print mt-5">
          <AdSlot position="banner" />
        </div>

        <div className="mt-5 md:mt-8">
          <RecipeSearch docs={docs} initialQuery={q?.trim() ?? ""} />
        </div>
      </div>
    </div>
  );
}
