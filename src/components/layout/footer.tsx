import Link from "next/link";
import { CATEGORIAS, PROVINCIAS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer no-print mt-auto border-t border-border bg-white dark:bg-surface">
      {/* Compacto en móvil — SEO links siguen en el DOM */}
      <div className="site-footer__mobile container-app py-5 lg:hidden">
        <p className="font-sans text-sm font-bold text-foreground">{SITE.name}</p>
        <nav
          className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground"
          aria-label="Enlaces del pie"
        >
          <Link href="/categorias" className="hover:text-foreground">
            Categorías
          </Link>
          <Link href="/provincias" className="hover:text-foreground">
            Provincias
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/aviso-legal" className="hover:text-foreground">
            Aviso legal
          </Link>
          <Link href="/privacidad" className="hover:text-foreground">
            Privacidad
          </Link>
        </nav>
        <p className="mt-3 text-[0.65rem] text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>

      <div className="container-app hidden gap-10 py-14 sm:grid-cols-2 lg:grid lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-sans text-lg font-bold tracking-tight text-foreground">
            {SITE.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Recetas tradicionales de Andalucía, escritas para cocinar de verdad:
            pasos claros, temporizador y lista de la compra.
          </p>
        </div>

        <div>
          <p className="section-label">Categorías</p>
          <ul className="mt-3 space-y-2.5">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/favoritos"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                href="/lista-compra"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Lista de la compra
              </Link>
            </li>
            <li>
              <Link
                href="/mapa-del-sitio"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Mapa del sitio
              </Link>
            </li>
            <li>
              <Link
                href="/aviso-legal"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Aviso legal
              </Link>
            </li>
            <li>
              <Link
                href="/privacidad"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="hidden border-t border-border lg:block">
        <p className="container-app py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}. Cocina andaluza para
          cocinar en casa.
        </p>
      </div>
    </footer>
  );
}
