import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllArticuloSlugs,
  getArticulo,
} from "@/data/blog/articulos";
import { getRecetaById } from "@/lib/data";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticuloSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articulo = getArticulo(slug);
  if (!articulo) return { title: "Artículo no encontrado" };
  return buildPageMetadata({
    title: articulo.titulo,
    description: articulo.descripcion,
    path: `/blog/${articulo.slug}`,
    type: "article",
    keywords: articulo.etiquetas,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const articulo = getArticulo(slug);
  if (!articulo) notFound();

  const relacionadas = articulo.recetasRelacionadas
    .map((id) => getRecetaById(id))
    .filter(Boolean);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.descripcion,
    datePublished: articulo.publicadaEn,
    inLanguage: "es-ES",
    author: {
      "@type": "Organization",
      name: "Recetas Andaluzas",
    },
    mainEntityOfPage: absoluteUrl(`/blog/${articulo.slug}`),
  };

  return (
    <article className="container-app py-[var(--section-y)]">
      <JsonLd
        data={[
          articleLd,
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: articulo.titulo, path: `/blog/${articulo.slug}` },
          ]),
        ]}
      />

      <nav aria-label="Migas de pan" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground line-clamp-1">{articulo.titulo}</li>
        </ol>
      </nav>

      <p className="section-label mt-6">Blog</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">{articulo.titulo}</h1>
      <time
        dateTime={articulo.publicadaEn}
        className="mt-2 block text-sm text-muted-foreground"
      >
        {new Date(articulo.publicadaEn).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-foreground/90">
        {articulo.contenido.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {relacionadas.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl font-semibold">Recetas para cocinar</h2>
          <ul className="mt-4 divide-y divide-border">
            {relacionadas.map(
              (r) =>
                r && (
                  <li key={r.id}>
                    <Link href={`/recetas/${r.id}`} className="link-row">
                      <span className="link-row-title">{r.nombre}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {r.provincia} · {r.tiempoPreparacion + r.tiempoCoccion} min
                      </span>
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </section>
      )}
    </article>
  );
}
