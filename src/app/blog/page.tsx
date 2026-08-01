import type { Metadata } from "next";
import Link from "next/link";
import { articulos } from "@/data/blog/articulos";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog de cocina andaluza",
  description:
    "Guías de tapas, comida típica por provincia, Semana Santa, Navidad y guisos andaluces, con enlaces a recetas paso a paso.",
  path: "/blog",
  keywords: [
    "blog cocina andaluza",
    "tapas Andalucía",
    "comida típica Cádiz",
    "postres navidad andalucía",
    "Semana Santa Andalucía",
  ],
});

export default function BlogIndexPage() {
  return (
    <div className="bg-background">
      <div className="container-app py-[var(--section-y)]">
        <p className="section-label">Lecturas</p>
        <h1 className="section-title text-[length:var(--text-3xl)]">Blog</h1>
        <p className="section-lead">
          Guías y comparativas para cocinar Andalucía — con enlaces a las
          recetas.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {articulos.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/blog/${a.slug}`}
                className="app-card block p-5 transition hover:border-olivo/30 hover:shadow-[var(--shadow-lift)]"
              >
                <time
                  dateTime={a.publicadaEn}
                  className="text-xs font-semibold tracking-wide text-aceituna uppercase"
                >
                  {new Date(a.publicadaEn).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="mt-2 block font-sans text-lg font-bold text-foreground">
                  {a.titulo}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.descripcion}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
