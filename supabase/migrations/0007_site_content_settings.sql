    alter table public.site_settings add column if not exists footer_description text;
    alter table public.site_settings add column if not exists vision text;
    alter table public.site_settings add column if not exists mission text;

    update public.site_settings
    set footer_description = coalesce(footer_description, 'Melayani warga dengan transparansi, kemudahan, dan ketulusan hati demi kemajuan Nagori Birong Ulu Manriah yang mandiri dan sejahtera.'),
        vision = coalesce(vision, 'Mewujudkan Nagori Birong Ulu Manriah yang Mandiri, Sejahtera, Berkarakter Budaya, dan Terdepan dalam Pelayanan Digital Publik.'),
        mission = coalesce(mission, 'Transparansi tata kelola\nPemberdayaan ekonomi masyarakat\nInformasi publik terbuka dan layanan mandiri digital'),
        contact_address = case when contact_address is null or contact_address = '' or contact_address like 'Nagori Birong Ulu Manriah, Kec. Sidamanik%' then 'Jl. Raya Nagori No. 12' else contact_address end,
        contact_email = case when contact_email is null or contact_email = '' or contact_email = 'halo@birongulumanriah.desa.id' then 'birongulumanriah@desa.go.id' else contact_email end,
        operating_hours = case when operating_hours is null or operating_hours = '' or operating_hours = 'Senin - Jumat | 08:00 - 15:30 WIB' then 'Senin - Jumat, 09:00 - 15:00 WIB' else operating_hours end
    where id = 'singleton';

    create or replace view public.site_settings_public
    with (security_invoker = false)
    as
    select id, village_name, logo_url, hero_title, hero_title_highlight,
    hero_subtitle, hero_bg_url, cta_title, cta_subtitle, cta_bg_url,
    contact_phone, contact_email, contact_address, operating_hours,
    avg_service_time, footer_description, vision, mission
    from public.site_settings;

    grant select on public.site_settings_public to anon, authenticated;