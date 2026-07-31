import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de privacidad",
  description: `Política de privacidad de ${SITE.name}: cookies, almacenamiento local y publicidad.`,
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Legal</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Privacidad</h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {SITE.name} almacena en tu dispositivo (localStorage) preferencias de tema, favoritos y la
          lista de la compra. Esos datos no se envían a un servidor propio: permanecen en tu
          navegador.
        </p>
        <p>
          Si activamos Google AdSense, Google puede usar cookies o identificadores para mostrar
          anuncios personalizados o no personalizados según tu configuración y la normativa
          vigente. Puedes gestionar el consentimiento y las cookies desde tu navegador o las
          herramientas que ofrezca Google.
        </p>
        <p>
          El modo cocina puede solicitar permiso para notificaciones (avisos de temporizador) y
          usar Wake Lock para mantener la pantalla encendida. Ambos son opcionales y los controlas
          tú.
        </p>
        <p>
          Esta página es una base para el lanzamiento; actualízala con los datos del titular del
          dominio y el delegado de privacidad cuando corresponda.
        </p>
      </div>
    </div>
  );
}
