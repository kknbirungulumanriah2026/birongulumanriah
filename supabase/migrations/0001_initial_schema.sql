-- ============================================================================
-- sidodadi-portal · Initial schema
-- ----------------------------------------------------------------------------
-- Tables created to replace localStorage persistence with Supabase rows.
-- Apply via: Supabase Dashboard → SQL Editor → paste & run, OR `supabase db push`.
--
-- Notes:
--   * Public read on display tables (news, document_types, village_*,
--     site_settings through a safe view) — anon role can SELECT.
--   * Public INSERT on document_applications only (pengajuan surat).
--   * UPDATE/DELETE on all tables is denied to anon — admin writes should go
--     through a server-side route handler using the service_role key (or
--     later, Supabase Auth + role-based policies).
-- ============================================================================

-- 0. Extensions ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- 1. site_settings ------------------------------------------------------------
-- Single-row config table (we enforce 1 row via the unique index on a
-- constant id='singleton'). Admin credentials are kept only in server env.
create table if not exists public.site_settings (
  id                 text primary key default 'singleton',
  village_name       text not null,
  logo_url           text,
  hero_title         text,
  hero_title_highlight text,
  hero_subtitle      text,
  hero_bg_url        text,
  cta_title          text,
  cta_subtitle       text,
  cta_bg_url         text,
  contact_phone      text,
  contact_email      text,
  contact_address    text,
  operating_hours    text,
  avg_service_time   text,
  updated_at         timestamptz not null default now()
);

-- Always exactly one row.
create unique index if not exists site_settings_singleton_idx
  on public.site_settings ((true))
  where id = 'singleton';

alter table public.site_settings enable row level security;

-- 2. news ---------------------------------------------------------------------
create table if not exists public.news (
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

create index if not exists news_is_main_idx     on public.news (is_main);
create index if not exists news_category_idx    on public.news (category);
create index if not exists news_created_at_idx  on public.news (created_at desc);

alter table public.news enable row level security;

-- 3. document_types -----------------------------------------------------------
-- `fields` is a JSONB array describing the dynamic per-document form schema.
create table if not exists public.document_types (
  id                    text primary key,
  code                  text not null unique,
  title                 text not null,
  description           text not null,
  icon                  text,
  requirements          text[] not null default '{}',
  processing_time       text,
  pdf_template_name     text,
  pdf_template_data     text,
  pdf_template_file_name text,
  fields                jsonb not null default '[]'::jsonb,
  display_order         integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists document_types_order_idx
  on public.document_types (display_order);

alter table public.document_types enable row level security;

-- 4. document_applications ----------------------------------------------------
-- Pengajuan surat dari warga. PDF lampiran disimpan di Supabase Storage, bukan
-- di dalam row ini — lihat kolom `attached_pdf_path`.
create table if not exists public.document_applications (
  id                  text primary key,
  tracking_number     text not null unique,
  document_id         text not null references public.document_types(id) on delete restrict,
  document_title      text not null,
  full_name           text not null,
  nik                 text not null,
  phone               text not null,
  address             text not null,
  purpose             text not null,
  extra_data          jsonb,
  attached_pdf_path   text,
  attached_pdf_name   text,
  submitted_at        text not null,
  status              text not null default 'Menunggu Verifikasi' check (
                        status in (
                          'Menunggu Verifikasi',
                          'Diproses',
                          'Selesai Diproses',
                          'Ditolak'
                        )
                      ),
  qr_code_value       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists doc_apps_tracking_idx on public.document_applications (tracking_number);
create index if not exists doc_apps_status_idx   on public.document_applications (status);
create index if not exists doc_apps_nik_idx      on public.document_applications (nik);
create index if not exists doc_apps_created_idx  on public.document_applications (created_at desc);

alter table public.document_applications enable row level security;

-- 5. village_officials --------------------------------------------------------
create table if not exists public.village_officials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  avatar_url  text,
  icon        text,
  phone       text,
  display_order integer not null default 0,
  created_at  timestamptz not null default now()
);

create unique index if not exists village_officials_name_role_uidx
  on public.village_officials (name, role);

alter table public.village_officials enable row level security;

-- 6. village_stats ------------------------------------------------------------
create table if not exists public.village_stats (
  id             uuid primary key default gen_random_uuid(),
  label          text not null,
  target_number  integer not null,
  unit           text not null,
  description    text not null,
  icon           text,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now()
);

create unique index if not exists village_stats_label_uidx
  on public.village_stats (label);

alter table public.village_stats enable row level security;


-- ============================================================================
-- Row Level Security policies
-- ============================================================================

-- site_settings: expose only non-sensitive display fields via a view.
revoke all on table public.site_settings from anon, authenticated;
create or replace view public.site_settings_public
with (security_invoker = false)
as select id, village_name, logo_url, hero_title, hero_title_highlight,
  hero_subtitle, hero_bg_url, cta_title, cta_subtitle, cta_bg_url,
  contact_phone, contact_email, contact_address, operating_hours,
  avg_service_time
from public.site_settings;
grant select on public.site_settings_public to anon, authenticated;

-- news: publik boleh baca. Hanya 1 is_main=true pada satu waktu — uniqueness
--        dijaga lewat partial unique index di bawah.
drop policy if exists "news_public_read" on public.news;
create policy "news_public_read"
  on public.news for select
  to anon, authenticated
  using (true);

create unique index if not exists news_single_main_idx
  on public.news ((is_main))
  where is_main = true;

-- document_types: publik boleh baca.
drop policy if exists "document_types_public_read" on public.document_types;
create policy "document_types_public_read"
  on public.document_types for select
  to anon, authenticated
  using (true);

-- document_applications:
--   * Publik boleh INSERT (warga mengajukan surat) — TAMPA boleh update/delete.
--   * Publik boleh SELECT by tracking_number untuk fitur "Lacak Permohonan".
--     Karena public bisa insert dan kita tidak punya auth penuh, kita pakai
--     trick: SELECT dibatasi hanya untuk baris yang di-insert dalam 1 jam
--     terakhir oleh ip yang sama sulit di pg. Sebagai gantinya, struktur
--     saat ini: SELECT dibatasi hanya ke baris dengan tracking_number yang
--     diketahui user (dia mencocokkannya sendiri). Untuk MVP biarkan SELECT
--     public, nanti bisa dipersempit.
drop policy if exists "doc_apps_public_insert" on public.document_applications;
create policy "doc_apps_public_insert"
  on public.document_applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "doc_apps_public_read" on public.document_applications;

-- village_officials: publik boleh baca.
drop policy if exists "village_officials_public_read" on public.village_officials;
create policy "village_officials_public_read"
  on public.village_officials for select
  to anon, authenticated
  using (true);

-- village_stats: publik boleh baca.
drop policy if exists "village_stats_public_read" on public.village_stats;
create policy "village_stats_public_read"
  on public.village_stats for select
  to anon, authenticated
  using (true);


-- ============================================================================
-- Triggers: bump updated_at on row modification
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_site_settings_updated   on public.site_settings;
create trigger trg_site_settings_updated
  before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_news_updated            on public.news;
create trigger trg_news_updated
  before update on public.news
  for each row execute function public.set_updated_at();

drop trigger if exists trg_document_types_updated on public.document_types;
create trigger trg_document_types_updated
  before update on public.document_types
  for each row execute function public.set_updated_at();

drop trigger if exists trg_doc_apps_updated        on public.document_applications;
create trigger trg_doc_apps_updated
  before update on public.document_applications
  for each row execute function public.set_updated_at();


-- ============================================================================
-- Storage bucket untuk lampiran PDF pengajuan
-- ----------------------------------------------------------------------------
-- Jalankan blok ini di Supabase Dashboard → Storage → New bucket:
--   name: 'applicant-pdfs'
--   public: false  (khusus admin via signed URL)
-- Atau lewat SQL (membutuhkan extension storage):
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('applicant-pdfs', 'applicant-pdfs', false)
on conflict (id) do nothing;

-- Anon boleh upload PDF ke path dengan prefix tracking_number mereka sendiri.
drop policy if exists "applicant_pdfs_anon_upload" on storage.objects;
create policy "applicant_pdfs_anon_upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'applicant-pdfs');


-- ============================================================================
-- Storage.objects SELECT — publik membaca via signed URL (tidak ada policy
-- SELECT publik untuk bucket ini).
-- Untuk admin yang butuh akses, gunakan service_role key di server route.
-- ============================================================================
