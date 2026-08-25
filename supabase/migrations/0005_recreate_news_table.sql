-- Repair the news table.
--
-- The live table was created from an unrelated template (uuid id, slug,
-- author_id, is_published, published_at) and is EMPTY, while the app expects
-- text ids with category/date/snippet/image fields and an is_main flag.
-- This migration drops the drifted empty table and recreates it with the
-- schema used by the portal, including RLS public read and the single-main
-- partial unique index. Content is managed from the admin panel and stored
-- in Supabase — no seed rows.

drop table if exists public.news cascade;

create table public.news (
  id          text primary key,
  title       text not null,
  category    text not null check (
                category in (
                  'Agenda Nagori','Agenda Desa','Publik','UMKM','Transparansi'
                )
              ),
  date        text not null,
  snippet     text not null,
  content     text not null,
  image_url   text,
  image_alt   text,
  author      text,
  read_time   text,
  is_main     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index news_is_main_idx    on public.news (is_main);
create index news_category_idx   on public.news (category);
create index news_created_at_idx on public.news (created_at desc);

-- At most one featured news item at any time.
create unique index news_single_main_idx
  on public.news ((is_main))
  where is_main = true;

alter table public.news enable row level security;

drop policy if exists "news_public_read" on public.news;
create policy "news_public_read"
  on public.news for select
  to anon, authenticated
  using (true);
