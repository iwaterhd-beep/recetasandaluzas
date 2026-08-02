import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Flame, ShoppingBasket } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { ParaTiSection } from "@/components/home/para-ti-section";
import { RecipeCard } from "@/components/recetas/recipe-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CATEGORIAS, PROVINCIAS, SITE } from "@/lib/constants";
import { getAllRecetas, getAllResumenes } from "@/lib/data";
import { buildPageMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import type { RecetaResumen } from "@/types/receta";

/** Mezcla valoraciones altas con variedad de categoría/provincia y platos asequibles. */
function pickParaTi(todas: RecetaResumen[], n = 8): RecetaResumen[] {
  const ranked = [...todas].sort(
    (a, b) =>
      b.valoracion - a.valoracion || b.numValoraciones - a.numValoraciones,
  );
  const accessible = ranked.filter(
    (r) => r.dificultad === "fácil" || r.tiempoTotal <= 45,
  );
  const pool = [...accessible, ...ranked.filter((r) => !accessible.includes(r))];
  const picked: RecetaResumen[] = [];
  const catCount = new Map<string, number>();
  const provCount = new Map<string, number>();

  for (const r of pool) {
    if (picked.length >= n) break;
    if (picked.some((p) => p.id === r.id)) continue;
    const c = catCount.get(r.categoria) ?? 0;
    const p = provCount.get(r.provincia) ?? 0;
    if (c >= 2) continue;
    if (p >= 2) continue;
    picked.push(r);
    catCount.set(r.categoria, c + 1);
    provCount.set(r.provincia, p + 1);
  }

  for (const r of ranked) {
    if (picked.length >= n) break;
    if (!picked.some((p) => p.id === r.id)) picked.push(r);
  }
  return picked;
}

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
    text: "Un paso cada vez, con temporizador.",
  },
  {
    icon: ShoppingBasket,
    title: "Lista de compra",
    text: "Suma ingredientes y al mercado.",
  },
  {
    icon: Clock,
    title: "Tiempos reales",
    text: "Sin trucos ni cantidades inventadas.",
  },
] as const;

export default function HomePage() {
  const total = getAllRecetas().length;
  const todas = getAllResumenes()
    .slice()
    .sort(
      (a, b) =>
        b.valoracion - a.valoracion || b.numValoraciones - a.numValoraciones,
    );

  const slides = todas.slice(0, 5);
  const paraTi = pickParaTi(todas, 8);
  const paraTiIds = new Set(paraTi.map((r) => r.id));
  const masRecetas = todas.filter((r) => !paraTiIds.has(r.id)).slice(0, 6);

  return (
    <div>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <HomeHero slides={slides} totalRecetas={total} />

      <ParaTiSection recetas={paraTi} />

      <section className="bg-surface-muted/60">
        <div className="container-app py-5 md:py-8">
          <Reveal>
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Categorías
            </h2>
          </Reveal>
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIAS.map((c) => {
              const n = getAllRecetas().filter((r) => r.categoria === c.slug)
                .length;
              return (
                <li key={c.slug} className="shrink-0">
                  <Link
                    href={`/categoria/${c.slug}`}
                    className="meta-chip meta-chip--accent min-h-11 px-4 text-sm transition hover:brightness-95"
                  >
                    {c.nombre}
                    <span className="opacity-60">({n})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-app py-6 md:py-[var(--section-y)]">
          <Reveal>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="app-screen__title !text-[length:var(--text-xl)]">
                Más ideas
              </h2>
              <Link
                href="/recetas"
                className="inline-flex items-center gap-1 text-sm font-bold text-olivo"
              >
                Explorar
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <ul className="explore-grid mt-4 md:mt-8">
            {masRecetas.map((r, i) => (
              <li key={r.id}>
                <RecipeCard receta={r} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <Stagger className="container-app grid grid-cols-3 gap-3 py-6 md:grid-cols-3 md:gap-8 md:py-[var(--section-y)]">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="flex flex-col items-center text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-surface-muted text-olivo md:size-12">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-2.5 font-sans text-sm font-bold text-foreground md:mt-4 md:text-lg">
                  {title}
                </h2>
                <p className="mt-0.5 hidden max-w-[12rem] text-sm leading-relaxed text-muted-foreground md:block">
                  {text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t border-border bg-background">
        <div className="container-app py-6 md:py-[var(--section-y)]">
          <Reveal>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="app-screen__title !text-[length:var(--text-xl)]">
                Por provincia
              </h2>
              <Link
                href="/provincias"
                className="inline-flex items-center gap-1 text-sm font-bold text-olivo"
              >
                Ver mapa
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <ul className="mt-4 flex gap-2 overflow-x-auto pb-1 md:mt-8 md:flex-wrap md:justify-start md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PROVINCIAS.map((p) => {
              const n = getAllRecetas().filter((r) => r.provincia === p.nombre)
                .length;
              return (
                <li key={p.slug} className="shrink-0">
                  <Link
                    href={`/provincia/${p.slug}`}
                    className="meta-chip min-h-11 px-4 text-sm transition hover:bg-surface-muted hover:text-foreground"
                  >
                    {p.nombre}
                    <span className="opacity-55">({n})</span>
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
