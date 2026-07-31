import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Flame, ShoppingBasket } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { RecipeCard } from "@/components/recetas/recipe-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CATEGORIAS, PROVINCIAS, SITE } from "@/lib/constants";
import { getAllRecetas, getAllResumenes } from "@/lib/data";
import { buildPageMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: `${SITE.name} — Cocina tradicional de Andalucía`,
    description: SITE.description,
    path: "/",
    keywords: [
      "recetas andaluzas",
      "cocina andaluza",
      "gazpacho",
      "salmorejo",
      "tapas",
    ],
  }),
  title: {
    absolute: `${SITE.name} — Cocina tradicional de Andalucía`,
  },
};

const FEATURES = [
  {
    icon: Flame,
    title: "Modo cocina",
    text: "Un paso cada vez, pantalla grande y temporizador cuando hace falta.",
  },
  {
    icon: ShoppingBasket,
    title: "Lista de la compra",
    text: "Suma ingredientes de varias recetas y llévatela al mercado.",
  },
  {
    icon: Clock,
    title: "Tiempos reales",
    text: "Preparación y cocción verificados, sin trucos ni cantidades inventadas.",
  },
] as const;

export default function HomePage() {
  const total = getAllRecetas().length;
  const destacadas = getAllResumenes()
    .slice()
    .sort((a, b) => b.valoracion - a.valoracion || b.numValoraciones - a.numValoraciones)
    .slice(0, 6);

  return (
    <div>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <HomeHero totalRecetas={total} />

      <section className="border-b border-border bg-surface">
        <Stagger className="container-app grid gap-10 py-[var(--section-y)] md:grid-cols-3 md:gap-8">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface-muted text-primary transition-transform duration-300 hover:scale-105">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-app py-[var(--section-y)]">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Para empezar</p>
              <h2 className="section-title">Más valoradas</h2>
              <p className="section-lead">Un primer bocado del recetario.</p>
            </div>
            <Link href="/recetas" className="btn btn-ghost hidden sm:inline-flex">
              Ver todas
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacadas.map((r, i) => (
            <li key={r.id}>
              <RecipeCard receta={r} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <section className="azulejo-soft">
        <div className="container-app py-[var(--section-y)]">
          <Reveal>
            <p className="section-label">Explorar</p>
            <h2 className="section-title">Por categoría</h2>
            <p className="section-lead">
              El plato según el momento: tapa de barra, guiso de cuchara o dulce.
            </p>
          </Reveal>

          <ul className="mt-8 border-t border-border">
            {CATEGORIAS.map((c) => {
              const n = getAllRecetas().filter((r) => r.categoria === c.slug).length;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/categoria/${c.slug}`}
                    className="link-row group flex items-baseline justify-between gap-4"
                  >
                    <div>
                      <span className="link-row-title">{c.nombre}</span>
                      <p className="mt-0.5 text-sm text-muted-foreground">{c.descripcion}</p>
                    </div>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      {n}
                      <ArrowRight
                        className="size-4 translate-x-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container-app py-[var(--section-y)]">
          <Reveal>
            <p className="section-label">Territorio</p>
            <h2 className="section-title">Por provincia</h2>
            <p className="section-lead">Ocho provincias, una cocina con mil matices.</p>
          </Reveal>

          <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {PROVINCIAS.map((p) => {
              const n = getAllRecetas().filter((r) => r.provincia === p.nombre).length;
              return (
                <li key={p.slug}>
                  <Link href={`/provincia/${p.slug}`} className="chip w-full justify-center">
                    {p.nombre}
                    <span className="ml-1 text-muted-foreground">({n})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
