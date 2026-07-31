import { CATEGORIAS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CategoriasIndexPage() {
  return (
    <div className="azulejo-soft">
      <div className="container-app py-[var(--section-y)]">
        <p className="section-label">Explorar</p>
        <h1 className="section-title text-[length:var(--text-3xl)]">Categorías</h1>
        <p className="section-lead">Del gazpacho al tocino de cielo: elige el tipo de plato.</p>

        <ul className="mt-10 border-t border-border">
          {CATEGORIAS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categoria/${c.slug}`}
                className="link-row group flex items-baseline justify-between gap-4"
              >
                <div>
                  <span className="link-row-title">{c.nombre}</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.descripcion}</p>
                </div>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
