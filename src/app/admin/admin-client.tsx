"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Flame,
  Heart,
  MessageSquareWarning,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { getAllResumenes } from "@/lib/data";

type TabId = "resumen" | "trafico" | "comunidad" | "moderacion";

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

type RatingRow = {
  id: string;
  recipe_id: string;
  stars: number;
  created_at: string;
  user_id: string;
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

const TABS: { id: TabId; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "trafico", label: "Tráfico" },
  { id: "comunidad", label: "Comunidad" },
  { id: "moderacion", label: "Moderación" },
];

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function pct(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(4, Math.round((part / total) * 100));
}

export default function AdminClient() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<TabId>("resumen");
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [ratings, setRatings] = useState<RatingRow[]>([]);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [commentFilter, setCommentFilter] = useState<"all" | "visible" | "hidden">(
    "all",
  );

  const recipes = useMemo(() => getAllResumenes(), []);
  const recipeMap = useMemo(
    () => new Map(recipes.map((r) => [r.id, r])),
    [recipes],
  );
  const nameOf = (id: string) => recipeMap.get(id)?.nombre ?? id;
  const imageOf = (id: string) =>
    recipeMap.get(id)?.imagen ?? "/images/placeholder-receta.svg";

  const load = useCallback(async (soft = false) => {
    const supabase = createClient();
    if (!supabase) return;
    if (soft) setRefreshing(true);
    else setLoading(true);

    const [
      { data: metricsData },
      { data: u },
      { data: c },
      { data: s },
      { data: r },
    ] = await Promise.all([
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
        .limit(50),
      supabase
        .from("recipe_stats")
        .select("recipe_id, views, avg_rating, ratings_count")
        .gt("views", 0)
        .order("views", { ascending: false })
        .limit(12),
      supabase
        .from("ratings")
        .select("id, recipe_id, stars, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    if (metricsData && typeof metricsData === "object") {
      setMetrics({ ...EMPTY_METRICS, ...(metricsData as Metrics) });
    }
    setUsers(u ?? []);
    setComments(c ?? []);
    setStats(s ?? []);
    setRatings(r ?? []);
    setUpdatedAt(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleHide = async (id: string, hidden: boolean) => {
    const supabase = createClient();
    await supabase?.from("comments").update({ hidden: !hidden }).eq("id", id);
    await load(true);
  };

  const maxViews = stats[0]?.views ?? 0;
  const cookRate =
    metrics.cook_starts > 0
      ? Math.round((metrics.cook_completes / metrics.cook_starts) * 100)
      : 0;
  const filteredComments = comments.filter((c) => {
    if (commentFilter === "visible") return !c.hidden;
    if (commentFilter === "hidden") return c.hidden;
    return true;
  });
  const pendingHidden = metrics.comments_hidden;

  const kpis = [
    {
      icon: Users,
      value: metrics.users,
      label: "Usuarios",
      hint: "cuentas creadas",
      tone: "olivo" as const,
    },
    {
      icon: Eye,
      value: metrics.views,
      label: "Visitas",
      hint: `${metrics.views_week} esta semana`,
      tone: "olivo" as const,
    },
    {
      icon: Flame,
      value: metrics.cook_completes,
      label: "Cocinas hechas",
      hint:
        metrics.cook_starts > 0
          ? `${cookRate}% completan · ${metrics.cook_starts} inicios`
          : "sin inicios aún",
      tone: "azafran" as const,
    },
    {
      icon: Star,
      value: metrics.ratings,
      label: "Valoraciones",
      hint: "estrellas reales",
      tone: "azafran" as const,
    },
    {
      icon: MessageSquareWarning,
      value: metrics.comments,
      label: "Comentarios",
      hint:
        pendingHidden > 0 ? `${pendingHidden} ocultos` : "sin ocultar",
      tone: "tomate" as const,
      alert: pendingHidden > 0,
    },
    {
      icon: Heart,
      value: metrics.favorites,
      label: "Favoritos",
      hint: "guardados en cloud",
      tone: "tomate" as const,
    },
  ];

  return (
    <div className="admin-panel">
      <div className="container-app app-screen admin-panel__inner">
        <header className="admin-panel__hero">
          <div className="admin-panel__hero-copy">
            <p className="section-label">Administración</p>
            <h1 className="app-screen__title">Panel</h1>
            <p className="app-screen__lead">
              Hola {profile?.display_name ?? "admin"} — actividad real de la
              comunidad.
            </p>
          </div>
          <div className="admin-panel__hero-actions">
            {updatedAt && (
              <p className="admin-panel__updated">
                Actualizado {formatWhen(updatedAt.toISOString())}
              </p>
            )}
            <button
              type="button"
              className="btn btn-ghost min-h-11"
              onClick={() => void load(true)}
              disabled={refreshing || loading}
            >
              <RefreshCw
                className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
            <Link href="/recetas" className="btn btn-primary min-h-11">
              Ver sitio
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </header>

        <div
          className="admin-panel__tabs"
          role="tablist"
          aria-label="Secciones del panel"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`admin-panel__tab${tab === t.id ? " is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === "moderacion" && pendingHidden > 0 && (
                <span className="admin-panel__tab-badge">{pendingHidden}</span>
              )}
            </button>
          ))}
        </div>

        {(tab === "resumen" || tab === "trafico") && (
          <section className="admin-kpi-grid" aria-label="Indicadores">
            {kpis.map(
              ({ icon: Icon, value, label, hint, tone, alert }) => (
                <article
                  key={label}
                  className={`admin-kpi admin-kpi--${tone}${alert ? " is-alert" : ""}`}
                >
                  <div className="admin-kpi__top">
                    <span className="admin-kpi__icon">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <p className="admin-kpi__label">{label}</p>
                  </div>
                  <p className="admin-kpi__value">
                    {loading ? "—" : value.toLocaleString("es-ES")}
                  </p>
                  <p className="admin-kpi__hint">{hint}</p>
                </article>
              ),
            )}
          </section>
        )}

        {tab === "resumen" && (
          <div className="admin-split">
            <section className="admin-block">
              <div className="admin-block__head">
                <h2>Más visitadas</h2>
                <button
                  type="button"
                  className="admin-block__link"
                  onClick={() => setTab("trafico")}
                >
                  Ver tráfico
                </button>
              </div>
              <TopRecipes
                stats={stats}
                loading={loading}
                maxViews={maxViews}
                nameOf={nameOf}
                imageOf={imageOf}
              />
            </section>

            <section className="admin-block">
              <div className="admin-block__head">
                <h2>Última actividad</h2>
              </div>
              <ul className="admin-activity">
                {loading && (
                  <li className="admin-empty">Cargando actividad…</li>
                )}
                {!loading &&
                  ratings.length === 0 &&
                  comments.length === 0 && (
                    <li className="admin-empty">
                      Todavía no hay valoraciones ni comentarios.
                    </li>
                  )}
                {[
                  ...ratings.map((r) => ({
                    key: `r-${r.id}`,
                    kind: "rating" as const,
                    at: r.created_at,
                    recipe_id: r.recipe_id,
                    text: `${r.stars}★ en ${nameOf(r.recipe_id)}`,
                  })),
                  ...comments.slice(0, 8).map((c) => ({
                    key: `c-${c.id}`,
                    kind: "comment" as const,
                    at: c.created_at,
                    recipe_id: c.recipe_id,
                    text: c.body,
                    hidden: c.hidden,
                  })),
                ]
                  .sort(
                    (a, b) =>
                      new Date(b.at).getTime() - new Date(a.at).getTime(),
                  )
                  .slice(0, 8)
                  .map((item) => (
                    <li key={item.key} className="admin-activity__item">
                      <span
                        className={`admin-activity__dot admin-activity__dot--${item.kind}`}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className="admin-activity__text">
                          {"hidden" in item && item.hidden ? (
                            <span className="admin-pill admin-pill--muted">
                              Oculto
                            </span>
                          ) : null}
                          {item.text}
                        </p>
                        <p className="admin-activity__meta">
                          {formatWhen(item.at)} · {nameOf(item.recipe_id)}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
        )}

        {tab === "trafico" && (
          <section className="admin-block">
            <div className="admin-block__head">
              <div>
                <h2>Ranking de visitas</h2>
                <p className="admin-block__sub">
                  Solo eventos reales de apertura de ficha.
                </p>
              </div>
            </div>
            <TopRecipes
              stats={stats}
              loading={loading}
              maxViews={maxViews}
              nameOf={nameOf}
              imageOf={imageOf}
              expanded
            />
          </section>
        )}

        {tab === "comunidad" && (
          <div className="admin-split">
            <section className="admin-block">
              <div className="admin-block__head">
                <div>
                  <h2>Usuarios</h2>
                  <p className="admin-block__sub">
                    {metrics.users} registrados
                    {users.length < metrics.users
                      ? ` · ${users.length} recientes`
                      : ""}
                  </p>
                </div>
              </div>
              <ul className="admin-users">
                {users.length === 0 && (
                  <li className="admin-empty">Ningún usuario todavía.</li>
                )}
                {users.map((u) => (
                  <li key={u.id} className="admin-users__row">
                    <span className="admin-users__avatar" aria-hidden>
                      {(u.display_name ?? u.email ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="admin-users__name">
                        {u.display_name ?? "Sin nombre"}
                      </p>
                      <p className="admin-users__email">{u.email}</p>
                    </div>
                    <div className="admin-users__meta">
                      <span
                        className={`admin-pill ${u.role === "admin" ? "admin-pill--olivo" : "admin-pill--muted"}`}
                      >
                        {u.role}
                      </span>
                      <span className="admin-users__when">
                        {formatWhen(u.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-block">
              <div className="admin-block__head">
                <div>
                  <h2>Últimas valoraciones</h2>
                  <p className="admin-block__sub">
                    {metrics.ratings} en total
                  </p>
                </div>
              </div>
              <ul className="admin-ratings">
                {ratings.length === 0 && (
                  <li className="admin-empty">Sin valoraciones aún.</li>
                )}
                {ratings.map((r) => (
                  <li key={r.id} className="admin-ratings__row">
                    <Link
                      href={`/recetas/${r.recipe_id}`}
                      className="admin-ratings__thumb"
                    >
                      <Image
                        src={imageOf(r.recipe_id)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/recetas/${r.recipe_id}`}
                        className="admin-ratings__title"
                      >
                        {nameOf(r.recipe_id)}
                      </Link>
                      <p className="admin-ratings__stars">
                        {"★".repeat(r.stars)}
                        <span className="text-muted-foreground">
                          {"★".repeat(5 - r.stars)}
                        </span>
                      </p>
                    </div>
                    <span className="admin-users__when">
                      {formatWhen(r.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === "moderacion" && (
          <section className="admin-block">
            <div className="admin-block__head">
              <div>
                <h2>Comentarios</h2>
                <p className="admin-block__sub">
                  {metrics.comments} totales
                  {pendingHidden > 0 ? ` · ${pendingHidden} ocultos` : ""}
                </p>
              </div>
              <div className="admin-filter-pills" role="group" aria-label="Filtro">
                {(
                  [
                    ["all", "Todos"],
                    ["visible", "Visibles"],
                    ["hidden", "Ocultos"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`admin-filter-pills__btn${commentFilter === id ? " is-active" : ""}`}
                    onClick={() => setCommentFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <ul className="admin-comments">
              {filteredComments.length === 0 && (
                <li className="admin-empty">
                  No hay comentarios en este filtro.
                </li>
              )}
              {filteredComments.map((c) => (
                <li
                  key={c.id}
                  className={`admin-comments__card${c.hidden ? " is-hidden" : ""}`}
                >
                  <div className="admin-comments__main">
                    <div className="admin-comments__meta">
                      <Link
                        href={`/recetas/${c.recipe_id}`}
                        className="admin-comments__recipe"
                      >
                        {nameOf(c.recipe_id)}
                      </Link>
                      <span aria-hidden>·</span>
                      <span>{formatWhen(c.created_at)}</span>
                      {c.hidden && (
                        <span className="admin-pill admin-pill--muted">
                          Oculto
                        </span>
                      )}
                    </div>
                    <p className="admin-comments__body">{c.body}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost min-h-10 shrink-0"
                    onClick={() => void toggleHide(c.id, c.hidden)}
                  >
                    <EyeOff className="size-4" />
                    {c.hidden ? "Mostrar" : "Ocultar"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function TopRecipes({
  stats,
  loading,
  maxViews,
  nameOf,
  imageOf,
  expanded = false,
}: {
  stats: StatRow[];
  loading: boolean;
  maxViews: number;
  nameOf: (id: string) => string;
  imageOf: (id: string) => string;
  expanded?: boolean;
}) {
  if (loading) {
    return <p className="admin-empty">Cargando ranking…</p>;
  }
  if (stats.length === 0) {
    return (
      <p className="admin-empty">
        Aún no hay visitas. Cuando alguien abra una ficha, saldrá aquí.
      </p>
    );
  }

  return (
    <ol className="admin-rank">
      {stats.map((s, i) => (
        <li key={s.recipe_id} className="admin-rank__row">
          <span className="admin-rank__pos" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <Link
            href={`/recetas/${s.recipe_id}`}
            className="admin-rank__thumb"
          >
            <Image
              src={imageOf(s.recipe_id)}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </Link>
          <div className="admin-rank__body">
            <Link
              href={`/recetas/${s.recipe_id}`}
              className="admin-rank__title"
            >
              {nameOf(s.recipe_id)}
            </Link>
            <div className="admin-rank__bar" aria-hidden>
              <span
                style={{ width: `${pct(s.views, maxViews)}%` }}
              />
            </div>
            <p className="admin-rank__meta">
              {expanded && s.ratings_count > 0
                ? `★ ${Number(s.avg_rating).toFixed(1)} · ${s.ratings_count} votos · `
                : null}
              {s.views.toLocaleString("es-ES")} visitas
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
