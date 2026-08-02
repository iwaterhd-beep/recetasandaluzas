"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV = [
  { href: "/recetas", label: "Recetas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/provincias", label: "Provincias" },
  { href: "/blog", label: "Blog" },
] as const;

export function Header() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  if (pathname.includes("/cocinar")) return null;

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/recetas?q=${encodeURIComponent(query)}` : "/recetas");
    setOpen(false);
    setSearchOpen(false);
  }

  const isHome = pathname === "/";

  return (
    <header className="app-header no-print">
      <div className="app-header__bar">
        <Link href="/" className="app-header__brand" aria-label="Recetas Andaluzas — Inicio">
          Recetas <span>Andaluzas</span>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={onSearch}
          className="search-pill app-header__search-desktop"
          role="search"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar recetas…"
            aria-label="Buscar recetas"
          />
        </form>

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
        <form
          onSubmit={onSearch}
          className="app-header__search-sheet search-pill"
          role="search"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar recetas…"
            aria-label="Buscar recetas"
            autoFocus
          />
        </form>
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
