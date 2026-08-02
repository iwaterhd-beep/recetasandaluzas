import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/legal/contact-form";
import { SITE } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contacto",
  description: `Contacta con ${SITE.name}: dudas sobre recetas, privacidad, colaboraciones o errores en el sitio.`,
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">Sitio</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">Contacto</h1>
      <p className="section-lead mt-2 max-w-2xl">
        ¿Un error en una receta, una duda de privacidad o una propuesta? Escríbenos
        y te respondemos lo antes posible.
      </p>

      <div className="contact-layout mt-10">
        <div className="contact-layout__main">
          <ContactForm />
        </div>

        <aside className="contact-layout__side" aria-label="Datos de contacto">
          <div className="contact-card">
            <span className="contact-card__icon" aria-hidden>
              <Mail className="size-5" />
            </span>
            <div>
              <p className="contact-card__label">Email</p>
              <a
                className="contact-card__value"
                href={`mailto:${SITE.contactEmail}`}
              >
                {SITE.contactEmail}
              </a>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-card__icon" aria-hidden>
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="contact-card__label">Web</p>
              <p className="contact-card__value">{SITE.domain}</p>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-card__icon" aria-hidden>
              <MessageCircle className="size-5" />
            </span>
            <div>
              <p className="contact-card__label">Temas habituales</p>
              <ul className="contact-card__list">
                <li>Correcciones de recetas</li>
                <li>Cuenta y privacidad</li>
                <li>Colaboraciones</li>
              </ul>
            </div>
          </div>

          <p className="contact-side-note">
            También puedes consultar el{" "}
            <Link href="/aviso-legal">aviso legal</Link> y la{" "}
            <Link href="/privacidad">política de privacidad</Link>.
          </p>
        </aside>
      </div>
    </div>
  );
}
