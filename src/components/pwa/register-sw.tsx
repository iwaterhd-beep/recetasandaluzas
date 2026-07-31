"use client";

import { useEffect } from "react";

/** Registra el service worker de la PWA (caché básica offline) */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const onLoad = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW opcional */
      });
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
