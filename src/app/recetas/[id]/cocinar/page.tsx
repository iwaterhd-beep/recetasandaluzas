import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getAllRecetaIds, getRecetaById } from "@/lib/data";

const CookMode = dynamic(
  () => import("@/components/cocina/cook-mode").then((m) => m.CookMode),
  {
    loading: () => (
      <div
        className="flex min-h-dvh items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <p className="text-muted-foreground">Preparando modo cocina…</p>
      </div>
    ),
  },
);

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllRecetaIds().map((id) => ({ id }));
}

export default async function CocinarPage({ params }: Props) {
  const { id } = await params;
  const receta = getRecetaById(id);
  if (!receta) notFound();

  return <CookMode receta={receta} />;
}
