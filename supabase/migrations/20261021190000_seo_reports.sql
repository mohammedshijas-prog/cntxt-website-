-- SEO and GEO reports, written by the server every 3 days (and on demand).
create table if not exists public.seo_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  trigger text not null default 'schedule' check (trigger in ('schedule', 'manual')),
  score integer,
  geo_score integer,
  pages jsonb not null default '[]',
  issues jsonb not null default '[]',
  site_checks jsonb not null default '{}',
  summary text,
  recommendations jsonb not null default '[]',
  blog_ideas jsonb not null default '[]',
  draft_post_id uuid references public.posts (id) on delete set null,
  error text
);

create index if not exists seo_reports_created_idx on public.seo_reports (created_at desc);

alter table public.seo_reports enable row level security;

create policy "marketing reads seo reports" on public.seo_reports
  for select to authenticated using (public.has_role(array['admin', 'marketing']));
