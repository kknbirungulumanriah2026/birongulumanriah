-- Remove the admin credential from all public Supabase reads.
-- Apply this after 0001_initial_schema.sql on existing projects.

drop policy if exists "site_settings_public_read" on public.site_settings;
revoke all on table public.site_settings from anon, authenticated;

create or replace view public.site_settings_public
with (security_invoker = false)
as
select
  id,
  village_name,
  logo_url,
  hero_title,
  hero_title_highlight,
  hero_subtitle,
  hero_bg_url,
  cta_title,
  cta_subtitle,
  cta_bg_url,
  contact_phone,
  contact_email,
  contact_address,
  operating_hours,
  avg_service_time
from public.site_settings;

grant select on public.site_settings_public to anon, authenticated;

-- Applicant records contain NIK, contact and address details. Public users
-- may submit an application but must never list application records.
drop policy if exists "doc_apps_public_read" on public.document_applications;
