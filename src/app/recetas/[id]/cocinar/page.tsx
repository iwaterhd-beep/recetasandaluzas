import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getAllRecetaIds, getRecetaById } from "@/lib/data";

const CookMode = dynamic(
  () => import("@/components/cocina/cook-mode").then((m) => m.CookMode),
  {
    loading: () => (
      <div className="cook-shell cook-loading" role="status" aria-live="polite">
        <div className="cook-loading__inner">
          <span className="cook-loading__ring" aria-hidden />
          <p className="cook-loading__eyebrow">Modo cocina</p>
          <p className="cook-loading__title">Preparando tu mesa de trabajo…</p>
          <p className="cook-loading__hint">Pantalla grande, temporizador y pasos claros</p>
        </div>
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
