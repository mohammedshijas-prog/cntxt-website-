-- Featured roles show first on /careers. Only admins and the head of HR choose them.
alter table public.roles add column if not exists featured boolean not null default false;

create or replace function public.guard_role_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.portal_role() = 'recruiter' then
    if tg_op = 'INSERT' and (new.status <> 'draft' or new.featured) then
      raise exception 'Only the head of HR can open or feature a role. Save it as a draft.';
    end if;
    if tg_op = 'UPDATE' and (new.status is distinct from old.status or new.featured is distinct from old.featured) then
      raise exception 'Only the head of HR can open, close or feature a role.';
    end if;
    if tg_op = 'UPDATE' and old.status <> 'draft' then
      raise exception 'This role is live. Ask the head of HR to edit it, or to move it back to draft.';
    end if;
  end if;
  return new;
end;
$$;

-- A starting set; HR changes it from the portal.
update public.roles set featured = true where slug in (
  'lead-machine-learning-engineer', 'lead-robotics-engineer', 'lead-security-engineer',
  'senior-product-designer', 'robotics-data-collector', 'vision-language-action-annotator'
);
