import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_MEASUREMENT_ID, isGaEnabled } from "@/lib/analytics";

/** Carga GA4 solo si hay Measurement ID válido (G-XXXX). */
export function GoogleAnalyticsScript() {
  if (!isGaEnabled()) return null;
  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
