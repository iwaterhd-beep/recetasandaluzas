"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { isGaEnabled } from "@/lib/analytics";

/** Evento personalizado GA4 (no-op si analytics está desactivado). */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  if (!isGaEnabled()) return;
  sendGAEvent("event", name, params ?? {});
}
