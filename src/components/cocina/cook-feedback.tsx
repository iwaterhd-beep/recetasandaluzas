"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { openAuthModal } from "@/components/auth/auth-modal";

interface Props {
  recipeId: string;
  recipeName: string;
  onDone?: () => void;
}

/** Valoración + comentario al terminar el modo cocina (solo con cuenta). */
export function CookFeedback({ recipeId, recipeName, onDone }: Props) {
  const { ready, user, configured } = useAuth();
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void supabase.rpc("track_recipe_event", {
      p_recipe_id: recipeId,
      p_event_type: "cook_complete",
    });
  }, [recipeId]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;
    void supabase
      .from("ratings")
      .select("stars")
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.stars) setStars(data.stars);
      });
  }, [user, recipeId]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!configured) {
      setError("Las valoraciones no están disponibles ahora mismo.");
      return;
    }
    if (!user) {
      openAuthModal();
      return;
    }
    if (stars < 1) {
      setError("Elige cuántas estrellas le das.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient()!;
    const { error: rateErr } = await supabase.from("ratings").upsert(
      {
        user_id: user.id,
        recipe_id: recipeId,
        stars,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,recipe_id" },
    );
    if (rateErr) {
      setBusy(false);
      setError(rateErr.message);
      return;
    }
    if (comment.trim().length >= 2) {
      const { error: commentErr } = await supabase.from("comments").insert({
        user_id: user.id,
        recipe_id: recipeId,
        body: comment.trim(),
      });
      if (commentErr) {
        setBusy(false);
        setError(commentErr.message);
        return;
      }
    }
    setBusy(false);
    setSaved(true);
    onDone?.();
  };

  if (!ready) {
    return <div className="cook-feedback cook-feedback--loading" aria-hidden />;
  }

  if (saved) {
    return (
      <div className="cook-feedback cook-feedback--card">
        <p className="cook-done__thanks">
          ¡Gracias! Tu valoración de {recipeName} ya está guardada.
        </p>
      </div>
    );
  }

  if (skipped) {
    return null;
  }

  if (!user) {
    return (
      <div className="cook-feedback cook-feedback--card">
        <p className="cook-done__rating-label">¿Cómo te salió?</p>
        <p className="cook-feedback__hint">
          Entra con tu cuenta para dejar estrellas y un comentario.
        </p>
        <div className="cook-feedback__guest-actions">
          <button
            type="button"
            className="btn btn-primary min-h-11 w-full"
            onClick={() => openAuthModal()}
          >
            Entrar y valorar
          </button>
          <button
            type="button"
            className="cook-feedback__skip"
            onClick={() => setSkipped(true)}
          >
            Ahora no
          </button>
        </div>
      </div>
    );
  }

  const active = hover || stars;

  return (
    <form
      className="cook-feedback cook-feedback--card"
      onSubmit={(e) => void submit(e)}
    >
      <p className="cook-done__rating-label">¿Cómo te salió?</p>
      <p className="cook-feedback__hint">
        Valora <strong>{recipeName}</strong> y, si quieres, deja un comentario.
      </p>

      <div
        className="cook-done__stars"
        role="radiogroup"
        aria-label="Puntuación de 1 a 5 estrellas"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= active;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={stars === n}
              onClick={() => {
                setStars(n);
                setError(null);
              }}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              className={`cook-done__star${on ? " is-on" : ""}`}
              aria-label={`${n} estrella${n === 1 ? "" : "s"}`}
            >
              <Star
                className="size-9"
                strokeWidth={1.75}
                fill={on ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>

      <label className="sr-only" htmlFor={`cook-comment-${recipeId}`}>
        Comentario
      </label>
      <textarea
        id={`cook-comment-${recipeId}`}
        className="cook-feedback__textarea"
        rows={3}
        maxLength={2000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="¿Algún truco o tip? (opcional)"
      />

      {error && <p className="cook-feedback__error">{error}</p>}

      <div className="cook-feedback__actions">
        <button
          type="submit"
          className="btn btn-primary min-h-12 w-full"
          disabled={busy}
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Guardar valoración
        </button>
        <button
          type="button"
          className="cook-feedback__skip"
          disabled={busy}
          onClick={() => setSkipped(true)}
        >
          Saltar
        </button>
      </div>
    </form>
  );
}
