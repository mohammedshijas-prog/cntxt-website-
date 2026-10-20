-- Careers: roles the team publishes, and the applications candidates send.

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  department text not null default '',
  location text not null default 'Remote',
  terms text not null default '',
  summary text not null default '',
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index roles_status_idx on public.roles (status, sort);

create trigger roles_touch before update on public.roles
for each row execute function public.touch_updated_at();

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  role_id uuid references public.roles (id) on delete set null,
  role_title text not null,
  name text not null,
  email text not null,
  phone text,
  location text,
  linkedin text,
  cover_note text,
  cv_path text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'interview', 'offer', 'hired', 'rejected')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_created_idx on public.applications (created_at desc);
create index applications_role_idx on public.applications (role_id);

create trigger applications_touch before update on public.applications
for each row execute function public.touch_updated_at();

alter table public.roles enable row level security;
alter table public.applications enable row level security;

-- The public sees open roles only; admins manage all of them.
create policy "anyone reads open roles" on public.roles
  for select to anon, authenticated using (status = 'open');

create policy "admins read all roles" on public.roles
  for select to authenticated using (public.is_admin());

create policy "admins write roles" on public.roles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Applications are inserted by the server with the service key, never by browsers.
create policy "admins read applications" on public.applications
  for select to authenticated using (public.is_admin());

create policy "admins update applications" on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins delete applications" on public.applications
  for delete to authenticated using (public.is_admin());

-- CVs: a private bucket. The server uploads; admins read through short-lived signed links.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cvs',
  'cvs',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

create policy "admins read cvs" on storage.objects
  for select to authenticated using (bucket_id = 'cvs' and public.is_admin());

create policy "admins delete cvs" on storage.objects
  for delete to authenticated using (bucket_id = 'cvs' and public.is_admin());

-- The roles listed on the site today (docs/content-brief.md), so nothing disappears on launch.
insert into public.roles (slug, title, department, location, terms, summary, status, sort) values
  ('ai-evaluator-biology', 'AI evaluator, Biology', 'AI evaluation', 'Remote', 'Hourly contract', 'Use your biology expertise to score and review AI model output.', 'open', 10),
  ('ai-evaluator-medical', 'AI evaluator, Medical', 'AI evaluation', 'Remote', 'Hourly contract', 'Use your medical expertise to score and review AI model output.', 'open', 20),
  ('ai-evaluator-financial', 'AI evaluator, Financial', 'AI evaluation', 'Remote', 'Hourly contract', 'Use your finance expertise to score and review AI model output.', 'open', 30),
  ('coding-expert-cpp', 'Coding expert, C++', 'Coding', 'Remote', 'Hourly contract', 'Review and evaluate C++ written by AI models.', 'open', 40),
  ('coding-expert-python', 'Coding expert, Python', 'Coding', 'Remote', 'Hourly contract', 'Review and evaluate Python written by AI models.', 'open', 50),
  ('bilingual-annotator-spanish-english', 'Bilingual annotator, Spanish/English', 'Data annotation', 'Remote', 'Hourly contract', 'Label and review Spanish and English data for AI training.', 'open', 60),
  ('bilingual-annotator-german-english', 'Bilingual annotator, German/English', 'Data annotation', 'Remote', 'Hourly contract', 'Label and review German and English data for AI training.', 'open', 70),
  ('robotics-data-collector', 'Robotics data collector', 'Robotics data collection', 'Multiple countries', 'Paid per accepted hour', 'Record real work, with consent, as training data for robots.', 'open', 80)
on conflict (slug) do nothing;
