import type { Metadata } from "next";
import Link from "next/link";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { SITE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Aviso legal",
  description: `Aviso legal de ${SITE.name} (${SITE.domain}): titularidad, condiciones de uso, propiedad intelectual y exención de responsabilidad.`,
  path: "/aviso-legal",
});

export default function AvisoLegalPage() {
  return (
    <LegalShell
      title="Aviso legal"
      lead={`Información legal del sitio ${SITE.domain} conforme a la normativa española aplicable a servicios de la sociedad de la información.`}
      updated="2 de agosto de 2026"
    >
      <LegalSection title="1. Datos identificativos">
        <p>
          Titular del sitio: <strong>{SITE.name}</strong>
        </p>
        <p>
          Dominio: <strong>{SITE.domain}</strong>
        </p>
        <p>
          URL:{" "}
          <a href={SITE.url} rel="noopener">
            {SITE.url}
          </a>
        </p>
        <p>
          Contacto:{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> ·{" "}
          <Link href="/contacto">Formulario de contacto</Link>
        </p>
        <p className="legal-doc__muted">
          Si el titular opera como persona física o mercantil con NIF/CIF y
          domicilio a efectos de notificaciones, esos datos se facilitarán bajo
          petición fundada o se actualizarán en esta página cuando proceda.
        </p>
      </LegalSection>

      <LegalSection title="2. Objeto">
        <p>
          {SITE.name} es un sitio de carácter informativo y gastronómico
          dedicado a recetas tradicionales de Andalucía, con herramientas de
          cocina (modo paso a paso, temporizador, favoritos y lista de la
          compra).
        </p>
      </LegalSection>

      <LegalSection title="3. Condiciones de uso">
        <ul>
          <li>
            El acceso es libre. Algunas funciones (cuenta, valoraciones,
            comentarios) requieren registro.
          </li>
          <li>
            Te comprometes a un uso lícito, respetuoso y no abusivo del servicio
            (sin spam, contenido ilícito ni ataques técnicos).
          </li>
          <li>
            Nos reservamos el derecho a moderar o eliminar comentarios y cuentas
            que incumplan estas normas.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Contenidos y seguridad alimentaria">
        <p>
          Las recetas se ofrecen de buena fe con fines orientativos. Adapta
          cantidades, tiempos y técnicas a tu experiencia, a alergias e
          intolerancias, y a las buenas prácticas de higiene y cocción.{" "}
          {SITE.name} no se responsabiliza de daños derivados del uso de las
          recetas o de errores tipográficos.
        </p>
      </LegalSection>

      <LegalSection title="5. Propiedad intelectual">
        <p>
          Los textos, estructura, diseño, código y selección de contenidos del
          sitio están propiedad de {SITE.name} o se usan con licencia. Queda
          prohibida la reproducción masiva o comercial sin autorización.
        </p>
        <p>
          Los nombres de platos tradicionales y referencias geográficas se usan
          con fines descriptivos. Las marcas de terceros mencionadas (p. ej.
          proveedores de login o afiliados) pertenecen a sus titulares.
        </p>
      </LegalSection>

      <LegalSection title="6. Enlaces y publicidad">
        <p>
          El sitio puede incluir enlaces a terceros (por ejemplo Amazon u otros
          comercios) y publicidad (p. ej. Google AdSense). Esas webs tienen sus
          propias condiciones; no controlamos sus contenidos ni sus prácticas de
          privacidad.
        </p>
        <p>
          Algunos enlaces pueden ser de afiliado: si compras a través de ellos,
          podemos recibir una comisión sin coste extra para ti.
        </p>
      </LegalSection>

      <LegalSection title="7. Disponibilidad">
        <p>
          Procuramos mantener el servicio disponible, pero pueden producirse
          interrupciones por mantenimiento, causas de fuerza mayor o fallos de
          terceros (hosting, autenticación, etc.).
        </p>
      </LegalSection>

      <LegalSection title="8. Legislación y jurisdicción">
        <p>
          Este aviso se rige por la legislación española. Para cualquier
          controversia, las partes se someten a los juzgados y tribunales del
          domicilio del consumidor cuando proceda según normativa de consumo, o
          en su defecto a los competentes según ley.
        </p>
        <p>
          Política de privacidad:{" "}
          <Link href="/privacidad">/privacidad</Link>. Contacto:{" "}
          <Link href="/contacto">/contacto</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
