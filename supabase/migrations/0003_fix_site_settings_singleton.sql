-- Repair drifted site_settings setup so the admin "Banner & Landing Page"
-- panel can read and write through Supabase again.
--
-- Fixes
--   1. Normalizes the single site_settings row id to 'singleton'
--      (existing row was created with a UUID id, which breaks the app's
--      singleton upsert and lookup).
--   2. Recreates the site_settings_public view for anonymous reads
--      (missing from the database; 0002 apparently was never applied).
-- Idempotent — safe to run multiple times.

update public.site_settings
   set id = 'singleton'
 where id <> 'singleton';

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
