-- Store the admin password as a server-only scrypt hash.
create table if not exists public.admin_credentials (
  id text primary key default 'singleton',
  password_hash text not null,
  password_salt text not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists admin_credentials_singleton_idx
  on public.admin_credentials ((true));

alter table public.admin_credentials enable row level security;
revoke all on table public.admin_credentials from anon, authenticated;
grant all on table public.admin_credentials to service_role;