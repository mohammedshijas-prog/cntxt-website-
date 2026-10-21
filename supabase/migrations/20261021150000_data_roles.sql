-- Data team roles for the catalogue.
--   data_head      catalogue (publish, delete) and dataset requests (full); can add data managers
--   data_manager   catalogue as drafts only, dataset requests (no delete)
-- Marketing keeps form submissions and the blog; the catalogue moves to the data team.

alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check
  check (role in ('admin', 'marketing', 'hr_head', 'recruiter', 'data_head', 'data_manager'));

drop policy if exists "marketing reads all datasets" on public.datasets;
drop policy if exists "marketing writes datasets" on public.datasets;
create policy "data team reads all datasets" on public.datasets
  for select to authenticated using (public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "data team adds datasets" on public.datasets
  for insert to authenticated with check (public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "data team edits datasets" on public.datasets
  for update to authenticated
  using (public.has_role(array['admin', 'data_head', 'data_manager']))
  with check (public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "head of data deletes datasets" on public.datasets
  for delete to authenticated using (public.has_role(array['admin', 'data_head']));

-- Data managers draft; only the head of data (or an admin) publishes or unpublishes.
create or replace function public.guard_dataset_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.portal_role() = 'data_manager' then
    if tg_op = 'INSERT' and new.status <> 'draft' then
      raise exception 'Only the head of data can publish a dataset. Save it as a draft.';
    end if;
    if tg_op = 'UPDATE' and new.status is distinct from old.status then
      raise exception 'Only the head of data can publish or unpublish a dataset.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists datasets_status_guard on public.datasets;
create trigger datasets_status_guard before insert or update on public.datasets
for each row execute function public.guard_dataset_status();

drop policy if exists "marketing reads dataset requests" on public.dataset_requests;
drop policy if exists "marketing updates dataset requests" on public.dataset_requests;
drop policy if exists "marketing deletes dataset requests" on public.dataset_requests;
create policy "data team reads dataset requests" on public.dataset_requests
  for select to authenticated using (public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "data team updates dataset requests" on public.dataset_requests
  for update to authenticated
  using (public.has_role(array['admin', 'data_head', 'data_manager']))
  with check (public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "head of data deletes dataset requests" on public.dataset_requests
  for delete to authenticated using (public.has_role(array['admin', 'data_head']));

drop policy if exists "marketing uploads samples" on storage.objects;
drop policy if exists "marketing updates samples" on storage.objects;
drop policy if exists "marketing deletes samples" on storage.objects;
create policy "data team uploads samples" on storage.objects
  for insert to authenticated with check (bucket_id = 'samples' and public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "data team updates samples" on storage.objects
  for update to authenticated using (bucket_id = 'samples' and public.has_role(array['admin', 'data_head', 'data_manager']));
create policy "head of data deletes samples" on storage.objects
  for delete to authenticated using (bucket_id = 'samples' and public.has_role(array['admin', 'data_head']));
