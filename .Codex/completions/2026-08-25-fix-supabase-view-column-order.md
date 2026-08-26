# Fix Supabase View Column Order

- Memperbaiki migration `0007_site_content_settings.sql` agar kolom lama view tetap dalam urutan asli.
- Field `footer_description`, `vision`, dan `mission` kini ditambahkan setelah `avg_service_time`.
- Menyelaraskan `supabase/schema.sql`.
- `git diff --check` berhasil.
