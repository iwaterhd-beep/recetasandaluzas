import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { RecipeInteractive } from "@/components/recetas/recipe-interactive";
import { Stars } from "@/components/recetas/stars";
import { JsonLd } from "@/components/seo/json-ld";
import { categoriaLabel, provinciaSlug } from "@/lib/constants";
import {
  getAllRecetaIds,
  getRecetaById,
  getRecetasRelacionadas,
} from "@/lib/data";
import { tiempoTotal } from "@/lib/recetas";
import {
  breadcrumbJsonLd,
  recipeJsonLd,
  recipeMetadata,
} from "@/lib/seo";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllRecetaIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const receta = getRecetaById(id);
  if (!receta) return { title: "Receta no encontrada" };
  return recipeMetadata(receta);
}

export default async function RecetaPage({ params }: Props) {
  const { id } = await params;
  const receta = getRecetaById(id);
  if (!receta) notFound();

  const relacionadas = getRecetasRelacionadas(receta, 4);
  const total = tiempoTotal(receta);
  const imagen = receta.imagenes[0] ?? "/images/placeholder-receta.svg";
  const altImagen = `${receta.nombre} de ${receta.provincia}, cocina andaluza casera`;

  return (
    <article>
      <JsonLd
        data={[
          recipeJsonLd(receta),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Recetas", path: "/recetas" },
            {
              name: categoriaLabel(receta.categoria),
              path: `/categoria/${receta.categoria}`,
            },
            { name: receta.nombre, path: `/recetas/${receta.id}` },
          ]),
        ]}
      />

      <nav aria-label="Migas de pan" className="container-app pt-6 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/categoria/${receta.categoria}`} className="hover:text-primary">
              {categoriaLabel(receta.categoria)}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/provincia/${provinciaSlug(receta.provincia)}`}
              className="hover:text-primary"
            >
              {receta.provincia}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{receta.nombre}</li>
        </ol>
      </nav>

      <div className="relative isolate overflow-hidden border-b border-border">
        <div className="azulejo absolute inset-0 opacity-40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-azul-ceramica-deep/90 to-background"
          aria-hidden
        />
        <div className="container-app relative grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-end md:py-16">
          <div>
            <p className="section-label text-azul-mist">
              {receta.provincia} · {categoriaLabel(receta.categoria)}
            </p>
            <h1 className="mt-2 font-display text-[length:var(--text-3xl)] font-semibold text-white">
              {receta.nombre}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-azul-mist">
              {receta.descripcion}
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              <div>
                <dt className="inline opacity-70">Tiempo · </dt>
                <dd className="inline font-medium">{total} min</dd>
              </div>
              <div>
                <dt className="inline opacity-70">Dificultad · </dt>
                <dd className="inline font-medium capitalize">{receta.dificultad}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <Stars value={receta.valoracion} className="[&_span]:text-aceite" />
                <span className="text-white/70">({receta.numValoraciones})</span>
              </div>
            </dl>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/15 shadow-[var(--shadow-lift)]">
            <Image
              src={imagen}
              alt={altImagen}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>

      <div className="container-app py-[var(--section-y)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            <RecipeInteractive receta={receta} />

            <section className="mt-12">
              <h2 className="font-display text-2xl font-semibold">Historia</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {receta.historia}
              </p>
            </section>

            <div className="no-print my-10 lg:hidden">
              <AdSlot position="in-article" />
            </div>

            <section className="mt-12">
              <h2 className="font-display text-2xl font-semibold">Preparación</h2>
              <ol className="mt-6 space-y-6">
                {receta.pasos.map((p, idx) => (
                  <li key={p.numero}>
                    <div className="flex gap-4">
                      <span className="font-display text-2xl font-semibold text-primary tabular-nums">
                        {String(p.numero).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">{p.titulo}</h3>
                        <p className="mt-1 leading-relaxed text-muted-foreground">
                          {p.descripcion}
                        </p>
                        {p.consejo && (
                          <p className="mt-2 text-sm text-aceituna">Consejo: {p.consejo}</p>
                        )}
                        {p.tiempoSegundos != null && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Temporizador: {Math.round(p.tiempoSegundos / 60)} min
                          </p>
                        )}
                      </div>
                    </div>
                    {/* In-article a mitad de pasos — nunca en modo cocina */}
                    {idx === Math.floor((receta.pasos.length - 1) / 2) &&
                      receta.pasos.length >= 3 && (
                        <div className="no-print my-8">
                          <AdSlot position="in-article" />
                        </div>
                      )}
                  </li>
                ))}
              </ol>
            </section>

            {receta.maridaje && (
              <section className="mt-12">
                <h2 className="font-display text-2xl font-semibold">Maridaje</h2>
                <p className="mt-3 text-muted-foreground">{receta.maridaje}</p>
              </section>
            )}

            {receta.variantes && (
              <section className="mt-12">
                <h2 className="font-display text-2xl font-semibold">Variantes</h2>
                <p className="mt-3 text-muted-foreground">{receta.variantes}</p>
              </section>
            )}

            {relacionadas.length > 0 && (
              <section className="mt-16 border-t border-border pt-10">
                <h2 className="font-display text-2xl font-semibold">Recetas relacionadas</h2>
                <ul className="mt-4 divide-y divide-border">
                  {relacionadas.map((r) => (
                    <li key={r.id}>
                      <Link href={`/recetas/${r.id}`} className="link-row">
                        <span className="link-row-title">{r.nombre}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {r.provincia}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="no-print hidden lg:block">
            <div className="sticky top-24">
              <AdSlot position="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
