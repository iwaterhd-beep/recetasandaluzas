import { PROVINCIAS } from "@/lib/constants";
import Link from "next/link";

export default function ProvinciasIndexPage() {
  return (
    <div className="bg-surface">
      <div className="container-app py-[var(--section-y)]">
        <p className="section-label">Territorio</p>
        <h1 className="section-title text-[length:var(--text-3xl)]">Provincias</h1>
        <p className="section-lead">Ocho rincones de Andalucía, cada uno con su despensa.</p>

        <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {PROVINCIAS.map((p) => (
            <li key={p.slug}>
              <Link href={`/provincia/${p.slug}`} className="chip w-full justify-center py-3">
                {p.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
