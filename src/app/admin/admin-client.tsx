"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Eye,
  MessageSquareWarning,
  Star,
  Users,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { getAllResumenes } from "@/lib/data";

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  created_at: string;
};

type CommentRow = {
  id: string;
  recipe_id: string;
  body: string;
  hidden: boolean;
  created_at: string;
  user_id: string;
};

type StatRow = {
  recipe_id: string;
  views: number;
  avg_rating: number;
  ratings_count: number;
};

export default function AdminClient() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [ratingsCount, setRatingsCount] = useState(0);
  const recipes = getAllResumenes();
  const nameOf = (id: string) => recipes.find((r) => r.id === id)?.nombre ?? id;

  const load = async () => {
    const supabase = createClient();
    if (!supabase) return;
    const [{ data: u }, { data: c }, { data: s }, { count }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, display_name, role, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("comments")
        .select("id, recipe_id, body, hidden, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("recipe_stats")
        .select("recipe_id, views, avg_rating, ratings_count")
        .order("views", { ascending: false })
        .limit(15),
      supabase.from("ratings").select("*", { count: "exact", head: true }),
    ]);
    setUsers(u ?? []);
    setComments(c ?? []);
    setStats(s ?? []);
    setRatingsCount(count ?? 0);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleHide = async (id: string, hidden: boolean) => {
    const supabase = createClient();
    await supabase?.from("comments").update({ hidden: !hidden }).eq("id", id);
    await load();
  };

  return (
    <div className="container-app app-screen">
      <p className="section-label">Administración</p>
      <h1 className="app-screen__title">Panel</h1>
      <p className="app-screen__lead">
        Hola {profile?.display_name ?? "admin"} — métricas en vivo de la comunidad.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="app-card p-4">
          <Users className="size-5 text-olivo" />
          <p className="mt-2 text-2xl font-extrabold tabular-nums">{users.length}</p>
          <p className="text-xs font-semibold text-muted-foreground">Usuarios</p>
        </div>
        <div className="app-card p-4">
          <Eye className="size-5 text-olivo" />
          <p className="mt-2 text-2xl font-extrabold tabular-nums">
            {stats.reduce((n, s) => n + s.views, 0)}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">Vistas (top)</p>
        </div>
        <div className="app-card p-4">
          <Star className="size-5 text-azafran" />
          <p className="mt-2 text-2xl font-extrabold tabular-nums">{ratingsCount}</p>
          <p className="text-xs font-semibold text-muted-foreground">Valoraciones</p>
        </div>
        <div className="app-card p-4">
          <MessageSquareWarning className="size-5 text-tomate" />
          <p className="mt-2 text-2xl font-extrabold tabular-nums">{comments.length}</p>
          <p className="text-xs font-semibold text-muted-foreground">Comentarios</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-sans text-lg font-bold">Recetas más visitadas</h2>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
          {stats.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">Sin datos todavía.</li>
          )}
          {stats.map((s) => (
            <li key={s.recipe_id} className="flex items-center justify-between gap-3 px-4 py-3">
              <Link href={`/recetas/${s.recipe_id}`} className="min-w-0 font-semibold hover:text-olivo">
                <span className="line-clamp-1">{nameOf(s.recipe_id)}</span>
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  ★ {Number(s.avg_rating).toFixed(1)} · {s.ratings_count} votos
                </span>
              </Link>
              <span className="shrink-0 text-sm font-bold tabular-nums text-olivo">
                {s.views} views
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-lg font-bold">Usuarios registrados</h2>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{u.display_name ?? "Sin nombre"}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wide ${
                  u.role === "admin"
                    ? "bg-olivo text-white"
                    : "bg-surface-muted text-muted-foreground"
                }`}
              >
                {u.role}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 mb-8">
        <h2 className="font-sans text-lg font-bold">Moderar comentarios</h2>
        <ul className="mt-3 space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`rounded-2xl border p-4 ${c.hidden ? "opacity-50 border-dashed" : "border-border bg-white"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {nameOf(c.recipe_id)} ·{" "}
                    {new Date(c.created_at).toLocaleString("es-ES")}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{c.body}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost min-h-10 shrink-0"
                  onClick={() => void toggleHide(c.id, c.hidden)}
                  aria-label={c.hidden ? "Mostrar" : "Ocultar"}
                >
                  <EyeOff className="size-4" />
                  {c.hidden ? "Mostrar" : "Ocultar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
