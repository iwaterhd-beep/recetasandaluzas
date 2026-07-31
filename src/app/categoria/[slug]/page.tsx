import type { Metadata } from "next";
import { CATEGORIAS } from "@/lib/constants";
import { getAllSearchDocs, getRecetasByCategoria } from "@/lib/data";
import type { Categoria } from "@/types/receta";
import { RecipeSearch } from "@/components/recetas/recipe-search";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, buildPageMetadata, collectionPageJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIAS.find((c) => c.slug === slug);
  if (!cat) return { title: "Categoría" };
  return buildPageMetadata({
    title: `Recetas de ${cat.nombre.toLowerCase()} andaluzas`,
    description: `${cat.descripcion} Recetas tradicionales con pasos claros y modo cocina.`,
    path: `/categoria/${cat.slug}`,
    keywords: [cat.nombre, "recetas andaluzas", "cocina andaluza"],
  });
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIAS.find((c) => c.slug === slug);
  if (!cat) notFound();

  const recetas = getRecetasByCategoria(slug as Categoria);
  const docs = getAllSearchDocs();

  return (
    <div className="container-app py-[var(--section-y)]">
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: cat.nombre,
            description: cat.descripcion,
            path: `/categoria/${cat.slug}`,
            recipes: recetas,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Categorías", path: "/categorias" },
            { name: cat.nombre, path: `/categoria/${cat.slug}` },
          ]),
        ]}
      />

      <p className="section-label">Categoría</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">{cat.nombre}</h1>
      <p className="section-lead">{cat.descripcion}</p>
      <p className="mt-2 text-sm text-muted-foreground">{recetas.length} recetas en esta categoría</p>

      <div className="mt-8">
        <RecipeSearch docs={docs} initialCategoria={slug} />
      </div>
    </div>
  );
}
