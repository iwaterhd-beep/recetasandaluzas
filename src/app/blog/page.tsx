import type { Metadata } from "next";
import Link from "next/link";
import { articulos } from "@/data/blog/articulos";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog de cocina andaluza",
  description:
    "Artículos sobre tapas, Semana Santa, gazpacho y tradición culinaria de Andalucía, con enlaces a recetas paso a paso.",
  path: "/blog",
  keywords: ["blog cocina andaluza", "tapas Sevilla", "Semana Santa Andalucía"],
});

export default function BlogIndexPage() {
  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Lecturas</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Blog</h1>
      <p className="section-lead">
        Guías y comparativas para cocinar Andalucía con criterio — y enlaces directos a las recetas.
      </p>

      <ul className="mt-10 divide-y divide-border border-t border-border">
        {articulos.map((a) => (
          <li key={a.slug}>
            <Link href={`/blog/${a.slug}`} className="link-row block">
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
              <span className="link-row-title mt-1 block">{a.titulo}</span>
              <p className="mt-1 text-sm text-muted-foreground">{a.descripcion}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
