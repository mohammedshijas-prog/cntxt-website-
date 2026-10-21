-- Unique visitors without cookies: a hash that changes every day (see /api/track).
alter table public.page_views add column if not exists visitor text;
create index if not exists page_views_at_idx on public.page_views (at);
create index if not exists bot_hits_at_idx on public.bot_hits (at);

-- Where CNTXT shows up in AI answers, from each report's visibility check.
alter table public.seo_reports add column if not exists ai_visibility jsonb;
-- Reports without traffic data store nothing rather than an empty object.
alter table public.seo_reports alter column traffic drop default;
alter table public.seo_reports alter column traffic drop not null;
update public.seo_reports set traffic = null where traffic = '{}'::jsonb;

create or replace function public.traffic_summary(since timestamptz, until timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with v as (select * from page_views where at >= since and at < until),
       b as (select * from bot_hits where at >= since and at < until)
  select jsonb_build_object(
    'views', (select count(*) from v),
    -- Visitor ids rotate daily, so this counts unique visitors per day, summed.
    'visitors', (select count(distinct (visitor, date_trunc('day', at))) from v where visitor is not null),
    'bySource', coalesce((select jsonb_object_agg(source, jsonb_build_object('views', n, 'visitors', u))
                 from (select source, count(*) n, count(distinct (visitor, date_trunc('day', at))) u from v group by source) s), '{}'::jsonb),
    'byEngine', coalesce((select jsonb_agg(jsonb_build_object('source', source, 'engine', engine, 'views', n, 'visitors', u, 'topPage', top) order by n desc)
                 from (select source, engine, count(*) n, count(distinct (visitor, date_trunc('day', at))) u,
                              mode() within group (order by path) top
                       from v where engine is not null group by source, engine order by n desc limit 30) e), '[]'::jsonb),
    'topPages', coalesce((select jsonb_agg(jsonb_build_object('path', path, 'views', n, 'visitors', u) order by n desc)
                 from (select path, count(*) n, count(distinct (visitor, date_trunc('day', at))) u from v group by path order by n desc limit 12) p), '[]'::jsonb),
    'aiLanding', coalesce((select jsonb_agg(jsonb_build_object('path', path, 'views', n) order by n desc)
                 from (select path, count(*) n from v where source = 'ai' group by path order by n desc limit 8) p), '[]'::jsonb),
    'countries', coalesce((select jsonb_agg(jsonb_build_object('country', country, 'views', n) order by n desc)
                 from (select coalesce(country, '??') country, count(*) n from v group by 1 order by n desc limit 10) c), '[]'::jsonb),
    'devices', coalesce((select jsonb_object_agg(device, n) from (select coalesce(device, 'unknown') device, count(*) n from v group by 1) d), '{}'::jsonb),
    'crawlers', coalesce((select jsonb_agg(jsonb_build_object('bot', bot, 'hits', n, 'pages', p) order by n desc)
                 from (select bot, count(*) n, count(distinct path) p from b group by bot order by n desc) c), '[]'::jsonb),
    'daily', coalesce((select jsonb_agg(jsonb_build_object('day', d, 'views', n, 'visitors', u, 'ai', ai, 'search', se) order by d)
                 from (select date_trunc('day', at)::date d, count(*) n, count(distinct visitor) u,
                              count(*) filter (where source = 'ai') ai, count(*) filter (where source = 'search') se
                       from v group by 1) x), '[]'::jsonb)
  );
$$;
revoke all on function public.traffic_summary(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.traffic_summary(timestamptz, timestamptz) to service_role;
