"use client";

import Link from "next/link";
import { Heart, Menu, Moon, Search, ShoppingBasket, Sun, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { useAppStore } from "@/stores/app-store";

const NAV = [
  { href: "/recetas", label: "Recetas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/provincias", label: "Provincias" },
  { href: "/blog", label: "Blog" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const tema = useAppStore((s) => s.tema);
  const setTema = useAppStore((s) => s.setTema);
  const favoritos = useAppStore((s) => s.favoritos);
  const listaCompra = useAppStore((s) => s.listaCompra);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cycleTheme = () => {
    const next = tema === "light" ? "dark" : tema === "dark" ? "system" : "light";
    setTema(next);
  };

  const themeIcon =
    tema === "dark" ? (
      <Moon className="size-4" aria-hidden />
    ) : tema === "light" ? (
      <Sun className="size-4" aria-hidden />
    ) : (
      <Sun className="size-4 opacity-60" aria-hidden />
    );

  return (
    <header className="no-print sticky top-0 z-50 border-b border-border/80 bg-surface/85 backdrop-blur-xl">
      <div className="container-app flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span
            className="azulejo size-8 shrink-0 rounded-sm shadow-sm ring-1 ring-azul-mist/40 transition-transform duration-300 group-hover:rotate-3"
            aria-hidden
          />
          <span className="font-display text-[1.15rem] font-semibold tracking-tight text-azul-ceramica-deep transition-colors group-hover:text-primary dark:text-azul-claro">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/recetas"
            className="btn btn-ghost hidden size-10 min-h-0 p-0 sm:inline-flex"
            aria-label="Buscar recetas"
          >
            <Search className="size-4" />
          </Link>

          <Link
            href="/favoritos"
            className="btn btn-ghost relative size-10 min-h-0 p-0"
            aria-label={`Favoritos${favoritos.length ? `, ${favoritos.length}` : ""}`}
          >
            <Heart className="size-4" />
            <AnimatePresence>
              {favoritos.length > 0 && (
                <motion.span
                  key="fav-dot"
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent"
                />
              )}
            </AnimatePresence>
          </Link>

          <Link
            href="/lista-compra"
            className="btn btn-ghost relative size-10 min-h-0 p-0"
            aria-label={`Lista de la compra${listaCompra.length ? `, ${listaCompra.length} ítems` : ""}`}
          >
            <ShoppingBasket className="size-4" />
            <AnimatePresence>
              {listaCompra.length > 0 && (
                <motion.span
                  key={listaCompra.length}
                  initial={reduce ? false : { scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-primary-foreground"
                >
                  {listaCompra.length > 9 ? "9+" : listaCompra.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            type="button"
            onClick={cycleTheme}
            className="btn btn-ghost size-10 min-h-0 p-0"
            aria-label={`Tema: ${tema}. Cambiar tema`}
            title={`Tema: ${tema}`}
          >
            {themeIcon}
          </button>

          <button
            type="button"
            className="btn btn-ghost size-10 min-h-0 p-0 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="overflow-hidden border-t border-border bg-surface md:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="container-app flex flex-col gap-1 py-4" aria-label="Móvil">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/recetas"
                className="btn btn-primary mt-2"
                onClick={() => setOpen(false)}
              >
                <Search className="size-4" />
                Buscar recetas
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
