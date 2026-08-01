import type { Metadata } from "next";
import { PROVINCIA_INTROS } from "@/data/provincias-copy";
import { PROVINCIAS, provinciaFromSlug } from "@/lib/constants";
import { getAllSearchDocs, getRecetasByProvincia } from "@/lib/data";
import { RecipeSearch } from "@/components/recetas/recipe-search";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, buildPageMetadata, collectionPageJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROVINCIAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nombre = provinciaFromSlug(slug);
  if (!nombre) return { title: "Provincia" };
  const intro = PROVINCIA_INTROS[nombre];
  return buildPageMetadata({
    title: `Comida típica de ${nombre} | Recetas andaluzas`,
    description:
      intro?.lead ??
      `Platos tradicionales de la provincia de ${nombre}: tapas, guisos y dulces andaluces con recetas paso a paso.`,
    path: `/provincia/${slug}`,
    keywords: intro?.keywords ?? [
      `recetas ${nombre}`,
      "cocina andaluza",
      `comida típica ${nombre}`,
    ],
  });
}

export default async function ProvinciaPage({ params }: Props) {
  const { slug } = await params;
  const nombre = provinciaFromSlug(slug);
  if (!nombre) notFound();

  const recetas = getRecetasByProvincia(nombre);
  const docs = getAllSearchDocs();
  const intro = PROVINCIA_INTROS[nombre];

  return (
    <div className="container-app py-[var(--section-y)]">
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: `Comida típica de ${nombre}`,
            description: intro?.cuerpo ?? `Platos típicos de ${nombre}`,
            path: `/provincia/${slug}`,
            recipes: recetas,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Provincias", path: "/provincias" },
            { name: nombre, path: `/provincia/${slug}` },
          ]),
        ]}
      />

      <p className="section-label">Provincia</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">
        Comida típica de {nombre}
      </h1>
      <p className="section-lead">{intro?.lead}</p>
      {intro && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {intro.cuerpo}
        </p>
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        {recetas.length} recetas de la provincia listas para cocinar.
      </p>

      <div className="mt-8">
        <RecipeSearch docs={docs} initialProvincia={nombre} />
      </div>
    </div>
  );
}
