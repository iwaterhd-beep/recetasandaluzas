"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Flame,
  Heart,
  MessageSquareWarning,
  Star,
  Users,
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

type Metrics = {
  users: number;
  views: number;
  views_week: number;
  cook_starts: number;
  cook_completes: number;
  ratings: number;
  comments: number;
  comments_hidden: number;
  favorites: number;
};

const EMPTY_METRICS: Metrics = {
  users: 0,
  views: 0,
  views_week: 0,
  cook_starts: 0,
  cook_completes: 0,
  ratings: 0,
  comments: 0,
  comments_hidden: 0,
  favorites: 0,
};

export default function AdminClient() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);
  const recipes = getAllResumenes();
  const nameOf = (id: string) => recipes.find((r) => r.id === id)?.nombre ?? id;

  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);

    const [{ data: metricsData }, { data: u }, { data: c }, { data: s }] =
      await Promise.all([
        supabase.rpc("admin_dashboard_metrics"),
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
          .gt("views", 0)
          .order("views", { ascending: false })
          .limit(15),
      ]);

    if (metricsData && typeof metricsData === "object") {
      setMetrics({ ...EMPTY_METRICS, ...(metricsData as Metrics) });
    }
    setUsers(u ?? []);
    setComments(c ?? []);
    setStats(s ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleHide = async (id: string, hidden: boolean) => {
    const supabase = createClient();
    await supabase?.from("comments").update({ hidden: !hidden }).eq("id", id);
    await load();
  };

  const cards = [
    {
      icon: Users,
      value: metrics.users,
      label: "Usuarios",
      hint: "perfiles reales",
    },
    {
      icon: Eye,
      value: metrics.views,
      label: "Visitas",
      hint: `${metrics.views_week} esta semana`,
    },
    {
      icon: Star,
      value: metrics.ratings,
      label: "Valoraciones",
      hint: "votos en Supabase",
    },
    {
      icon: MessageSquareWarning,
      value: metrics.comments,
      label: "Comentarios",
      hint:
        metrics.comments_hidden > 0
          ? `${metrics.comments_hidden} ocultos`
          : "todos visibles",
    },
    {
      icon: Flame,
      value: metrics.cook_completes,
      label: "Cocinas terminadas",
      hint: `${metrics.cook_starts} iniciadas`,
    },
    {
      icon: Heart,
      value: metrics.favorites,
      label: "Favoritos cloud",
      hint: "guardados por usuarios",
    },
  ] as const;

  return (
    <div className="container-app app-screen">
      <p className="section-label">Administración</p>
      <h1 className="app-screen__title">Panel</h1>
      <p className="app-screen__lead">
        Hola {profile?.display_name ?? "admin"} — solo métricas reales de
        Supabase (sin datos de relleno).
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map(({ icon: Icon, value, label, hint }) => (
          <div key={label} className="app-card p-4">
            <Icon className="size-5 text-olivo" />
            <p className="mt-2 text-2xl font-extrabold tabular-nums">
              {loading ? "—" : value}
            </p>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{hint}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-sans text-lg font-bold">Recetas más visitadas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Contadas desde eventos reales de visita.
        </p>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
          {!loading && stats.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">
              Aún no hay visitas registradas. En cuanto alguien abra una ficha,
              aparecerá aquí.
            </li>
          )}
          {stats.map((s) => (
            <li
              key={s.recipe_id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <Link
                href={`/recetas/${s.recipe_id}`}
                className="min-w-0 font-semibold hover:text-olivo"
              >
                <span className="line-clamp-1">{nameOf(s.recipe_id)}</span>
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  {s.ratings_count > 0
                    ? `★ ${Number(s.avg_rating).toFixed(1)} · ${s.ratings_count} votos reales`
                    : "Sin valoraciones aún"}
                </span>
              </Link>
              <span className="shrink-0 text-sm font-bold tabular-nums text-olivo">
                {s.views} visitas
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-lg font-bold">Usuarios registrados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {metrics.users} en total
          {users.length < metrics.users
            ? ` · mostrando los ${users.length} más recientes`
            : ""}
        </p>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
          {users.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">
              Ningún usuario todavía.
            </li>
          )}
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {u.display_name ?? "Sin nombre"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.email}
                </p>
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
        <p className="mt-1 text-sm text-muted-foreground">
          {metrics.comments} comentarios reales
          {comments.length < metrics.comments
            ? ` · últimos ${comments.length}`
            : ""}
        </p>
        <ul className="mt-3 space-y-2">
          {comments.length === 0 && (
            <li className="rounded-2xl border border-border bg-white p-4 text-sm text-muted-foreground">
              No hay comentarios todavía.
            </li>
          )}
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
