import type { Metadata } from "next";
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
  return buildPageMetadata({
    title: `Recetas típicas de ${nombre}`,
    description: `Platos tradicionales de la provincia de ${nombre}: tapas, guisos y dulces andaluces con recetas paso a paso.`,
    path: `/provincia/${slug}`,
    keywords: [`recetas ${nombre}`, "cocina andaluza", `comida típica ${nombre}`],
  });
}

export default async function ProvinciaPage({ params }: Props) {
  const { slug } = await params;
  const nombre = provinciaFromSlug(slug);
  if (!nombre) notFound();

  const recetas = getRecetasByProvincia(nombre);
  const docs = getAllSearchDocs();

  return (
    <div className="container-app py-[var(--section-y)]">
      <JsonLd
        data={[
          collectionPageJsonLd({
            name: `Recetas de ${nombre}`,
            description: `Platos típicos de ${nombre}`,
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
      <h1 className="section-title text-[length:var(--text-3xl)]">Recetas de {nombre}</h1>
      <p className="section-lead">
        {recetas.length} platos típicos de la provincia de {nombre}.
      </p>

      <div className="mt-8">
        <RecipeSearch docs={docs} initialProvincia={nombre} />
      </div>
    </div>
  );
}
