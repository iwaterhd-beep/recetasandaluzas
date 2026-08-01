"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/stores/app-store";

/**
 * UI Thermomix blanca: light por defecto.
 * Solo aplica `.dark` si el usuario elige explícitamente dark.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const tema = useAppStore((s) => s.tema);
  const setTema = useAppStore((s) => s.setTema);
  const migrated = useRef(false);

  useEffect(() => {
    if (migrated.current) return;
    migrated.current = true;
    // Evita el chrome verde antiguo (system → OS dark)
    if (tema === "system") setTema("light");
  }, [tema, setTema]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema]);

  return <>{children}</>;
}
