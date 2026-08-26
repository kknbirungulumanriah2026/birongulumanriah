# Enable Password Change

- Menambahkan form penggantian password pada halaman Keamanan Admin.
- Password baru diverifikasi dan di-hash server-side menggunakan scrypt + salt acak.
- Menambahkan endpoint `change_password` pada `/api/admin` dan sesi baru tetap aktif setelah berhasil.
- Menambahkan tabel privat `admin_credentials` pada migration `0006_admin_credentials.sql` dan `supabase/schema.sql`.
- Login tetap memakai `ADMIN_PASSCODE` sebagai fallback sampai migration diterapkan.
- Validasi: `npx tsc --noEmit`, `git diff --check`, dan `npm run build` berhasil.
- Deployment Supabase belum memiliki tabel `admin_credentials`; setelah pengecekan, endpoint memberi status 503 dengan instruksi migration yang jelas.
- Dev server dipulihkan dari cache bersih; `/` dan `/admin/security` kembali HTTP 200.
