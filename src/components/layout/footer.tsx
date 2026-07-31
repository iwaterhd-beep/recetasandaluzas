import Link from "next/link";
import { CATEGORIAS, PROVINCIAS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-border bg-surface">
      <div className="h-1.5 w-full bg-gradient-to-r from-aceituna via-aceite to-azul-claro" aria-hidden />

      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="azulejo size-7 rounded-sm" aria-hidden />
            <p className="font-display text-lg font-semibold text-azul-ceramica-deep dark:text-azul-claro">
              {SITE.name}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Recetas tradicionales de Andalucía, escritas para cocinar de verdad: pasos claros,
            temporizador y lista de la compra.
          </p>
        </div>

        <div>
          <p className="section-label">Categorías</p>
          <ul className="mt-3 space-y-2.5">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label">Provincias</p>
          <ul className="mt-3 space-y-2.5">
            {PROVINCIAS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/provincia/${p.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {p.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label">Sitio</p>
          <ul className="mt-3 space-y-2.5">
            <li>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/favoritos"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                href="/lista-compra"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Lista de la compra
              </Link>
            </li>
            <li>
              <Link
                href="/mapa-del-sitio"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Mapa del sitio
              </Link>
            </li>
            <li>
              <Link
                href="/aviso-legal"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Aviso legal
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs tracking-wide text-muted-foreground">
        © {new Date().getFullYear()} {SITE.domain} — De la tierra al plato.
      </div>
    </footer>
  );
}
