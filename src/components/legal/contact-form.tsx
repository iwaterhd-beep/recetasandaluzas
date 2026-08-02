"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { SITE } from "@/lib/constants";

export function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("Consulta general");
  const [mensaje, setMensaje] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentHint, setSentHint] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = mensaje.trim();
    if (text.length < 10) return;
    setBusy(true);
    const body = [
      `Nombre: ${nombre.trim() || "—"}`,
      `Email de respuesta: ${email.trim() || "—"}`,
      "",
      text,
    ].join("\n");
    const mailto = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(
      `[${SITE.name}] ${asunto}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSentHint(true);
    setBusy(false);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form__grid">
        <label className="contact-form__field">
          <span>Nombre</span>
          <input
            type="text"
            name="nombre"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </label>
        <label className="contact-form__field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
        </label>
      </div>

      <label className="contact-form__field">
        <span>Asunto</span>
        <select
          name="asunto"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
        >
          <option>Consulta general</option>
          <option>Error en una receta</option>
          <option>Privacidad / datos personales</option>
          <option>Colaboraciones o prensa</option>
          <option>Publicidad o afiliados</option>
        </select>
      </label>

      <label className="contact-form__field">
        <span>Mensaje</span>
        <textarea
          name="mensaje"
          required
          rows={6}
          minLength={10}
          maxLength={4000}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Cuéntanos en qué podemos ayudarte…"
        />
      </label>

      <p className="contact-form__note">
        Al enviar se abrirá tu correo con el mensaje dirigido a{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. También
        puedes escribirnos directamente.
      </p>

      {sentHint && (
        <p className="contact-form__hint" role="status">
          Si no se abrió tu cliente de correo, copia la dirección y escríbenos a
          mano.
        </p>
      )}

      <div className="contact-form__actions">
        <button type="submit" className="btn btn-primary min-h-12" disabled={busy}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          Enviar mensaje
        </button>
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="btn btn-secondary min-h-12"
        >
          <Mail className="size-4" aria-hidden />
          Abrir email
        </a>
      </div>
    </form>
  );
}
