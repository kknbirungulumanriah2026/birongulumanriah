-- ============================================================================
-- sidodadi-portal · COMPLETE SCHEMA + SEED + VERIFICATION
-- ----------------------------------------------------------------------------
-- Single SQL block to bootstrap a fresh Supabase project for this portal.
--
-- How to apply
--   1. Open Supabase project → SQL Editor.
--   2. New query → paste this entire file → Run.
--   3. (Optional) Verify setup with the QUERY VERIFICATION block at end.
--
-- What this creates
--   * 6 tables (site_settings, news, document_types, document_applications,
--     village_officials, village_stats) with audit timestamps + indexes.
--   * 1 foreign key (document_applications.document_id → document_types.id).
--   * 1 partial unique index (news.is_main = true → at most 1 row).
--   * 1 unique index (village_stats.label + village_officials(name,role)).
--   * RLS: public SELECT on all display tables, public INSERT on
--     document_applications, all writes blocked for anon.
--   * 1 trigger (set_updated_at) on tables that need it.
--   * 1 storage bucket (applicant-pdfs, private) + anon upload policy.
--   * Seed data matching src/data/portalData.ts so the app feels identical.
--
-- Idempotent — re-running will not break existing data (uses ON CONFLICT /
-- CREATE OR REPLACE / IF NOT EXISTS).
-- ============================================================================


-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";


-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 site_settings -----------------------------------------------------------
-- Single-row, app-wide config. Admin credentials are server environment
-- variables and must never be stored in a publicly readable table.
create table if not exists public.site_settings (
  id                   text primary key default 'singleton',
  village_name         text not null,
  logo_url             text,
  hero_title           text,
  hero_title_highlight text,
  hero_subtitle        text,
  hero_bg_url          text,
  cta_title            text,
  cta_subtitle         text,
  cta_bg_url           text,
  contact_phone        text,
  contact_email        text,
  contact_address      text,
  operating_hours      text,
  footer_description   text,
  vision               text,
  mission              text,
  avg_service_time     text,
  updated_at           timestamptz not null default now()
);

-- Always exactly one row (uses partial unique index on a constant).
create unique index if not exists site_settings_singleton_idx
  on public.site_settings ((true))
  where id = 'singleton';

alter table public.site_settings enable row level security;

-- 1.1 admin_credentials ------------------------------------------------------
-- Server-only password hash. Never expose this table through the Data API.
create table if not exists public.admin_credentials (
  id            text primary key default 'singleton',
  password_hash text not null,
  password_salt text not null,
  updated_at    timestamptz not null default now()
);

create unique index if not exists admin_credentials_singleton_idx
  on public.admin_credentials ((true));

alter table public.admin_credentials enable row level security;
revoke all on table public.admin_credentials from anon, authenticated;
grant all on table public.admin_credentials to service_role;

-- 1.2 news --------------------------------------------------------------------
-- Landing page berita & agenda. Only one row can have is_main=true (the
-- featured card on the home page).
create table if not exists public.news (
  id          text primary key,
  title       text not null,
  category    text not null,
  date        text not null,
  snippet     text not null,
  content     text not null,
  image_url   text,
  image_alt   text,
  author      text,
  read_time   text,
  is_main     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint news_category_check check (
    category in ('Agenda Nagori','Agenda Desa','Publik','UMKM','Transparansi')
  )
);

create index if not exists news_category_idx    on public.news (category);
create index if not exists news_created_at_idx  on public.news (created_at desc);
create index if not exists news_is_main_idx     on public.news (is_main)
  where is_main = true;

alter table public.news enable row level security;

-- 1.3 document_types ----------------------------------------------------------
-- Schema-driven form configurations. `fields` is a JSONB array describing
-- the dynamic per-document form (matches DocumentType.fields in src/types.ts).
create table if not exists public.document_types (
  id                     text primary key,
  code                   text not null unique,
  title                  text not null,
  description            text not null,
  icon                   text,
  requirements           text[] not null default '{}',
  processing_time        text,
  pdf_template_name      text,
  pdf_template_data      text,
  pdf_template_file_name text,
  fields                 jsonb not null default '[]'::jsonb,
  display_order          integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists document_types_order_idx
  on public.document_types (display_order);

alter table public.document_types enable row level security;

-- 1.4 document_applications ---------------------------------------------------
-- Pengajuan surat dari warga. attached_pdf_path points to a private storage
-- bucket (applicant-pdfs); the row keeps only the path + original filename.
create table if not exists public.document_applications (
  id                  text primary key,
  tracking_number     text not null unique,
  document_id         text not null,
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
  status              text not null default 'Menunggu Verifikasi',
  qr_code_value       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint doc_apps_status_check check (
    status in (
      'Menunggu Verifikasi',
      'Diproses',
      'Selesai Diproses',
      'Ditolak'
    )
  ),
  -- FK: applicant → document schema. restrict (jangan bisa hapus jenis
  -- surat yang masih punya pengajuan).
  constraint doc_apps_document_id_fkey
    foreign key (document_id)
    references public.document_types(id)
    on delete restrict
    on update cascade
);

create index if not exists doc_apps_tracking_idx on public.document_applications (tracking_number);
create index if not exists doc_apps_status_idx   on public.document_applications (status);
create index if not exists doc_apps_nik_idx      on public.document_applications (nik);
create index if not exists doc_apps_created_idx  on public.document_applications (created_at desc);
create index if not exists doc_apps_doc_id_idx   on public.document_applications (document_id);

alter table public.document_applications enable row level security;

-- 1.5 village_officials -------------------------------------------------------
-- Aparat nagori. (name, role) is the natural key for the UI; id is internal.
create table if not exists public.village_officials (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null,
  avatar_url    text,
  icon          text,
  phone         text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create unique index if not exists village_officials_name_role_uidx
  on public.village_officials (name, role);

create index if not exists village_officials_order_idx
  on public.village_officials (display_order);

alter table public.village_officials enable row level security;

-- 1.6 village_stats -----------------------------------------------------------
-- Live counters on the home page. `label` is the natural key.
create table if not exists public.village_stats (
  id            uuid primary key default gen_random_uuid(),
  label         text not null,
  target_number integer not null,
  unit          text not null,
  description   text not null,
  icon          text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create unique index if not exists village_stats_label_uidx
  on public.village_stats (label);

create index if not exists village_stats_order_idx
  on public.village_stats (display_order);

alter table public.village_stats enable row level security;


-- ============================================================================
-- 2. PARTIAL UNIQUE INDEX — only one news row can be the main featured card
-- ============================================================================
create unique index if not exists news_single_main_idx
  on public.news ((is_main))
  where is_main = true;


-- ============================================================================
-- 3. ROW LEVEL SECURITY POLICIES
-- ----------------------------------------------------------------------------
-- Display tables: public SELECT (anon + authenticated).
-- document_applications: public INSERT only. Applicant records contain
-- personal data and must not be readable by anonymous users.
-- Every other write is blocked for anon — admin writes must go through the
-- /api/admin route handler with the service-role key.
-- ============================================================================

-- 3.1 site_settings -----------------------------------------------------------
-- Public access goes through a credential-free view.
revoke all on table public.site_settings from anon, authenticated;
create or replace view public.site_settings_public
with (security_invoker = false)
as select id, village_name, logo_url, hero_title, hero_title_highlight,
  hero_subtitle, hero_bg_url, cta_title, cta_subtitle, cta_bg_url,
  contact_phone, contact_email, contact_address, operating_hours,
  avg_service_time, footer_description, vision, mission
from public.site_settings;
grant select on public.site_settings_public to anon, authenticated;

-- 3.2 news --------------------------------------------------------------------
drop policy if exists "news_public_read" on public.news;
create policy "news_public_read"
  on public.news for select
  to anon, authenticated
  using (true);

-- 3.3 document_types ----------------------------------------------------------
drop policy if exists "document_types_public_read" on public.document_types;
create policy "document_types_public_read"
  on public.document_types for select
  to anon, authenticated
  using (true);

-- 3.4 document_applications ---------------------------------------------------
drop policy if exists "doc_apps_public_insert" on public.document_applications;
create policy "doc_apps_public_insert"
  on public.document_applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "doc_apps_public_read" on public.document_applications;

-- 3.5 village_officials -------------------------------------------------------
drop policy if exists "village_officials_public_read" on public.village_officials;
create policy "village_officials_public_read"
  on public.village_officials for select
  to anon, authenticated
  using (true);

-- 3.6 village_stats -----------------------------------------------------------
drop policy if exists "village_stats_public_read" on public.village_stats;
create policy "village_stats_public_read"
  on public.village_stats for select
  to anon, authenticated
  using (true);


-- ============================================================================
-- 4. TRIGGER — bump updated_at on every UPDATE
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

drop trigger if exists trg_site_settings_updated on public.site_settings;
create trigger trg_site_settings_updated
  before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_news_updated on public.news;
create trigger trg_news_updated
  before update on public.news
  for each row execute function public.set_updated_at();

drop trigger if exists trg_document_types_updated on public.document_types;
create trigger trg_document_types_updated
  before update on public.document_types
  for each row execute function public.set_updated_at();

drop trigger if exists trg_doc_apps_updated on public.document_applications;
create trigger trg_doc_apps_updated
  before update on public.document_applications
  for each row execute function public.set_updated_at();


-- ============================================================================
-- 5. STORAGE BUCKET — applicant-pdfs (private)
-- ----------------------------------------------------------------------------
-- Used for PDF lampiran on pengajuan surat. Public cannot SELECT; readers
-- must use signed URLs issued server-side.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('applicant-pdfs', 'applicant-pdfs', false)
on conflict (id) do nothing;

drop policy if exists "applicant_pdfs_anon_upload" on storage.objects;
create policy "applicant_pdfs_anon_upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'applicant-pdfs');


-- ============================================================================
-- 6. SEED DATA
-- ----------------------------------------------------------------------------
-- Mirrors src/data/portalData.ts so the app behaves the same after migrate.
-- ============================================================================

-- 6.1 site_settings -----------------------------------------------------------
insert into public.site_settings (
  id, village_name, logo_url,
  hero_title, hero_title_highlight, hero_subtitle, hero_bg_url,
  cta_title, cta_subtitle, cta_bg_url,
  contact_phone, contact_email, contact_address,
  operating_hours, footer_description, vision, mission, avg_service_time
) values (
  'singleton',
  'Nagori Birong Ulu Manriah',
  '/birong.png',
  'Nagori', 'Birong Ulu Manriah.',
  'Kec. Sidamanik Kab. Simalungun',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWrSQUgbH4e43Q2PHITUQivqQqP0LcOT-FVpUnc_ncoxrII_2HvNGTiUcPo6cAS6T2EIOpIwHtIwfAhkpyi0xvd_4j1pzbjwyg3u6_aq5jQzqyhiH3ia_4WFRGoPjMEibMmTEou6DumEaRJVdPPi3YAD6iBQlLb_lpV2nr8_i1U9OgHJii8DCBVf5PeX4IBXXKGdgNqGvTUM-UV0Ov0MsKofmfJHAF85KTB3IdN5tkFW8rhPOjQrUG',
  'Siap Memulai Administrasi Anda Hari Ini?',
  'Tak perlu lagi mengantre lama. Akses seluruh layanan Nagori Birong Ulu Manriah secara mandiri, transparan, dan terpercaya kapan pun Anda membutuhkannya.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBk67yMeOQp5KN7cPcFd7WDtD3X5wY04bacNlsI5g0HRwDI6RkDqofd88QpcNiXSsjlNrfERi7iiPbSSHhBi0L21AL-usR-iOtJAtshi9-nGEOz2sLgt1O1b4TRenM7M0SQpnP4reLPBS87dqyvct3g8gnEOA2NpntffAg27Opef6Kis_OssnHNtjdc-GuWyzpbeQP_TGsS6EYp1sKPzQBR1h8I4youtAfHcNjVtO33hfMUeUMe2Rsa',
  '0812-3456-7890',
  'birongulumanriah@desa.go.id',
  'Jl. Raya Nagori No. 12',
  'Senin - Jumat, 09:00 - 15:00 WIB',
  'Melayani warga dengan transparansi, kemudahan, dan ketulusan hati demi kemajuan Nagori Birong Ulu Manriah yang mandiri dan sejahtera.',
  'Mewujudkan Nagori Birong Ulu Manriah yang Mandiri, Sejahtera, Berkarakter Budaya, dan Terdepan dalam Pelayanan Digital Publik.',
  'Transparansi tata kelola\nPemberdayaan ekonomi masyarakat\nInformasi publik terbuka dan layanan mandiri digital',
  '15'
)
on conflict (id) do update set
  village_name         = excluded.village_name,
  logo_url             = excluded.logo_url,
  hero_title           = excluded.hero_title,
  hero_title_highlight = excluded.hero_title_highlight,
  hero_subtitle        = excluded.hero_subtitle,
  hero_bg_url          = excluded.hero_bg_url,
  cta_title            = excluded.cta_title,
  cta_subtitle         = excluded.cta_subtitle,
  cta_bg_url           = excluded.cta_bg_url,
  contact_phone        = excluded.contact_phone,
  contact_email        = excluded.contact_email,
  contact_address      = excluded.contact_address,
  operating_hours      = excluded.operating_hours,
  footer_description   = excluded.footer_description,
  vision              = excluded.vision,
  mission             = excluded.mission,
  avg_service_time     = excluded.avg_service_time;

-- 6.2 news --------------------------------------------------------------------
insert into public.news
  (id, title, category, date, snippet, content, image_url, image_alt, author, read_time, is_main)
values
(
  'news-1',
  'Panen Raya 2024: Meningkatkan Ketahanan Pangan Melalui Perkebunan & Pertanian Organik',
  'Agenda Nagori',
  '12 Oktober 2024',
  'Keberhasilan panen tahun ini menjadi bukti nyata bahwa kolaborasi antara tradisi bertani dan teknologi modern mampu meningkatkan hasil produksi...',
  'Keberhasilan panen tahun ini menjadi bukti nyata bahwa kolaborasi antara tradisi bertani dan teknologi irigasi modern mampu meningkatkan hasil produksi hingga 30%. Kegiatan panen raya di area Nagori Birong Ulu Manriah dihadiri oleh Pangulu Nagori, jajaran perangkat Nagori, serta kelompok tani masyarakat Sidamanik.

Dengan penerapan pupuk organik terpadu dan pengelolaan lahan berkelanjutan, hasil komoditas unggulan Nagori Birong Ulu Manriah seperti Teh, Kopi, dan Padi Simalungun dipasarkan secara langsung melalui pasar lokal dan koperasi Nagori.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlR9o1PFgwYe39Xt77Ofu7XYQ6e0zN1QR74G54AMPMvJQdaf8Lie0-PLFQT65zc48hrwSJigHJBPYZ0S65BYDqfWuKENiIQ7wuaPmg3jS9ml0lxuW5MMSAYmlx1gqYdsSKGKg9urppot_ZsXLU2zeMp6o5mGz8LqGm3HaCc-eMvEsgyvzCN-dbaWxpNTYj_otMAnCyjcm9tRkezTgwtu4uSO5Zxx3PtN3_haxz9lJ61s1PYrYPHYpD',
  'Petani dan warga panen raya bersama',
  'Tim Humas Nagori', '3 min', true
),
(
  'news-2',
  'Peresmian Pojok Digital Nagori Birong Ulu Manriah untuk Layanan Publik',
  'Publik',
  '08 Oktober 2024',
  'Fasilitas baru untuk mendukung warga belajar teknologi digital dan mengajukan surat administrasi secara cepat.',
  'Pemerintah Nagori Birong Ulu Manriah resmi membuka fasilitas Pojok Digital Nagori yang berlokasi di Kantor Pangulu. Fasilitas ini dilengkapi dengan perangkat cetak mandiri dan koneksi internet publik berkecepatan tinggi, serta pendampingan bagi lansia maupun warga yang membutuhkan bantuan administrasi.

Pojok Digital ini bertujuan agar seluruh masyarakat Nagori Birong Ulu Manriah, Kecamatan Sidamanik, dapat mengakses portal permohonan surat mandiri, cek bansos, dan pendaftaran UMKM lokal.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6pELdpEWivibGK_BqfFRRioHJV2dkhMC7t1sg8cqN4o1TyYmJXxH68yf2nI7AJGT5EG0gnuJqM-W6ZDIGkrDUnsGLIT3W8vzlpow7U2FbquqmY77vz3Kz_5Colv7kOJEmuA9kyD3cHmedu4MzZaQmRH4QKnSegamdOZ4uYOz0rR3oEFvAGlqyeXmzVfs1l2ucwV86jXgsdjENmJKl1nn8BUdU2TcmSARvbKzNY-xR2Z84Jelb7Ws_',
  'Lansia dan petugas menggunakan mesin kiosk digital',
  'Admin Sekretariat Nagori', '2 min', false
),
(
  'news-3',
  'Peluncuran Katalog Produk Unggulan UMKM Nagori Birong Ulu Manriah',
  'UMKM',
  '05 Oktober 2024',
  'Memperluas jangkauan pasar lokal ke kancah kabupaten dan provinsi melalui pendampingan usaha.',
  'Pelaku UMKM binaan Nagori Birong Ulu Manriah kini terdaftar dalam Katalog Produk Digital Unggulan. Produk yang ditawarkan melingkupi Olahan Teh Sidamanik, Kerajinan Tangan Simalungun, Kopi Sangrai Lokal, dan Kuliner Khas Daerah.

Melalui katalog terpadu ini, para pengrajin dan pengusaha lokal mendapatkan fasilitas promosi serta pendaftaran legalitas NIB secara gratis.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8xdjtCuyof9asQKyKN8MB39PIPCS8lnztx724k4VQwyOencPWx38UShK9PkyiiPur7IWQVBOA71MKOIxIcMDpm7SxKTL4V7zbychIa4kUNqiLkDMfbVdQ_031kdxDN1g211PJ37N2e1B0vRmZtZwT7GMPVgIV4XF3ZmzNN7bDPESQjR_FKJDrS5XATI2lvaEBF4reH8ql3LSqDbgRyL5MC0xWcy464L8_iQ9aIF5drPdeaCjflU-5',
  'Produk khas UMKM Nagori',
  'Pendamping UMKM', '4 min', false
),
(
  'news-4',
  'Laporan Transparansi Dana Nagori Periode Kuartal III',
  'Transparansi',
  '01 Oktober 2024',
  'Komitmen keterbukaan informasi dan akuntabilitas publik pengelolaan anggaran Nagori Birong Ulu Manriah.',
  'Melanjutkan prinsip transparansi publik, Pemerintah Nagori Birong Ulu Manriah mempublikasikan Laporan Realisasi Anggaran Pendapatan dan Belanja Nagori (APBNag) Kuartal III Tahun Anggaran 2024.

Realisasi penggunaan anggaran Nagori difokuskan pada:
1. Pembangunan Jalan Usaha Tani & Perkebunan: Rp 185.000.000
2. Pemeliharaan Posyandu & Kesehatan Ibu-Anak: Rp 64.000.000
3. Pengembangan Sistem Portal Nagori Digital: Rp 35.000.000
4. Bantuan Langsung Tunai (BLT) Nagori: Rp 120.000.000

Masyarakat dapat mengunduh dokumen laporan keuangan lengkap berformat PDF melalui menu Transparansi.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkTvn_qJuevS8YQx7pIOWbRCReucv6GlWxDbVw-hqV4dzYnxy9rlMmjAnlJVe7a1tcgPvT6u1MDjHigZgxVAK8yU1SzwmZCIM2a4Izep1i1Kd8_k9k-KDwYtFyJwNIXYjnuWkCvKykcccWAlJL4ge3k2AVfHaMJC9p3r-30u4hEgZn3smEMnowCA2szxCBdMAUTCkEqVQnrWHjwviXADPwIWX9yLfD6aJKr16ag18lbyABRnwzd6Cw',
  'Grafik laporan data transparansi anggaran Nagori',
  'Kaur Keuangan Nagori', '3 min', false
)
on conflict (id) do nothing;

-- 6.3 document_types ----------------------------------------------------------
insert into public.document_types
  (id, code, title, description, icon, requirements, processing_time, fields, display_order)
values
(
  'sku',
  'SK-01',
  'Surat Keterangan Usaha (SKU)',
  'Dokumen bukti legalitas usaha lokal bagi pelaku UMKM atau pedagang warga Nagori.',
  'storefront',
  array['KTP Pemohon (Asli & Fotokopi)','Kartu Keluarga (KK)','Foto Tempat Usaha'],
  '15 Menit',
  '[
    {"name":"namaUsaha","label":"Nama Usaha / Toko","type":"text","placeholder":"Contoh: Kedai Kopi Sidamanik / Toko Sembako","required":true},
    {"name":"bidangUsaha","label":"Bidang Usaha","type":"select","options":["Perdagangan / Kuliner","Pertanian / Perkebunan","Kerajinan / Industri Rumah Tangga","Jasa & Perbaikan","Lainnya"],"required":true},
    {"name":"alamatUsaha","label":"Alamat Lokasi Usaha","type":"textarea","placeholder":"RT/RW & Huta tempat usaha berada","required":true},
    {"name":"tahunMulai","label":"Tahun Berdiri Usaha","type":"number","placeholder":"2021","required":true}
  ]'::jsonb,
  0
),
(
  'skdom',
  'SK-02',
  'Surat Keterangan Domisili',
  'Surat resmi menerangkan status tempat tinggal warga atau badan usaha di wilayah Nagori.',
  'home_pin',
  array['KTP Pemohon','Kartu Keluarga (KK)','Surat Pengantar Gamot / RT'],
  '10 Menit',
  '[
    {"name":"statusTempatTinggal","label":"Status Tempat Tinggal","type":"select","options":["Milik Sendiri","Sewa / Kontrak","Ikut Orang Tua","Lainnya"],"required":true},
    {"name":"lamaTinggal","label":"Lama Tinggal (Tahun)","type":"number","placeholder":"5","required":true},
    {"name":"alasanDomisili","label":"Keperluan Surat","type":"text","placeholder":"Contoh: Persyaratan Buka Rekening Bank / Melamar Kerja","required":true}
  ]'::jsonb,
  1
),
(
  'sktm',
  'SK-03',
  'Surat Keterangan Tidak Mampu (SKTM)',
  'Surat permohonan pengajuan bantuan pendidikan, beasiswa, kesehatan, atau fasilitas sosial.',
  'volunteer_activism',
  array['KTP Orang Tua / Wali','Kartu Keluarga (KK)','Kartu BPJS / KIS (Jika Ada)'],
  '15 Menit',
  '[
    {"name":"namaAnak","label":"Nama Anak / Penerima Manfaat","type":"text","required":false},
    {"name":"sekolahInstansi","label":"Nama Sekolah / Rumah Sakit / Instansi Tujuan","type":"text","placeholder":"Contoh: SMA Negeri Sidamanik / RSUD Simalungun","required":true},
    {"name":"pekerjaanKepalaKeluarga","label":"Pekerjaan Kepala Keluarga","type":"text","placeholder":"Contoh: Petani / Buruh Kebun","required":true}
  ]'::jsonb,
  2
),
(
  'skck',
  'SK-04',
  'Surat Pengantar SKCK',
  'Surat pengantar Nagori untuk pembuatan Catatan Kepolisian di Polsek Sidamanik / Polres Simalungun.',
  'verified_user',
  array['KTP Pemohon','Kartu Keluarga (KK)','Pas Foto 4x6 Background Merah'],
  '10 Menit',
  '[
    {"name":"keperluanSkck","label":"Tujuan Pembuatan SKCK","type":"text","placeholder":"Contoh: Melamar Pekerjaan / Pendaftaran BUMN","required":true},
    {"name":"instansiTujuan","label":"Tujuan Instansi/Perusahaan","type":"text","placeholder":"Contoh: Polsek Sidamanik / Polres Simalungun","required":true}
  ]'::jsonb,
  3
),
(
  'sktik',
  'SK-05',
  'Surat Keterangan Beda Nama / Ijazah',
  'Surat penjelas perbedaan ejaan nama di KTP, KK, Akta Kelahiran, atau Ijazah.',
  'badge',
  array['KTP','KK','Akta / Ijazah yang Berbeda'],
  '15 Menit',
  '[
    {"name":"namaDokumenA","label":"Nama Tertulis di KTP / KK","type":"text","placeholder":"Sesuai KTP","required":true},
    {"name":"namaDokumenB","label":"Nama Tertulis di Ijazah / Akta","type":"text","placeholder":"Sesuai Ijazah","required":true},
    {"name":"nomorDokumenAcuan","label":"Nomor Dokumen Acuan","type":"text","placeholder":"No. Ijazah / Akta Kelahiran","required":true}
  ]'::jsonb,
  4
)
on conflict (id) do nothing;

-- 6.4 village_officials -------------------------------------------------------
insert into public.village_officials (name, role, icon, phone, display_order) values
  ('Pangulu Nagori',    'Pangulu Nagori Birong Ulu Manriah', 'person', '0812-3456-7890', 0),
  ('Sekretaris Nagori', 'Sekretaris Nagori (Seknag)',        'person', '0812-9876-5432', 1),
  ('Kaur Keuangan',     'Kaur Keuangan & Perencanaan',       'person', '0813-1122-3344', 2),
  ('Kasi Pelayanan',    'Kasi Pelayanan & Kesejahteraan',    'person', '0814-5566-7788', 3)
on conflict (name, role) do nothing;

-- 6.5 village_stats -----------------------------------------------------------
insert into public.village_stats (label, target_number, unit, description, icon, display_order) values
  ('Populasi Nagori',   4820, '+',    'Jiwa terdata secara realtime',          'groups',                   0),
  ('Luas Wilayah',      1250, 'ha',   'Lahan perkebunan & pemukiman',          'landscape',                1),
  ('UMKM Aktif',          84, 'Unit', 'Pendorong ekonomi lokal',               'store',                    2),
  ('Indeks Kepuasan',     98, '%',    'Pelayanan publik prima',                'sentiment_very_satisfied', 3)
on conflict (label) do nothing;


-- ============================================================================
-- 7. QUERY VERIFICATION (run manually to confirm setup)
-- ----------------------------------------------------------------------------
-- Uncomment to verify after running this file.
-- ============================================================================

-- select 'site_settings'       as table_name, count(*) from public.site_settings
-- union all select 'news',                  count(*) from public.news
-- union all select 'document_types',        count(*) from public.document_types
-- union all select 'document_applications', count(*) from public.document_applications
-- union all select 'village_officials',     count(*) from public.village_officials
-- union all select 'village_stats',         count(*) from public.village_stats;

-- select
--   conname  as constraint_name,
--   conrelid::regclass as table_name,
--   pg_get_constraintdef(oid) as definition
-- from pg_constraint
-- where conrelid::regclass::text like 'public.%'
--   and contype = 'f'
-- order by table_name;

-- select bucket_id, name, public from storage.buckets where id = 'applicant-pdfs';
