/**
 * Google Analytics 4 — Measurement ID (G-XXXXXXXX).
 * Vacío = no se carga el script.
 */
export const GA_MEASUREMENT_ID = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""
).trim();

export function isGaEnabled(): boolean {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
}
