-- AI fit check for applications: advice for HR, never a decision.
alter table public.applications
  add column if not exists fit_score integer check (fit_score between 0 and 100),
  add column if not exists fit_label text check (fit_label in ('strong', 'possible', 'weak')),
  add column if not exists fit_summary text,
  add column if not exists fit_strengths text[] not null default '{}',
  add column if not exists fit_gaps text[] not null default '{}',
  add column if not exists fit_questions text[] not null default '{}',
  add column if not exists fit_checked_at timestamptz,
  add column if not exists fit_error text;
