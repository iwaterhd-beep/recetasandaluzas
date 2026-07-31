import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="section-label">404</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Página no encontrada</h1>
      <p className="section-lead mx-auto mt-2">
        Esa ruta no existe o la receta se ha movido. Vuelve al recetario.
      </p>
      <Link href="/recetas" className="btn btn-primary mt-8">
        Ver recetas
      </Link>
    </div>
  );
}
