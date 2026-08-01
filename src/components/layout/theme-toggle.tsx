"use client";

import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

export function ThemeToggle() {
  const tema = useAppStore((s) => s.tema);
  const setTema = useAppStore((s) => s.setTema);
  const isDark = tema === "dark";

  return (
    <button
      type="button"
      onClick={() => setTema(isDark ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
    >
      {isDark ? (
        <Moon className="size-5" aria-hidden />
      ) : (
        <Sun className="size-5" aria-hidden />
      )}
    </button>
  );
}
