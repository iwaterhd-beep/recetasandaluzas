-- Drop fake seed reliance: rebuild stats from real events/ratings
-- and expose helpers for admin / weekly tops.

create or replace function public.rebuild_recipe_stats_from_events()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  truncate public.recipe_stats;

  insert into public.recipe_stats (recipe_id, views, avg_rating, ratings_count, updated_at)
  select
    coalesce(v.recipe_id, r.recipe_id) as recipe_id,
    coalesce(v.views, 0) as views,
    coalesce(r.avg_rating, 0) as avg_rating,
    coalesce(r.ratings_count, 0) as ratings_count,
    now()
  from (
    select recipe_id, count(*)::bigint as views
    from public.recipe_events
    where event_type = 'view'
    group by recipe_id
  ) v
  full outer join (
    select
      recipe_id,
      coalesce(round(avg(stars)::numeric, 2), 0) as avg_rating,
      count(*)::int as ratings_count
    from public.ratings
    group by recipe_id
  ) r on r.recipe_id = v.recipe_id;
end;
$$;

revoke execute on function public.rebuild_recipe_stats_from_events() from public, anon, authenticated;
grant execute on function public.rebuild_recipe_stats_from_events() to service_role;

-- Public weekly top (aggregates only; no user-level leakage)
create or replace function public.weekly_top_recipes(p_limit integer default 6)
returns table (recipe_id text, views bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.recipe_id, count(*)::bigint as views
  from public.recipe_events e
  where e.event_type = 'view'
    and e.created_at >= (now() - interval '7 days')
  group by e.recipe_id
  order by views desc
  limit greatest(1, least(coalesce(p_limit, 6), 30));
$$;

grant execute on function public.weekly_top_recipes(integer) to anon, authenticated;

-- Admin dashboard totals (real counts)
create or replace function public.admin_dashboard_metrics()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select json_build_object(
    'users', (select count(*)::int from public.profiles),
    'views', (select count(*)::int from public.recipe_events where event_type = 'view'),
    'views_week', (
      select count(*)::int from public.recipe_events
      where event_type = 'view' and created_at >= now() - interval '7 days'
    ),
    'cook_starts', (select count(*)::int from public.recipe_events where event_type = 'cook_start'),
    'cook_completes', (select count(*)::int from public.recipe_events where event_type = 'cook_complete'),
    'ratings', (select count(*)::int from public.ratings),
    'comments', (select count(*)::int from public.comments),
    'comments_hidden', (select count(*)::int from public.comments where hidden = true),
    'favorites', (select count(*)::int from public.favorites)
  ) into result;

  return result;
end;
$$;

grant execute on function public.admin_dashboard_metrics() to authenticated;

select public.rebuild_recipe_stats_from_events();
