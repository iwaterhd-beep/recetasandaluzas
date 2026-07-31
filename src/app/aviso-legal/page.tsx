import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso legal",
  description: `Aviso legal de ${SITE.name} (${SITE.domain}).`,
  path: "/aviso-legal",
});

export default function AvisoLegalPage() {
  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Legal</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Aviso legal</h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Este sitio web, {SITE.domain}, tiene carácter informativo y gastronómico. Los contenidos
          de las recetas se ofrecen de buena fe; adapta cantidades y cocciones a tu criterio y a la
          seguridad alimentaria.
        </p>
        <p>
          Las marcas, nombres de platos tradicionales y referencias geográficas se usan con fines
          descriptivos. Si detectas un error en una receta, puedes contactarnos a través de los
          canales que indiquemos en el sitio.
        </p>
        <p>
          La publicidad, cuando esté activa, se gestiona mediante Google AdSense u otros partners
          bajo sus propias condiciones.
        </p>
        <p>
          <Link href="/privacidad" className="text-primary underline-offset-2 hover:underline">
            Ver política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
