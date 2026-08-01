"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Apple, Loader2, Mail, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export function AuthModal() {
  const { configured, user, refresh } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("login") === "1" && !user) setOpen(true);
  }, [searchParams, user]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-auth-modal", onOpen);
    return () => window.removeEventListener("open-auth-modal", onOpen);
  }, []);

  const close = () => {
    setOpen(false);
    setError(null);
    setInfo(null);
    if (searchParams.get("login")) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("login");
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname);
    }
  };

  const afterAuth = async () => {
    await refresh();
    const next = searchParams.get("next");
    close();
    if (next) router.push(next);
    else router.refresh();
  };

  const onEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase no está configurado todavía.");
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || undefined } },
        });
        if (err) throw err;
        setInfo("Revisa tu correo para confirmar la cuenta (si está activado).");
        await afterAuth();
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        await afterAuth();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase no está configurado todavía.");
      const origin = window.location.origin;
      const next = searchParams.get("next") ?? "/cuenta";
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error con Google");
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.button
        type="button"
        className="auth-modal__backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-label="Cerrar"
        onClick={close}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="auth-modal"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: 16 }}
      >
        <div className="auth-modal__head">
          <div>
            <p className="auth-modal__eyebrow">Recetas Andaluzas</p>
            <h2 id="auth-title" className="auth-modal__title">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
          </div>
          <button type="button" className="app-header__icon" onClick={close} aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>

        {!configured && (
          <p className="auth-modal__warn">
            Falta configurar Supabase (`NEXT_PUBLIC_SUPABASE_URL` y anon key).
          </p>
        )}

        <div className="auth-modal__providers">
          <button
            type="button"
            className="btn btn-secondary w-full min-h-12"
            onClick={() => void onGoogle()}
            disabled={busy || !configured}
          >
            Continuar con Google
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full min-h-12 opacity-60"
            disabled
            title="Próximamente — requiere Apple Developer"
          >
            <Apple className="size-4" />
            Apple (próximamente)
          </button>
        </div>

        <div className="auth-modal__divider">
          <span>o con correo</span>
        </div>

        <form onSubmit={(e) => void onEmailAuth(e)} className="auth-modal__form">
          {mode === "signup" && (
            <label className="auth-field">
              <span>Nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Tu nombre"
              />
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </label>
          <label className="auth-field">
            <span>Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="Mínimo 6 caracteres"
            />
          </label>

          {error && <p className="auth-modal__error">{error}</p>}
          {info && <p className="auth-modal__info">{info}</p>}

          <button type="submit" className="btn btn-primary w-full min-h-12" disabled={busy || !configured}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            {mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>

        <p className="auth-modal__switch">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button type="button" onClick={() => setMode("signup")}>
                Crear una
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export function openAuthModal() {
  window.dispatchEvent(new Event("open-auth-modal"));
}
