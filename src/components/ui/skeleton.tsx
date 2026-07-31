"use client";

/** Skeleton loaders para grids de recetas */
export function RecipeCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-surface"
      aria-hidden
    >
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Cargando recetas">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <RecipeCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
