-- Server-only settings (for example the Anthropic API key the portal uses to draft roles).
-- Row-level security is on with no policies: no browser role can read or write it.
-- Only the server, with the service key, touches this table.
create table if not exists public.app_secrets (
  name text primary key,
  value text not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;
