"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Home, ShoppingBasket } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

const LINKS = [
  { href: "/", label: "Inicio", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/recetas",
    label: "Explorar",
    icon: Compass,
    match: (p: string) =>
      p.startsWith("/recetas") ||
      p.startsWith("/categoria") ||
      p.startsWith("/categorias") ||
      p.startsWith("/provincia"),
  },
  {
    href: "/favoritos",
    label: "Favoritos",
    icon: Heart,
    match: (p: string) => p.startsWith("/favoritos"),
  },
  {
    href: "/lista-compra",
    label: "Lista",
    icon: ShoppingBasket,
    match: (p: string) => p.startsWith("/lista-compra"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? "/";
  const favoritos = useAppStore((s) => s.favoritos);
  const lista = useAppStore((s) => s.listaCompra);

  if (pathname.includes("/cocinar")) return null;

  return (
    <nav className="bottom-nav no-print" aria-label="Navegación inferior">
      {LINKS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        const badge =
          href === "/favoritos"
            ? favoritos.length
            : href === "/lista-compra"
              ? lista.length
              : 0;
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav__link ${active ? "is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="bottom-nav__icon-wrap">
              <Icon aria-hidden strokeWidth={active ? 2.5 : 2} />
              {badge > 0 && (
                <span className="bottom-nav__badge" aria-hidden>
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </span>
            <span className="bottom-nav__label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
