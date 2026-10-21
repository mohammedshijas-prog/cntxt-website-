-- First-party traffic, no cookies and no personal data: page, referring site, source, country, device.
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  path text not null,
  ref_host text,
  source text not null check (source in ('ai', 'search', 'social', 'referral', 'campaign', 'direct')),
  engine text,
  country text,
  device text
);
create index if not exists page_views_at_idx on public.page_views (at desc);

-- AI and search crawler visits, seen at the edge (crawlers don't run page scripts).
create table if not exists public.bot_hits (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  path text not null,
  bot text not null
);
create index if not exists bot_hits_at_idx on public.bot_hits (at desc);

alter table public.page_views enable row level security;
alter table public.bot_hits enable row level security;
create policy "marketing reads page views" on public.page_views for select to authenticated using (public.has_role(array['admin', 'marketing']));
create policy "marketing reads bot hits" on public.bot_hits for select to authenticated using (public.has_role(array['admin', 'marketing']));

alter table public.seo_reports add column if not exists traffic jsonb not null default '{}';
