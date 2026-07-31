"use client";

import { useEffect, useRef } from "react";

/** Mantiene la pantalla encendida durante el modo cocina */
export function useWakeLock(enabled: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    let released = false;

    const request = async () => {
      try {
        sentinelRef.current = await navigator.wakeLock.request("screen");
        sentinelRef.current.addEventListener("release", () => {
          sentinelRef.current = null;
        });
      } catch {
        /* permiso denegado o batería baja */
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible" && !released) {
        void request();
      }
    };

    void request();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisible);
      void sentinelRef.current?.release();
      sentinelRef.current = null;
    };
  }, [enabled]);
}
