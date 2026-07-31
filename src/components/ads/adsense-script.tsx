import Script from "next/script";
import { hasAdSenseClient, ADSENSE } from "@/lib/ads";

/**
 * Script de AdSense en el documento.
 * Se carga si hay CLIENT_ID válido (aunque los slots aún estén desactivados),
 * para la verificación de la cuenta en Google.
 */
export function AdSenseScript() {
  if (!hasAdSenseClient()) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
