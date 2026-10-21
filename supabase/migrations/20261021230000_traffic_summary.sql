-- One call that sums up visits for a window, so the report never pages through raw rows.
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
    'bySource', coalesce((select jsonb_object_agg(source, n) from (select source, count(*) n from v group by source) s), '{}'::jsonb),
    'byEngine', coalesce((select jsonb_agg(jsonb_build_object('source', source, 'engine', engine, 'views', n) order by n desc)
                 from (select source, engine, count(*) n from v where engine is not null group by source, engine order by n desc limit 20) e), '[]'::jsonb),
    'topPages', coalesce((select jsonb_agg(jsonb_build_object('path', path, 'views', n) order by n desc)
                 from (select path, count(*) n from v group by path order by n desc limit 10) p), '[]'::jsonb),
    'aiLanding', coalesce((select jsonb_agg(jsonb_build_object('path', path, 'views', n) order by n desc)
                 from (select path, count(*) n from v where source = 'ai' group by path order by n desc limit 5) p), '[]'::jsonb),
    'countries', coalesce((select jsonb_agg(jsonb_build_object('country', country, 'views', n) order by n desc)
                 from (select coalesce(country, '??') country, count(*) n from v group by 1 order by n desc limit 8) c), '[]'::jsonb),
    'devices', coalesce((select jsonb_object_agg(device, n) from (select coalesce(device, 'unknown') device, count(*) n from v group by 1) d), '{}'::jsonb),
    'crawlers', coalesce((select jsonb_agg(jsonb_build_object('bot', bot, 'hits', n) order by n desc)
                 from (select bot, count(*) n from b group by bot order by n desc) c), '[]'::jsonb)
  );
$$;
revoke all on function public.traffic_summary(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.traffic_summary(timestamptz, timestamptz) to service_role;
