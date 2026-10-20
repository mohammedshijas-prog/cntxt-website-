-- Role-based access for the portal.
--   admin          everything, including the team
--   marketing      form submissions, blog, data requests, catalogue
--   hr_head        roles (full) and applications (full); can add recruiting managers
--   recruiter      applications (no delete); roles as drafts only

alter table public.admins
  add column if not exists role text not null default 'admin'
  check (role in ('admin', 'marketing', 'hr_head', 'recruiter'));

alter table public.admins add column if not exists name text;

-- The signed-in member's role, or null for anyone not on the list.
create or replace function public.portal_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admins
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  limit 1;
$$;

-- True when the signed-in member holds one of the given roles.
create or replace function public.has_role(allowed text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.portal_role() = any (allowed), false);
$$;

grant execute on function public.portal_role() to authenticated;
grant execute on function public.has_role(text[]) to authenticated;

-- ---------------------------------------------------------------- team list
drop policy if exists "admins read the allowlist" on public.admins;
create policy "members read the team" on public.admins
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------- marketing
drop policy if exists "admins read all posts" on public.posts;
drop policy if exists "admins write posts" on public.posts;
create policy "marketing reads all posts" on public.posts
  for select to authenticated using (public.has_role(array['admin', 'marketing']));
create policy "marketing writes posts" on public.posts
  for all to authenticated
  using (public.has_role(array['admin', 'marketing']))
  with check (public.has_role(array['admin', 'marketing']));

drop policy if exists "admins read submissions" on public.submissions;
drop policy if exists "admins update submissions" on public.submissions;
drop policy if exists "admins delete submissions" on public.submissions;
create policy "marketing reads submissions" on public.submissions
  for select to authenticated using (public.has_role(array['admin', 'marketing']));
create policy "marketing updates submissions" on public.submissions
  for update to authenticated
  using (public.has_role(array['admin', 'marketing']))
  with check (public.has_role(array['admin', 'marketing']));
create policy "marketing deletes submissions" on public.submissions
  for delete to authenticated using (public.has_role(array['admin', 'marketing']));

drop policy if exists "admins upload blog images" on storage.objects;
drop policy if exists "admins update blog images" on storage.objects;
drop policy if exists "admins delete blog images" on storage.objects;
create policy "marketing uploads blog images" on storage.objects
  for insert to authenticated with check (bucket_id = 'blog' and public.has_role(array['admin', 'marketing']));
create policy "marketing updates blog images" on storage.objects
  for update to authenticated using (bucket_id = 'blog' and public.has_role(array['admin', 'marketing']));
create policy "marketing deletes blog images" on storage.objects
  for delete to authenticated using (bucket_id = 'blog' and public.has_role(array['admin', 'marketing']));

drop policy if exists "admins read all datasets" on public.datasets;
drop policy if exists "admins write datasets" on public.datasets;
create policy "marketing reads all datasets" on public.datasets
  for select to authenticated using (public.has_role(array['admin', 'marketing']));
create policy "marketing writes datasets" on public.datasets
  for all to authenticated
  using (public.has_role(array['admin', 'marketing']))
  with check (public.has_role(array['admin', 'marketing']));

drop policy if exists "admins read dataset requests" on public.dataset_requests;
drop policy if exists "admins update dataset requests" on public.dataset_requests;
drop policy if exists "admins delete dataset requests" on public.dataset_requests;
create policy "marketing reads dataset requests" on public.dataset_requests
  for select to authenticated using (public.has_role(array['admin', 'marketing']));
create policy "marketing updates dataset requests" on public.dataset_requests
  for update to authenticated
  using (public.has_role(array['admin', 'marketing']))
  with check (public.has_role(array['admin', 'marketing']));
create policy "marketing deletes dataset requests" on public.dataset_requests
  for delete to authenticated using (public.has_role(array['admin', 'marketing']));

drop policy if exists "admins upload samples" on storage.objects;
drop policy if exists "admins update samples" on storage.objects;
drop policy if exists "admins delete samples" on storage.objects;
create policy "marketing uploads samples" on storage.objects
  for insert to authenticated with check (bucket_id = 'samples' and public.has_role(array['admin', 'marketing']));
create policy "marketing updates samples" on storage.objects
  for update to authenticated using (bucket_id = 'samples' and public.has_role(array['admin', 'marketing']));
create policy "marketing deletes samples" on storage.objects
  for delete to authenticated using (bucket_id = 'samples' and public.has_role(array['admin', 'marketing']));

-- ---------------------------------------------------------------- HR
drop policy if exists "admins read all roles" on public.roles;
drop policy if exists "admins write roles" on public.roles;
create policy "hr reads all roles" on public.roles
  for select to authenticated using (public.has_role(array['admin', 'hr_head', 'recruiter']));
create policy "hr adds roles" on public.roles
  for insert to authenticated with check (public.has_role(array['admin', 'hr_head', 'recruiter']));
create policy "hr edits roles" on public.roles
  for update to authenticated
  using (public.has_role(array['admin', 'hr_head', 'recruiter']))
  with check (public.has_role(array['admin', 'hr_head', 'recruiter']));
create policy "head of hr deletes roles" on public.roles
  for delete to authenticated using (public.has_role(array['admin', 'hr_head']));

-- Recruiting managers draft roles; only the head of HR (or an admin) opens or closes them.
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
  end if;
  return new;
end;
$$;

drop trigger if exists roles_status_guard on public.roles;
create trigger roles_status_guard before insert or update on public.roles
for each row execute function public.guard_role_status();

drop policy if exists "admins read applications" on public.applications;
drop policy if exists "admins update applications" on public.applications;
drop policy if exists "admins delete applications" on public.applications;
create policy "hr reads applications" on public.applications
  for select to authenticated using (public.has_role(array['admin', 'hr_head', 'recruiter']));
create policy "hr updates applications" on public.applications
  for update to authenticated
  using (public.has_role(array['admin', 'hr_head', 'recruiter']))
  with check (public.has_role(array['admin', 'hr_head', 'recruiter']));
create policy "head of hr deletes applications" on public.applications
  for delete to authenticated using (public.has_role(array['admin', 'hr_head']));

drop policy if exists "admins read cvs" on storage.objects;
drop policy if exists "admins delete cvs" on storage.objects;
create policy "hr reads cvs" on storage.objects
  for select to authenticated using (bucket_id = 'cvs' and public.has_role(array['admin', 'hr_head', 'recruiter']));
create policy "head of hr deletes cvs" on storage.objects
  for delete to authenticated using (bucket_id = 'cvs' and public.has_role(array['admin', 'hr_head']));
