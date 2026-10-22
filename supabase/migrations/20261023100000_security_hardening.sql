-- Security review, 23 Oct 2026.

-- 1. Drafts-only roles can't edit live content. A recruiter can only change
--    draft roles; a data manager can only change draft datasets.
create or replace function public.guard_role_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.portal_role() = 'recruiter' then
    if tg_op = 'INSERT' and new.status <> 'draft' then
      raise exception 'Only the head of HR can open a role. Save it as a draft.';
    end if;
    if tg_op = 'UPDATE' and new.status is distinct from old.status then
      raise exception 'Only the head of HR can open or close a role.';
    end if;
    if tg_op = 'UPDATE' and old.status <> 'draft' then
      raise exception 'This role is live. Ask the head of HR to edit it, or to move it back to draft.';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.guard_dataset_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Samples must be files in our own storage, never a link to another site.
  if new.sample_url is not null and new.sample_url !~ '^https://teohvkusixcmwozsfqyv\.supabase\.co/storage/v1/object/public/samples/' then
    raise exception 'Upload the sample file instead of linking to another site.';
  end if;
  if public.portal_role() = 'data_manager' then
    if tg_op = 'INSERT' and new.status <> 'draft' then
      raise exception 'Only the head of data can publish a dataset. Save it as a draft.';
    end if;
    if tg_op = 'UPDATE' and new.status is distinct from old.status then
      raise exception 'Only the head of data can publish or unpublish a dataset.';
    end if;
    if tg_op = 'UPDATE' and old.status <> 'draft' then
      raise exception 'This dataset is live. Ask the head of data to edit it, or to move it back to draft.';
    end if;
  end if;
  return new;
end;
$$;

-- 2. One report at a time: a run claims a lock first, so parallel requests
--    can't each start a paid run.
create table if not exists public.job_locks (
  name text primary key,
  started_at timestamptz not null default now()
);
alter table public.job_locks enable row level security;
revoke all on public.job_locks from anon, authenticated;

create or replace function public.claim_job(job text, ttl_minutes int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare claimed int;
begin
  insert into public.job_locks (name, started_at) values (job, now())
  on conflict (name) do update set started_at = now()
    where public.job_locks.started_at < now() - make_interval(mins => ttl_minutes);
  get diagnostics claimed = row_count;
  return claimed > 0;
end;
$$;
revoke all on function public.claim_job(text, int) from public, anon, authenticated;
grant execute on function public.claim_job(text, int) to service_role;

-- 3. AI fit checks flag text that tries to steer the model.
alter table public.applications add column if not exists fit_flag text;

-- 4. Lint: pin search_path on the timestamp helper.
alter function public.touch_updated_at() set search_path = public;
