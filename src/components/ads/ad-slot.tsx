"use client";

import { useEffect, useRef } from "react";
import { ADSENSE, adsEnabled, type AdPosition } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/** Alturas reservadas — evitan CLS con o sin anuncio cargado */
const HEIGHTS: Record<AdPosition, string> = {
  "in-article": "min-h-[250px]",
  sidebar: "min-h-[600px]",
  banner: "min-h-[90px]",
  "cook-banner": "min-h-[90px]",
  "cook-rail": "min-h-[180px]",
};

const LABELS: Record<AdPosition, string> = {
  "in-article": "En artículo",
  sidebar: "Lateral",
  banner: "Banner",
  "cook-banner": "Modo cocina · banner",
  "cook-rail": "Modo cocina · lateral",
};

interface AdSlotProps {
  position: AdPosition;
  className?: string;
  /** Forzar ocultar (p. ej. modo cocina global del sitio) */
  disabled?: boolean;
  /** Slot propio del modo cocina (no se oculta con data-cook-mode) */
  cookContext?: boolean;
}

export function AdSlot({
  position,
  className = "",
  disabled = false,
  cookContext = false,
}: AdSlotProps) {
  const pushed = useRef(false);
  const enabled = adsEnabled();
  const slotId = ADSENSE.slots[position];
  const showRealAd = enabled && Boolean(slotId);

  useEffect(() => {
    if (disabled || !showRealAd || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense aún no listo */
    }
  }, [disabled, showRealAd]);

  if (disabled) return null;

  return (
    <aside
      className={`ad-slot ad-slot--${position} ${cookContext ? "cook-ad" : ""} ${HEIGHTS[position]} ${className}`}
      data-ad-slot={position}
      aria-label="Publicidad"
    >
      {showRealAd ? (
        position === "in-article" ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center", minHeight: 250 }}
            data-ad-client={ADSENSE.clientId}
            data-ad-slot={slotId}
            data-ad-layout="in-article"
            data-ad-format="fluid"
          />
        ) : (
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              minHeight:
                position === "sidebar" || position === "cook-rail" ? 250 : 90,
            }}
            data-ad-client={ADSENSE.clientId}
            data-ad-slot={slotId}
            data-ad-format={
              position === "banner" || position === "cook-banner"
                ? "horizontal"
                : "auto"
            }
            data-full-width-responsive="true"
          />
        )
      ) : (
        <div className="ad-slot__placeholder no-print">
          <span>Publicidad · {LABELS[position]}</span>
          <span className="ad-slot__hint">
            AdSense — configura NEXT_PUBLIC_ADSENSE_SLOT_
            {position.replace(/-/g, "_").toUpperCase()}
          </span>
        </div>
      )}
    </aside>
  );
}
