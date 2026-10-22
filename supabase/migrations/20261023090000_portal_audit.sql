-- Portal activity log: who signed in, and who changed what. Admins read it;
-- nobody can edit or delete entries from the portal (no write policies).
create table if not exists public.portal_audit (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor text,
  action text not null,
  area text not null,
  target text,
  target_id text,
  detail jsonb not null default '{}'::jsonb,
  ip text,
  country text,
  device text
);
create index if not exists portal_audit_at_idx on public.portal_audit (at desc);
create index if not exists portal_audit_actor_idx on public.portal_audit (actor, at desc);
create unique index if not exists portal_audit_session_idx on public.portal_audit ((detail ->> 'session'), action)
  where action in ('signed in', 'access denied');

alter table public.portal_audit enable row level security;
revoke all on public.portal_audit from anon, authenticated;
grant select on public.portal_audit to authenticated;
drop policy if exists "admins read the activity log" on public.portal_audit;
create policy "admins read the activity log" on public.portal_audit
  for select to authenticated using (public.has_role(array['admin']));

-- Row changes made from the portal with a member's own login. Changes made by
-- the server (service role) are logged by the API route that made them.
create or replace function public.audit_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor text := lower(nullif(auth.jwt() ->> 'email', ''));
  old_row jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  new_row jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;
  row_data jsonb := coalesce(new_row, old_row);
  label text;
  changes jsonb := '{}'::jsonb;
  fields text[] := '{}';
  k text;
  -- Short values worth showing as before -> after; everything else is named only.
  shown text[] := array['status', 'title', 'slug', 'role', 'department', 'location', 'terms', 'category', 'kind', 'sort', 'published_at', 'name', 'fit_label'];
  hidden text[] := array['updated_at', 'created_at', 'value'];
begin
  if actor is null then
    return coalesce(new, old);
  end if;
  label := coalesce(row_data ->> 'title', row_data ->> 'name', row_data ->> 'email', row_data ->> 'slug', row_data ->> 'id');
  if tg_op = 'UPDATE' then
    for k in select jsonb_object_keys(new_row) loop
      continue when k = any (hidden);
      if (new_row -> k) is distinct from (old_row -> k) then
        if k = any (shown) then
          changes := changes || jsonb_build_object(k, jsonb_build_object('from', old_row -> k, 'to', new_row -> k));
        else
          fields := fields || k;
        end if;
      end if;
    end loop;
    if changes = '{}'::jsonb and cardinality(fields) = 0 then
      return new;
    end if;
  end if;
  insert into public.portal_audit (actor, action, area, target, target_id, detail)
  values (
    actor,
    case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'deleted' end,
    tg_table_name,
    left(label, 200),
    coalesce(row_data ->> 'id', row_data ->> 'email', row_data ->> 'name'),
    jsonb_strip_nulls(jsonb_build_object('changes', nullif(changes, '{}'::jsonb), 'fields', nullif(to_jsonb(fields), '[]'::jsonb)))
  );
  return coalesce(new, old);
end;
$$;
revoke all on function public.audit_row() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['applications', 'roles', 'posts', 'datasets', 'dataset_requests', 'submissions', 'admins', 'app_secrets'] loop
    execute format('drop trigger if exists audit_%1$s on public.%1$I', t);
    execute format('create trigger audit_%1$s after insert or update or delete on public.%1$I for each row execute function public.audit_row()', t);
  end loop;
end $$;
