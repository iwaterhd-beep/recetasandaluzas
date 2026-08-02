import type { Metadata } from "next";
import Link from "next/link";
import { LegalSection, LegalShell } from "@/components/legal/legal-shell";
import { SITE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de privacidad",
  description: `Política de privacidad de ${SITE.name}: datos personales, cookies, cuentas, publicidad y derechos ARCO/RGPD.`,
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalShell
      title="Política de privacidad"
      lead={`Cómo tratamos los datos en ${SITE.name} (${SITE.domain}).`}
      updated="2 de agosto de 2026"
    >
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          El responsable es el titular del sitio web <strong>{SITE.name}</strong>,
          accesible en <strong>{SITE.domain}</strong>.
        </p>
        <p>
          Contacto para privacidad:{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos tratamos">
        <ul>
          <li>
            <strong>Datos de cuenta</strong> (si te registras): email, nombre
            mostrado, avatar opcional y preferencias asociadas a tu perfil
            (proveedor: Supabase Auth).
          </li>
          <li>
            <strong>Contenido que publicas</strong>: valoraciones, comentarios y
            actividad de cocina vinculada a tu cuenta.
          </li>
          <li>
            <strong>Datos solo en tu dispositivo</strong>: tema claro/oscuro,
            favoritos y lista de la compra guardados en <em>localStorage</em>. No
            se envían a un servidor propio salvo que inicies sesión y uses
            funciones en la nube.
          </li>
          <li>
            <strong>Datos técnicos</strong>: dirección IP, tipo de navegador y
            logs básicos que puedan generar el hosting (Vercel) o el proveedor de
            autenticación para seguridad y funcionamiento.
          </li>
          <li>
            <strong>Mensajes de contacto</strong>: los que nos envíes por email o
            formulario a {SITE.contactEmail}.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalidades y base legal">
        <ul>
          <li>
            Prestar el servicio (recetas, modo cocina, cuenta): ejecución de la
            relación con el usuario / interés legítimo.
          </li>
          <li>
            Responder consultas: consentimiento o medidas precontractuales.
          </li>
          <li>
            Seguridad, prevención de abuso y cumplimiento legal: interés
            legítimo y obligación legal.
          </li>
          <li>
            Publicidad (si está activa, p. ej. Google AdSense) y medición: según
            tu consentimiento y la configuración de cookies / partners.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cookies" title="4. Cookies y almacenamiento local">
        <p>
          Usamos almacenamiento local del navegador para preferencias y listas.
          El modo cocina puede pedir permiso de <strong>notificaciones</strong>{" "}
          (temporizador) y <strong>Wake Lock</strong> (pantalla encendida); ambos
          son opcionales.
        </p>
        <p>
          Si se activan servicios de terceros (AdSense, analítica, login social),
          esos proveedores pueden instalar cookies o identificadores propios. Puedes
          gestionar cookies desde tu navegador y, cuando aplique, desde los paneles
          de consentimiento de Google u otros partners.
        </p>
      </LegalSection>

      <LegalSection title="5. Encargados y terceros">
        <ul>
          <li>
            <strong>Vercel</strong>: alojamiento y entrega del sitio.
          </li>
          <li>
            <strong>Supabase</strong>: autenticación y base de datos de cuenta /
            comunidad.
          </li>
          <li>
            <strong>Google</strong> (si AdSense u OAuth están activos): publicidad
            o acceso con cuenta Google bajo sus políticas.
          </li>
          <li>
            <strong>Amazon</strong> (si hay enlaces de afiliados): al hacer clic
            puedes salir a Amazon; aplican sus condiciones.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Conservación">
        <p>
          Conservamos los datos de cuenta mientras mantengas el registro o sea
          necesario para el servicio y obligaciones legales. Los mensajes de
          contacto se guardan el tiempo razonable para gestionarlos. Los datos en
          tu navegador permanecen hasta que los borres tú.
        </p>
      </LegalSection>

      <LegalSection title="7. Tus derechos">
        <p>
          Puedes solicitar acceso, rectificación, borrado, limitación, oposición y
          portabilidad, y retirar el consentimiento cuando la base sea esa,
          escribiendo a{" "}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. También
          puedes reclamar ante la{" "}
          <a
            href="https://www.aepd.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>
          .
        </p>
        <p>
          Si tienes cuenta, puedes solicitar la eliminación desde{" "}
          <Link href="/contacto">Contacto</Link> indicando el email registrado.
        </p>
      </LegalSection>

      <LegalSection title="8. Menores">
        <p>
          El sitio no está dirigido a menores de 14 años. Si detectas un registro
          indebido, contacta con nosotros para eliminarlo.
        </p>
      </LegalSection>

      <LegalSection title="9. Cambios">
        <p>
          Podemos actualizar esta política. La fecha de la última versión aparece
          al inicio. El uso continuado del sitio tras un cambio relevante implica
          que has podido conocerla.
        </p>
        <p>
          Ver también el <Link href="/aviso-legal">aviso legal</Link> y la página
          de <Link href="/contacto">contacto</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
