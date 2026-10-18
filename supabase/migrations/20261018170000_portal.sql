-- CNTXT website portal: blog posts, form submissions and the admin allowlist.

create table public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admins (email) values ('has@cntxt.tech');

-- True when the signed-in user's email is on the allowlist.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  category text not null default 'Data',
  cover_url text,
  body text not null default '',
  author text not null default 'CNTXT AI',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_published_idx on public.posts (status, published_at desc);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  form text not null check (form in ('contact', 'partner')),
  first_name text not null,
  last_name text,
  email text not null,
  company text,
  website text,
  topic text,
  message text,
  page text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index submissions_created_idx on public.submissions (created_at desc);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_touch before update on public.posts
for each row execute function public.touch_updated_at();

-- Row-level security: the public reads published posts only; admins do the rest.
alter table public.admins enable row level security;
alter table public.posts enable row level security;
alter table public.submissions enable row level security;

create policy "admins read the allowlist" on public.admins
  for select to authenticated using (public.is_admin());

create policy "anyone reads published posts" on public.posts
  for select to anon, authenticated using (status = 'published');

create policy "admins read all posts" on public.posts
  for select to authenticated using (public.is_admin());

create policy "admins write posts" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Submissions are inserted by the server with the service key, never by browsers.
create policy "admins read submissions" on public.submissions
  for select to authenticated using (public.is_admin());

create policy "admins update submissions" on public.submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins delete submissions" on public.submissions
  for delete to authenticated using (public.is_admin());

-- Cover images: a public bucket only admins can write to.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "admins upload blog images" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog' and public.is_admin());

create policy "admins update blog images" on storage.objects
  for update to authenticated using (bucket_id = 'blog' and public.is_admin());

create policy "admins delete blog images" on storage.objects
  for delete to authenticated using (bucket_id = 'blog' and public.is_admin());
