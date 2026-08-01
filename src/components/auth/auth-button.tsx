"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { openAuthModal } from "@/components/auth/auth-modal";

export function AuthButton() {
  const { ready, user, profile } = useAuth();

  if (!ready) {
    return <span className="app-header__icon opacity-40" aria-hidden />;
  }

  if (user) {
    return (
      <Link
        href={profile?.role === "admin" ? "/admin" : "/cuenta"}
        className="app-header__icon"
        aria-label={profile?.role === "admin" ? "Panel admin" : "Mi cuenta"}
        title={profile?.display_name ?? "Mi cuenta"}
      >
        <UserRound className="size-5" />
      </Link>
    );
  }

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
