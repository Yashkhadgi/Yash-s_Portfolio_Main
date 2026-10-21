-- Run once in Supabase SQL Editor. No public read or write access.
create table if not exists public.portfolio_visits (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default now(),
  ip text not null,
  route text not null,
  session_id uuid,
  country text not null default '',
  city text not null default '',
  referrer text not null default '',
  user_agent text not null default ''
);
create index if not exists portfolio_visits_time_idx on public.portfolio_visits (visited_at desc, id desc);
alter table public.portfolio_visits enable row level security;
revoke all on public.portfolio_visits from anon, authenticated;
grant select, insert on public.portfolio_visits to service_role;
grant usage, select on sequence public.portfolio_visits_id_seq to service_role;

-- Safe to rerun on an existing table; old rows have unknown foreground time.
alter table public.portfolio_visits add column if not exists event_id uuid;
alter table public.portfolio_visits add column if not exists active_ms bigint check (active_ms between 0 and 86400000);
alter table public.portfolio_visits add column if not exists last_seen timestamptz;
alter table public.portfolio_visits add column if not exists ended boolean not null default false;
create unique index if not exists portfolio_visits_event_idx on public.portfolio_visits (event_id);
grant update on public.portfolio_visits to service_role;

-- Repeated or reordered heartbeats never add page views or reduce time.
create or replace function public.record_portfolio_visit(p_visit jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.portfolio_visits as existing
    (event_id, visited_at, last_seen, ip, route, session_id, country, city, referrer, user_agent, active_ms, ended)
  values
    ((p_visit->>'event_id')::uuid, (p_visit->>'visited_at')::timestamptz,
     (p_visit->>'visited_at')::timestamptz, p_visit->>'ip', p_visit->>'route',
     (p_visit->>'session_id')::uuid, p_visit->>'country', p_visit->>'city',
     p_visit->>'referrer', p_visit->>'user_agent', (p_visit->>'active_ms')::bigint,
     (p_visit->>'ended')::boolean)
  on conflict (event_id) do update set
    visited_at = least(existing.visited_at, excluded.visited_at),
    last_seen = greatest(existing.last_seen, excluded.last_seen),
    active_ms = greatest(existing.active_ms, excluded.active_ms),
    ended = existing.ended or excluded.ended
  where existing.route = excluded.route and existing.session_id is not distinct from excluded.session_id;
end;
$$;
revoke all on function public.record_portfolio_visit(jsonb) from public, anon, authenticated;
grant execute on function public.record_portfolio_visit(jsonb) to service_role;

-- Aggregate across the complete history, before the dashboard paginates.
create index if not exists portfolio_visits_session_idx on public.portfolio_visits (session_id, visited_at, id);
create or replace view public.portfolio_visit_sessions with (security_invoker = true) as
select
  coalesce(session_id::text, 'event-' || id::text) as visit_key,
  min(visited_at) as first_seen,
  max(coalesce(last_seen, visited_at)) as last_seen,
  count(*) as page_views,
  count(distinct route) as sections,
  (array_agg(ip order by visited_at, id))[1] as ip,
  (array_agg(country order by visited_at, id))[1] as country,
  (array_agg(city order by visited_at, id))[1] as city,
  (array_agg(referrer order by visited_at, id))[1] as referrer,
  (array_agg(user_agent order by visited_at, id))[1] as user_agent,
  array_agg(distinct route order by route) as routes,
  sum(active_ms) as active_ms
from public.portfolio_visits
group by coalesce(session_id::text, 'event-' || id::text);
revoke all on public.portfolio_visit_sessions from public, anon, authenticated;
grant select on public.portfolio_visit_sessions to service_role;
