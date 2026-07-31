export const ADSENSE = {
  clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
  enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true",
  slots: {
    "in-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ?? "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
    banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? "",
  },
} as const;

export type AdPosition = keyof typeof ADSENSE.slots;

/** Cliente válido (no placeholder) — sirve para script de verificación */
export function hasAdSenseClient(): boolean {
  const id = ADSENSE.clientId.trim();
  return Boolean(id) && !id.includes("XXXX") && id.startsWith("ca-pub-");
}

/** Mostrar anuncios reales */
export function adsEnabled(): boolean {
  return ADSENSE.enabled && hasAdSenseClient();
}

/** Línea ads.txt cuando haya publisher ID */
export function adsTxtLine(): string | null {
  if (!hasAdSenseClient()) return null;
  const pub = ADSENSE.clientId.replace(/^ca-/, "");
  return `google.com, ${pub}, DIRECT, f08c47fec0942fa0`;
}
