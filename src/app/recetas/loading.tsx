import { RecipeGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-app py-[var(--section-y)]">
      <div className="skeleton mb-2 h-3 w-24 rounded" />
      <div className="skeleton mb-4 h-9 w-64 max-w-full rounded" />
      <div className="skeleton mb-8 h-4 w-80 max-w-full rounded" />
      <RecipeGridSkeleton count={6} />
    </div>
  );
}
