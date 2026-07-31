"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const tema = useAppStore((s) => s.tema);

  useEffect(() => {
    const root = document.documentElement;
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = tema === "dark" || (tema === "system" && preferDark);
    root.classList.toggle("dark", dark);
  }, [tema]);

  return <>{children}</>;
}
