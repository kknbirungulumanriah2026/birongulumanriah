-- ============================================================================
-- sidodadi-portal · DROP EVERYTHING
-- ----------------------------------------------------------------------------
-- ⚠️  DESTROYS ALL DATA. Drops tables, policies, triggers, function, bucket.
-- Use this to start fresh, then re-run schema.sql.
-- ============================================================================

-- Drop policies first (they depend on tables existing).
drop policy if exists "site_settings_public_read"       on public.site_settings;
drop policy if exists "news_public_read"                on public.news;
drop policy if exists "document_types_public_read"      on public.document_types;
drop policy if exists "doc_apps_public_read"            on public.document_applications;
drop policy if exists "doc_apps_public_insert"          on public.document_applications;
drop policy if exists "village_officials_public_read"   on public.village_officials;
drop policy if exists "village_stats_public_read"       on public.village_stats;
drop policy if exists "applicant_pdfs_anon_upload"      on storage.objects;

-- Drop triggers.
drop trigger if exists trg_site_settings_updated   on public.site_settings;
drop trigger if exists trg_news_updated            on public.news;
drop trigger if exists trg_document_types_updated  on public.document_types;
drop trigger if exists trg_doc_apps_updated        on public.document_applications;

-- Drop tables (CASCADE handles the FK from document_applications).
drop table if exists public.document_applications cascade;
drop table if exists public.document_types        cascade;
drop table if exists public.news                  cascade;
drop table if exists public.village_officials     cascade;
drop table if exists public.village_stats         cascade;
drop table if exists public.site_settings         cascade;

-- Drop the shared trigger function.
drop function if exists public.set_updated_at();

-- Drop storage bucket (CASCADE also removes the objects inside).
delete from storage.buckets where id = 'applicant-pdfs';