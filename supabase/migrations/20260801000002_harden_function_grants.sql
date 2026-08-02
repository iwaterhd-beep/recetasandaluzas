-- Revoke public EXECUTE on internal helpers (triggers/security definer)
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
revoke execute on function public.on_rating_change() from public, anon, authenticated;
revoke execute on function public.refresh_recipe_rating(text) from public, anon, authenticated;

-- Keep track_recipe_event callable from the app (views/cook events)
grant execute on function public.track_recipe_event(text, text) to anon, authenticated;

-- Prefer inserts via track_recipe_event (security definer) instead of open INSERT
drop policy if exists "events_insert_anyone" on public.recipe_events;
create policy "events_insert_own_or_anon_view" on public.recipe_events
  for insert with check (
    auth.uid() = user_id
    or (auth.uid() is null and event_type = 'view')
  );
