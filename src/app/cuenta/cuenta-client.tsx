"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Flame, Heart, LogOut, ShoppingBasket, Star, Trophy } from "lucide-react";
import { RecipeCard } from "@/components/recetas/recipe-card";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { getAllResumenes } from "@/lib/data";
import { useAppStore } from "@/stores/app-store";

export default function CuentaClient() {
  const { user, profile, signOut, configured } = useAuth();
  const localFavs = useAppStore((s) => s.favoritos);
  const toggleFavorito = useAppStore((s) => s.toggleFavorito);
  const [cloudFavs, setCloudFavs] = useState<string[]>([]);
  const [weekTop, setWeekTop] = useState<{ recipe_id: string; n: number }[]>([]);
  const [cooked, setCooked] = useState<string[]>([]);
  const all = useMemo(() => getAllResumenes(), []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;

    void (async () => {
      // Sync local → cloud
      if (localFavs.length) {
        await supabase.from("favorites").upsert(
          localFavs.map((recipe_id) => ({ user_id: user.id, recipe_id })),
          { onConflict: "user_id,recipe_id", ignoreDuplicates: true },
        );
      }

      const { data: favs } = await supabase
        .from("favorites")
        .select("recipe_id")
        .eq("user_id", user.id);
      const ids = (favs ?? []).map((f) => f.recipe_id);
      setCloudFavs(ids);
      for (const id of ids) {
        if (!localFavs.includes(id)) toggleFavorito(id);
      }

      const since = new Date();
      since.setDate(since.getDate() - 7);
      const { data: events } = await supabase
        .from("recipe_events")
        .select("recipe_id")
        .eq("event_type", "view")
        .gte("created_at", since.toISOString());

      const counts = new Map<string, number>();
      for (const e of events ?? []) {
        counts.set(e.recipe_id, (counts.get(e.recipe_id) ?? 0) + 1);
      }
      setWeekTop(
        [...counts.entries()]
          .map(([recipe_id, n]) => ({ recipe_id, n }))
          .sort((a, b) => b.n - a.n)
          .slice(0, 6),
      );

      const { data: done } = await supabase
        .from("recipe_events")
        .select("recipe_id")
        .eq("user_id", user.id)
        .eq("event_type", "cook_complete")
        .order("created_at", { ascending: false })
        .limit(12);
      setCooked([...new Set((done ?? []).map((d) => d.recipe_id))]);
    })();
  }, [user, localFavs, toggleFavorito]);

  const favIds = cloudFavs.length ? cloudFavs : localFavs;
  const favRecipes = all.filter((r) => favIds.includes(r.id));
  const weekRecipes = weekTop
    .map((t) => all.find((r) => r.id === t.recipe_id))
    .filter(Boolean);
  const cookedRecipes = cooked
    .map((id) => all.find((r) => r.id === id))
    .filter(Boolean);

  if (!configured) {
    return (
      <div className="container-app app-screen">
        <h1 className="app-screen__title">Mi cuenta</h1>
        <p className="app-screen__lead">
          Configura Supabase para activar tu perfil cloud.
        </p>
      </div>
    );
  }

  return (
    <div className="container-app app-screen">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="section-label">Hola</p>
          <h1 className="app-screen__title">
            {profile?.display_name ?? user?.email ?? "Cocinero"}
          </h1>
          <p className="app-screen__lead">{profile?.email ?? user?.email}</p>
        </div>
        <button type="button" className="btn btn-ghost min-h-11" onClick={() => void signOut()}>
          <LogOut className="size-4" />
          Salir
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Link href="/favoritos" className="app-card flex min-h-20 flex-col items-center justify-center gap-1 p-3 text-center">
          <Heart className="size-5 text-tomate" />
          <span className="text-xs font-bold">Favoritos</span>
          <span className="text-lg font-extrabold tabular-nums">{favIds.length}</span>
        </Link>
        <Link href="/lista-compra" className="app-card flex min-h-20 flex-col items-center justify-center gap-1 p-3 text-center">
          <ShoppingBasket className="size-5 text-olivo" />
          <span className="text-xs font-bold">Lista</span>
        </Link>
        <div className="app-card flex min-h-20 flex-col items-center justify-center gap-1 p-3 text-center">
          <Flame className="size-5 text-azafran" />
          <span className="text-xs font-bold">Cocinadas</span>
          <span className="text-lg font-extrabold tabular-nums">{cooked.length}</span>
        </div>
        {profile?.role === "admin" && (
          <Link href="/admin" className="app-card flex min-h-20 flex-col items-center justify-center gap-1 bg-olivo p-3 text-center text-white">
            <Star className="size-5" />
            <span className="text-xs font-bold">Admin</span>
          </Link>
        )}
      </div>

      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-azafran" />
          <h2 className="app-screen__title !text-xl">Lo más visto esta semana</h2>
        </div>
        {weekRecipes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Aún no hay visitas registradas esta semana.
          </p>
        ) : (
          <ul className="explore-grid mt-4">
            {weekRecipes.map((r, i) =>
              r ? (
                <li key={r.id}>
                  <RecipeCard receta={r} index={i} badge="Semana" />
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="app-screen__title !text-xl">Tus favoritos</h2>
        {favRecipes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Guarda recetas con el corazón para verlas aquí.
          </p>
        ) : (
          <ul className="explore-grid mt-4">
            {favRecipes.slice(0, 6).map((r, i) => (
              <li key={r.id}>
                <RecipeCard receta={r} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {cookedRecipes.length > 0 && (
        <section className="mt-10">
          <h2 className="app-screen__title !text-xl">Recién cocinadas</h2>
          <ul className="explore-grid mt-4">
            {cookedRecipes.map((r, i) =>
              r ? (
                <li key={r.id}>
                  <RecipeCard receta={r} index={i} />
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
