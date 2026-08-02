import type { ReactNode } from "react";

export function LegalShell({
  eyebrow = "Legal",
  title,
  lead,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-app py-[var(--section-y)]">
      <p className="section-label">{eyebrow}</p>
      <h1 className="section-title text-[length:var(--text-3xl)]">{title}</h1>
      {lead ? <p className="section-lead mt-2 max-w-2xl">{lead}</p> : null}
      {updated ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Última actualización: {updated}
        </p>
      ) : null}
      <div className="legal-doc mt-8 max-w-2xl">{children}</div>
    </div>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="legal-doc__section">
      <h2 className="legal-doc__h2">{title}</h2>
      <div className="legal-doc__body">{children}</div>
    </section>
  );
}
