import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { RecipeFaq } from "@/components/recetas/recipe-faq";
import { RecipeImage } from "@/components/recetas/recipe-image";
import { RecipeInteractive } from "@/components/recetas/recipe-interactive";
import { RecipeSocial } from "@/components/recetas/recipe-social";
import { Stars } from "@/components/recetas/stars";
import { RecipeCard } from "@/components/recetas/recipe-card";

import { JsonLd } from "@/components/seo/json-ld";
import { categoriaLabel, provinciaSlug } from "@/lib/constants";
import {
  getAllRecetaIds,
  getRecetaById,
  getRecetasRelacionadas,
} from "@/lib/data";
import { tiempoTotal, toResumen } from "@/lib/recetas";
import {
  breadcrumbJsonLd,
  faqJsonLd,
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

  const relacionadas = getRecetasRelacionadas(receta, 5);
  const total = tiempoTotal(receta);
  const imagen = receta.imagenes[0] ?? "/images/placeholder-receta.svg";
  const altImagen = `${receta.nombre} de ${receta.provincia}, cocina andaluza casera`;
  const faqLd = faqJsonLd(receta.faq ?? []);

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
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <nav
        aria-label="Migas de pan"
        className="container-app pt-4 text-xs text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/categoria/${receta.categoria}`}
              className="hover:text-primary"
            >
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

      {/* Foto dominante estilo Cookidoo */}
      <div className="md:container-app md:pt-4">
        <div className="recipe-hero-app">
          <RecipeImage
            src={imagen}
            alt={altImagen}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      <div className="recipe-sheet">
        <div className="container-app md:px-0">
          <p className="section-label">
            {receta.provincia} · {categoriaLabel(receta.categoria)}
          </p>
          <h1 className="mt-1 font-sans text-[length:var(--text-3xl)] font-bold tracking-tight text-foreground">
            {receta.nombre}
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {receta.descripcion}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="meta-chip">
              <Clock className="size-3.5 text-muted-foreground" aria-hidden />
              {total} min
            </span>
            <span className="meta-chip">
              <Users className="size-3.5 text-muted-foreground" aria-hidden />
              {receta.raciones} raciones
            </span>
            <span className="meta-chip meta-chip--accent capitalize">
              <ChefHat className="size-3.5" aria-hidden />
              {receta.dificultad}
            </span>
            <span className="meta-chip inline-flex items-center gap-1.5">
              <Stars value={receta.valoracion} />
              <span className="text-muted-foreground">
                ({receta.numValoraciones})
              </span>
            </span>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_280px]">
            <div>
              <RecipeInteractive receta={receta} />

              <section className="mt-10">
                <h2 className="section-title mt-0">Preparación</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Resumen de pasos — usa «Empezar a cocinar» para el modo guiado.
              </p>
              <ol className="recipe-steps-app mt-5">
                {receta.pasos.map((p, idx) => {
                  const midAd =
                    idx === Math.floor((receta.pasos.length - 1) / 2) &&
                    receta.pasos.length >= 3;
                  return (
                    <li key={p.numero}>
                      <div className="app-card flex gap-3 p-4 shadow-none ring-1 ring-border">
                        <span className="recipe-steps-app__num" aria-hidden>
                          {p.numero}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground">
                            {p.titulo}
                          </h3>
                          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                            {p.descripcion}
                          </p>
                          {p.consejo && (
                            <p className="mt-1.5 text-xs text-aceituna">
                              Consejo: {p.consejo}
                            </p>
                          )}
                          {p.tiempoSegundos != null && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Temporizador: {Math.round(p.tiempoSegundos / 60)}{" "}
                              min
                            </p>
                          )}
                        </div>
                      </div>
                      {midAd && (
                        <div className="no-print my-2">
                          <AdSlot position="in-article" />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="mt-12">
              <h2 className="section-title mt-0">Historia</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {receta.historia}
              </p>
            </section>

            {receta.maridaje && (
              <section className="mt-10">
                <h2 className="section-title mt-0">Maridaje</h2>
                <p className="mt-3 text-muted-foreground">{receta.maridaje}</p>
              </section>
            )}

            {receta.variantes && (
              <section className="mt-10">
                <h2 className="section-title mt-0">Variantes</h2>
                <p className="mt-3 text-muted-foreground">{receta.variantes}</p>
              </section>
            )}

            <section className="mt-12">
              <h2 className="section-title mt-0">Valoraciones</h2>
              <div className="mt-4">
                <RecipeSocial
                  recipeId={receta.id}
                  fallbackRating={receta.valoracion}
                  fallbackCount={receta.numValoraciones}
                />
              </div>
            </section>

            <RecipeFaq items={receta.faq ?? []} />

            {relacionadas.length > 0 && (
              <section className="mt-14 border-t border-border pt-10">
                <h2 className="section-title mt-0">Recetas relacionadas</h2>
                <div className="explore-grid mt-5">
                  {relacionadas.map((r) => (
                    <RecipeCard key={r.id} receta={toResumen(r)} />
                  ))}
                </div>
              </section>
            )}
            </div>

            <aside className="no-print hidden lg:block">
              <div className="sticky top-20">
                <AdSlot position="sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}
