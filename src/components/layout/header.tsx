"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { RecipeSearchBox } from "@/components/recetas/recipe-search-box";

const NAV = [
  { href: "/recetas", label: "Recetas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/provincias", label: "Provincias" },
  { href: "/blog", label: "Blog" },
] as const;

export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  if (pathname.includes("/cocinar")) return null;

  const isHome = pathname === "/";
  const closeSearch = () => {
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header className="app-header no-print">
      <div className="app-header__bar">
        <Link href="/" className="app-header__brand" aria-label="Recetas Andaluzas — Inicio">
          Recetas <span>Andaluzas</span>
        </Link>

        <RecipeSearchBox
          variant="header"
          className="app-header__search-desktop"
          onNavigate={closeSearch}
        />

        <nav className="app-header__nav-desktop" aria-label="Principal">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "bg-surface-muted text-foreground" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="app-header__actions">
          {!isHome && (
            <button
              type="button"
              className="app-header__icon lg:hidden"
              onClick={() => {
                setSearchOpen((v) => !v);
                setOpen(false);
              }}
              aria-expanded={searchOpen}
              aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar"}
            >
              <Search className="size-5" />
            </button>
          )}
          <AuthButton />
          <ThemeToggle />
          <button
            type="button"
            className="app-header__icon xl:hidden"
            onClick={() => {
              setOpen((v) => !v);
              setSearchOpen(false);
            }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="app-header__search-sheet">
          <RecipeSearchBox
            variant="sheet"
            autoFocus
            onNavigate={closeSearch}
          />
        </div>
      )}

      {open && (
        <div id="mobile-nav" className="app-header__drawer">
          <nav className="flex flex-col gap-1" aria-label="Menú">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="app-header__drawer-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
