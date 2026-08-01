import type { Metadata } from "next";
import { CATEGORIAS } from "@/lib/constants";
import { getAllRecetas } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Categorías de recetas andaluzas",
  description:
    "Explora recetas andaluzas por categoría: sopas frías, tapas, guisos, pescados, arroces, ensaladas y postres tradicionales.",
  path: "/categorias",
  keywords: ["recetas andaluzas", "categorías", "tapas", "gazpacho", "guisos"],
});

export default function CategoriasIndexPage() {
  return (
    <div className="bg-background">
      <div className="container-app app-screen">
        <h1 className="app-screen__title">Categorías</h1>
        <p className="app-screen__lead">Elige el tipo de plato.</p>

        <ul className="mt-5 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3">
          {CATEGORIAS.map((c) => {
            const n = getAllRecetas().filter((r) => r.categoria === c.slug).length;
            return (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="app-card group flex min-h-16 items-center justify-between gap-3 px-4 py-3.5 transition active:scale-[0.99] sm:p-5"
                >
                  <div className="min-w-0">
                    <span className="font-sans text-base font-bold text-foreground sm:text-lg">
                      {c.nombre}
                    </span>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {n} recetas · {c.descripcion}
                    </p>
                  </div>
                  <ArrowRight
                    className="size-5 shrink-0 text-muted-foreground transition group-hover:text-olivo"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
