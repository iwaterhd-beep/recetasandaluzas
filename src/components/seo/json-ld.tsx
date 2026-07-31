interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Inyecta JSON-LD sin XSS (JSON.stringify escapa caracteres peligrosos) */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
