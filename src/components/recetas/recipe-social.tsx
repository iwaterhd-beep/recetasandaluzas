"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Send, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { openAuthModal } from "@/components/auth/auth-modal";

interface RecipeSocialProps {
  recipeId: string;
  fallbackRating: number;
  fallbackCount: number;
}

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

export function RecipeSocial({
  recipeId,
  fallbackRating,
  fallbackCount,
}: RecipeSocialProps) {
  const { user, configured } = useAuth();
  const [avg, setAvg] = useState(fallbackRating);
  const [count, setCount] = useState(fallbackCount);
  const [views, setViews] = useState(0);
  const [myStars, setMyStars] = useState(0);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    void supabase.rpc("track_recipe_event", {
      p_recipe_id: recipeId,
      p_event_type: "view",
    });

    void (async () => {
      const { data: stats } = await supabase
        .from("recipe_stats")
        .select("avg_rating, ratings_count, views")
        .eq("recipe_id", recipeId)
        .maybeSingle();
      if (stats) {
        if (stats.ratings_count > 0) {
          setAvg(Number(stats.avg_rating));
          setCount(stats.ratings_count);
        }
        setViews(stats.views);
      }

      const { data: commentRows } = await supabase
        .from("comments")
        .select("id, body, created_at, user_id")
        .eq("recipe_id", recipeId)
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(30);

      if (commentRows?.length) {
        const ids = [...new Set(commentRows.map((c) => c.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", ids);
        const map = new Map((profiles ?? []).map((p) => [p.id, p]));
        setComments(
          commentRows.map((c) => ({
            id: c.id,
            body: c.body,
            created_at: c.created_at,
            profiles: map.get(c.user_id)
              ? {
                  display_name: map.get(c.user_id)!.display_name,
                  avatar_url: map.get(c.user_id)!.avatar_url,
                }
              : null,
          })),
        );
      }
    })();
  }, [recipeId]);

  useEffect(() => {
    if (!user) {
      setMyStars(0);
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    void supabase
      .from("ratings")
      .select("stars")
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setMyStars(data?.stars ?? 0));
  }, [user, recipeId]);

  const rate = async (stars: number) => {
    if (!configured) {
      setMsg("Conecta Supabase para valorar.");
      return;
    }
    if (!user) {
      openAuthModal();
      return;
    }
    setBusy(true);
    setMsg(null);
    const supabase = createClient()!;
    const { error } = await supabase.from("ratings").upsert(
      {
        user_id: user.id,
        recipe_id: recipeId,
        stars,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,recipe_id" },
    );
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMyStars(stars);
    setMsg("¡Gracias por tu valoración!");
    const { data: stats } = await supabase
      .from("recipe_stats")
      .select("avg_rating, ratings_count")
      .eq("recipe_id", recipeId)
      .maybeSingle();
    if (stats) {
      setAvg(Number(stats.avg_rating));
      setCount(stats.ratings_count);
    }
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    const text = body.trim();
    if (text.length < 2) return;
    setBusy(true);
    const supabase = createClient()!;
    const { data, error } = await supabase
      .from("comments")
      .insert({ user_id: user.id, recipe_id: recipeId, body: text })
      .select("id, body, created_at")
      .single();
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setBody("");
    setComments((prev) => [
      {
        id: data.id,
        body: data.body,
        created_at: data.created_at,
        profiles: {
          display_name: user.user_metadata?.full_name ?? user.email ?? "Tú",
          avatar_url: user.user_metadata?.avatar_url ?? null,
        },
      },
      ...prev,
    ]);
  };

  return (
    <section className="recipe-social" aria-label="Valoraciones y comentarios">
      <div className="recipe-social__summary">
        <div>
          <p className="recipe-social__avg tabular-nums">{avg.toFixed(1)}</p>
          <p className="recipe-social__meta">
            {count} valoracion{count === 1 ? "" : "es"}
            {views > 0 ? ` · ${views} visitas` : ""}
          </p>
        </div>
        <div className="recipe-social__stars" role="group" aria-label="Tu valoración">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              disabled={busy}
              onClick={() => void rate(n)}
              aria-label={`${n} estrellas`}
              className="recipe-social__star"
            >
              <Star
                className={`size-7 ${n <= myStars ? "fill-azafran text-azafran" : "text-border-strong"}`}
              />
            </button>
          ))}
        </div>
      </div>

      {msg && <p className="recipe-social__msg">{msg}</p>}

      <form onSubmit={(e) => void submitComment(e)} className="recipe-social__form">
        <label className="sr-only" htmlFor={`comment-${recipeId}`}>
          Comentario
        </label>
        <textarea
          id={`comment-${recipeId}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder={user ? "¿Cómo te salió? Cuéntalo…" : "Inicia sesión para comentar"}
          onFocus={() => {
            if (!user) openAuthModal();
          }}
        />
        <button type="submit" className="btn btn-primary min-h-11" disabled={busy || !body.trim()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Publicar
        </button>
      </form>

      <ul className="recipe-social__list">
        {comments.length === 0 && (
          <li className="text-sm text-muted-foreground">Sé el primero en comentar esta receta.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="recipe-social__item">
            <p className="recipe-social__author">
              {c.profiles?.display_name ?? "Cocinero"}
              <span>
                {new Date(c.created_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </p>
            <p className="recipe-social__body">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
