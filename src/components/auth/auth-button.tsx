"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChefHat,
  Heart,
  LogOut,
  ShoppingBasket,
  Star,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { openAuthModal } from "@/components/auth/auth-modal";

export function AuthButton() {
  const { ready, user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!ready) {
    return <span className="app-header__icon opacity-40" aria-hidden />;
  }

  if (!user) {
    return (
      <button
        type="button"
        className="btn btn-primary !min-h-9 !px-3.5 !text-xs sm:!min-h-10 sm:!px-4 sm:!text-sm"
        onClick={() => openAuthModal()}
      >
        Entrar
      </button>
    );
  }

  const name =
    profile?.display_name ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "Cuenta";
  const email = profile?.email ?? user.email ?? "";
  const isAdmin = profile?.role === "admin";
  const initial = name.slice(0, 1).toUpperCase();

  const close = () => setOpen(false);

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className={`app-header__icon account-menu__trigger${open ? " is-open" : ""}`}
        aria-label="Menú de cuenta"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <UserRound className="size-5" />
      </button>

      {open && (
        <div
          id={menuId}
          className="account-menu__panel"
          role="menu"
          aria-label="Opciones de cuenta"
        >
          <div className="account-menu__head">
            <span className="account-menu__avatar" aria-hidden>
              {initial}
            </span>
            <div className="min-w-0">
              <p className="account-menu__name">{name}</p>
              {email ? <p className="account-menu__email">{email}</p> : null}
            </div>
          </div>

          <div className="account-menu__list">
            <Link
              href="/cuenta"
              role="menuitem"
              className="account-menu__item"
              onClick={close}
            >
              <UserRound className="size-4" aria-hidden />
              Mi cuenta
            </Link>
            <Link
              href="/favoritos"
              role="menuitem"
              className="account-menu__item"
              onClick={close}
            >
              <Heart className="size-4" aria-hidden />
              Favoritos
            </Link>
            <Link
              href="/lista-compra"
              role="menuitem"
              className="account-menu__item"
              onClick={close}
            >
              <ShoppingBasket className="size-4" aria-hidden />
              Lista de la compra
            </Link>
            <Link
              href="/recetas"
              role="menuitem"
              className="account-menu__item"
              onClick={close}
            >
              <ChefHat className="size-4" aria-hidden />
              Explorar recetas
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                role="menuitem"
                className="account-menu__item account-menu__item--accent"
                onClick={close}
              >
                <Star className="size-4" aria-hidden />
                Panel admin
              </Link>
            )}
          </div>

          <div className="account-menu__footer">
            <button
              type="button"
              role="menuitem"
              className="account-menu__item account-menu__item--danger"
              onClick={() => {
                close();
                void signOut();
              }}
            >
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
