import { CATEGORIAS, PROVINCIAS, SITE } from "@/lib/constants";
import { getAllRecetas } from "@/lib/data";
import { articulos } from "@/data/blog/articulos";

/**
 * Sitemap HTML accesible (complementa sitemap.xml).
 * Útil para usuarios y para crawlers sencillos.
 */
export default function MapaDelSitioPage() {
  const recetas = getAllRecetas();

  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Navegación</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Mapa del sitio</h1>
      <p className="section-lead">Todas las secciones de {SITE.name}.</p>

      <nav className="mt-10 grid gap-10 sm:grid-cols-2" aria-label="Mapa del sitio">
        <section>
          <h2 className="font-display text-xl font-semibold">Principal</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a className="text-primary hover:underline" href="/">
                Inicio
              </a>
            </li>
            <li>
              <a className="text-primary hover:underline" href="/recetas">
                Recetas
              </a>
            </li>
            <li>
              <a className="text-primary hover:underline" href="/blog">
                Blog
              </a>
            </li>
            <li>
              <a className="text-primary hover:underline" href="/aviso-legal">
                Aviso legal
              </a>
            </li>
            <li>
              <a className="text-primary hover:underline" href="/privacidad">
                Privacidad
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Categorías</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <a className="text-primary hover:underline" href={`/categoria/${c.slug}`}>
                  {c.nombre}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Provincias</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PROVINCIAS.map((p) => (
              <li key={p.slug}>
                <a className="text-primary hover:underline" href={`/provincia/${p.slug}`}>
                  {p.nombre}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Blog</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {articulos.map((a) => (
              <li key={a.slug}>
                <a className="text-primary hover:underline" href={`/blog/${a.slug}`}>
                  {a.titulo}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </nav>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">
          Recetas ({recetas.length})
        </h2>
        <ul className="mt-4 columns-1 gap-x-8 text-sm sm:columns-2 lg:columns-3">
          {recetas.map((r) => (
            <li key={r.id} className="mb-2 break-inside-avoid">
              <a className="text-primary hover:underline" href={`/recetas/${r.id}`}>
                {r.nombre}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
