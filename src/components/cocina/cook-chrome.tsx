"use client";

import { useEffect } from "react";

/** Activa data-cook-mode al entrar en /cocinar (antes del lazy load). */
export function CookChrome() {
  useEffect(() => {
    document.documentElement.setAttribute("data-cook-mode", "true");
    return () => {
      document.documentElement.removeAttribute("data-cook-mode");
    };
  }, []);

  return null;
}
