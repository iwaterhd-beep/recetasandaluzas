"use client";

import { FormEvent, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { openAuthModal } from "@/components/auth/auth-modal";

interface Props {
  recipeId: string;
  onDone?: () => void;
}

/** Valoración + comentario al terminar el modo cocina */
export function CookFeedback({ recipeId, onDone }: Props) {
  const { user, configured } = useAuth();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!configured) {
      setError("Supabase no configurado.");
      return;
    }
    if (!user) {
      openAuthModal();
      return;
    }
    if (stars < 1) {
      setError("Elige una puntuación.");
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
      await supabase.from("comments").insert({
        user_id: user.id,
        recipe_id: recipeId,
        body: comment.trim(),
      });
    }
    await supabase.rpc("track_recipe_event", {
      p_recipe_id: recipeId,
      p_event_type: "cook_complete",
    });
    setBusy(false);
    setSaved(true);
    onDone?.();
  };

  if (saved) {
    return (
      <p className="cook-done__thanks">
        Valoración guardada. ¡Gracias por cocinar con nosotros!
      </p>
    );
  }

  return (
    <form className="cook-feedback" onSubmit={(e) => void submit(e)}>
      <p className="cook-done__rating-label">¿Cómo te salió?</p>
      <div className="cook-done__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStars(n)}
            className="cook-done__star"
            aria-label={`${n} estrellas`}
          >
            <Star
              className={`size-9 ${n <= stars ? "fill-azafran text-azafran" : "text-border-strong"}`}
            />
          </button>
        ))}
      </div>
      <textarea
        className="cook-feedback__textarea"
        rows={3}
        maxLength={2000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Opcional: deja un comentario sobre la receta"
      />
      {error && <p className="auth-modal__error">{error}</p>}
      <button type="submit" className="btn btn-primary mt-3 min-h-12 w-full" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        {user ? "Guardar valoración" : "Entrar y guardar"}
      </button>
    </form>
  );
}
