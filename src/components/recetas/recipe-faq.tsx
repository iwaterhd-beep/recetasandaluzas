import type { FaqItem } from "@/types/receta";

interface RecipeFaqProps {
  items: FaqItem[];
  className?: string;
}

/** Sección FAQ visible + accesible (el JSON-LD se inyecta aparte). */
export function RecipeFaq({ items, className = "" }: RecipeFaqProps) {
  if (!items.length) return null;

  return (
    <section className={`mt-12 ${className}`} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-2xl font-semibold">
        Preguntas frecuentes
      </h2>
      <div className="mt-5 divide-y divide-border border-t border-border">
        {items.map((item) => (
          <details key={item.pregunta} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.pregunta}</span>
                <span
                  className="mt-0.5 shrink-0 text-muted-foreground transition group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {item.respuesta}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
