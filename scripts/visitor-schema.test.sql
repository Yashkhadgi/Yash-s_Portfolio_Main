-- Run against a disposable database after visitor-table.sql. Rolls back fixtures.
begin;
set local role service_role;
select public.record_portfolio_visit('{"event_id":"00000000-0000-4000-8000-000000000001","session_id":"11111111-1111-4111-8111-111111111111","route":"#arrival","active_ms":10000,"ended":true,"visited_at":"2026-10-21T08:00:00Z","ip":"203.0.113.1","country":"IN","city":"Delhi","referrer":"","user_agent":"Test"}');
-- A late heartbeat must not reduce the time, reopen the page or add a view.
select public.record_portfolio_visit('{"event_id":"00000000-0000-4000-8000-000000000001","session_id":"11111111-1111-4111-8111-111111111111","route":"#arrival","active_ms":5000,"ended":false,"visited_at":"2026-10-21T08:00:01Z","ip":"203.0.113.1","country":"IN","city":"Delhi","referrer":"","user_agent":"Test"}');
select public.record_portfolio_visit('{"event_id":"00000000-0000-4000-8000-000000000002","session_id":"11111111-1111-4111-8111-111111111111","route":"#theater","active_ms":20000,"ended":false,"visited_at":"2026-10-21T08:00:02Z","ip":"203.0.113.1","country":"IN","city":"Delhi","referrer":"","user_agent":"Test"}');
-- The same IP in another browser session stays separate.
select public.record_portfolio_visit('{"event_id":"00000000-0000-4000-8000-000000000003","session_id":"22222222-2222-4222-8222-222222222222","route":"#arrival","active_ms":1000,"ended":false,"visited_at":"2026-10-21T08:00:03Z","ip":"203.0.113.1","country":"IN","city":"Delhi","referrer":"","user_agent":"Test"}');
reset role;
do $$
declare summary record; event record;
begin
  select * into strict summary from public.portfolio_visit_sessions where visit_key = '11111111-1111-4111-8111-111111111111';
  if summary.page_views <> 2 or summary.active_ms <> 30000 or summary.sections <> 2 or cardinality(summary.routes) <> 2 then
    raise exception 'Session aggregation or heartbeat deduplication failed';
  end if;
  select * into strict event from public.portfolio_visits where event_id = '00000000-0000-4000-8000-000000000001';
  if event.active_ms <> 10000 or not event.ended or event.visited_at <> '2026-10-21T08:00:00Z'::timestamptz then
    raise exception 'Out-of-order heartbeat reduced duration, changed start or reopened page';
  end if;
  if not exists (select 1 from public.portfolio_visit_sessions where visit_key = '22222222-2222-4222-8222-222222222222' and page_views = 1) then
    raise exception 'Sessions with shared IP were merged';
  end if;
  if has_table_privilege('anon', 'public.portfolio_visit_sessions', 'select') or has_table_privilege('authenticated', 'public.portfolio_visits', 'select') or has_function_privilege('anon', 'public.record_portfolio_visit(jsonb)', 'execute') then
    raise exception 'Public access must be denied';
  end if;
end;
$$;
rollback;
