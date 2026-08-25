# Fix Admin Login Env

Tanggal: 2026-08-24

## Penyebab
Login admin dipindahkan dari passcode hardcoded client-side ke route server `/api/admin`. Route baru membutuhkan `ADMIN_PASSCODE` dan `ADMIN_SESSION_SECRET` di `.env.local`. File `.env.local` belum memiliki kedua key tersebut.

## Perubahan
- Menambahkan `ADMIN_PASSCODE` lokal.
- Menambahkan `ADMIN_SESSION_SECRET` acak untuk cookie session admin.

## Verifikasi
- `.env.local` sekarang memiliki `ADMIN_PASSCODE` dan `ADMIN_SESSION_SECRET` dengan panjang valid.
- `npx tsc --noEmit` berhasil.

## Catatan
Untuk operasi tulis admin ke Supabase, `SUPABASE_SERVICE_ROLE_KEY` tetap harus diisi di server.