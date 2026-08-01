-- Recetas Andaluzas — schema social + perfiles
-- Aplicar en el proyecto Supabase (SQL editor o MCP apply_migration)

create extension if not exists "pgcrypto";

-- Perfiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- Stats agregadas por receta (id = slug estático)
create table if not exists public.recipe_stats (
  recipe_id text primary key,
  views bigint not null default 0,
  avg_rating numeric(3,2) not null default 0,
  ratings_count integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Valoraciones
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id text not null,
  stars smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index if not exists ratings_recipe_idx on public.ratings (recipe_id);

-- Comentarios
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id text not null,
  body text not null check (char_length(trim(body)) between 2 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_recipe_idx on public.comments (recipe_id, created_at desc);

-- Favoritos cloud
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

-- Eventos (visitas / cocina)
create table if not exists public.recipe_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  recipe_id text not null,
  event_type text not null check (event_type in ('view', 'cook_start', 'cook_complete')),
  created_at timestamptz not null default now()
);

create index if not exists recipe_events_type_time_idx
  on public.recipe_events (event_type, created_at desc);
create index if not exists recipe_events_recipe_idx
  on public.recipe_events (recipe_id, created_at desc);

-- Helpers admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_list text := coalesce(current_setting('app.admin_emails', true), '');
  is_adm boolean := false;
begin
  if admin_list <> '' and position(lower(new.email) in lower(admin_list)) > 0 then
    is_adm := true;
  end if;

  insert into public.profiles (id, email, display_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    case when is_adm then 'admin' else 'user' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Recalcular avg rating
create or replace function public.refresh_recipe_rating(p_recipe_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.recipe_stats (recipe_id, avg_rating, ratings_count, updated_at)
  select
    p_recipe_id,
    coalesce(round(avg(stars)::numeric, 2), 0),
    count(*)::int,
    now()
  from public.ratings
  where recipe_id = p_recipe_id
  on conflict (recipe_id) do update set
    avg_rating = excluded.avg_rating,
    ratings_count = excluded.ratings_count,
    updated_at = now();
end;
$$;

create or replace function public.on_rating_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_recipe_rating(coalesce(new.recipe_id, old.recipe_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists ratings_refresh on public.ratings;
create trigger ratings_refresh
  after insert or update or delete on public.ratings
  for each row execute function public.on_rating_change();

-- Incrementar vistas
create or replace function public.track_recipe_event(
  p_recipe_id text,
  p_event_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.recipe_events (user_id, recipe_id, event_type)
  values (auth.uid(), p_recipe_id, p_event_type);

  if p_event_type = 'view' then
    insert into public.recipe_stats (recipe_id, views, updated_at)
    values (p_recipe_id, 1, now())
    on conflict (recipe_id) do update set
      views = public.recipe_stats.views + 1,
      updated_at = now();
  end if;
end;
$$;

grant execute on function public.track_recipe_event(text, text) to anon, authenticated;

-- RLS
alter table public.profiles enable row level security;
alter table public.recipe_stats enable row level security;
alter table public.ratings enable row level security;
alter table public.comments enable row level security;
alter table public.favorites enable row level security;
alter table public.recipe_events enable row level security;

-- profiles
create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- recipe_stats
create policy "stats_select_all" on public.recipe_stats
  for select using (true);

-- ratings
create policy "ratings_select_all" on public.ratings
  for select using (true);
create policy "ratings_insert_own" on public.ratings
  for insert with check (auth.uid() = user_id);
create policy "ratings_update_own" on public.ratings
  for update using (auth.uid() = user_id);
create policy "ratings_delete_own" on public.ratings
  for delete using (auth.uid() = user_id or public.is_admin());

-- comments
create policy "comments_select_visible" on public.comments
  for select using (hidden = false or auth.uid() = user_id or public.is_admin());
create policy "comments_insert_own" on public.comments
  for insert with check (auth.uid() = user_id);
create policy "comments_update_admin" on public.comments
  for update using (auth.uid() = user_id or public.is_admin());
create policy "comments_delete_own_or_admin" on public.comments
  for delete using (auth.uid() = user_id or public.is_admin());

-- favorites
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id or public.is_admin());
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- events
create policy "events_select_admin" on public.recipe_events
  for select using (public.is_admin() or auth.uid() = user_id);
create policy "events_insert_anyone" on public.recipe_events
  for insert with check (true);
