# Fix Hero Title

Tanggal: 2026-08-24

## Perubahan
- Mengubah default Hero menjadi `Nagori` + `Birong Ulu Manriah.` dan subtitle `Kec. Sidamanik Kab. Simalungun`.
- Menyamakan seed/schema Supabase agar reset database tidak mengembalikan teks lama.
- Menambahkan guard legacy di repository agar data Supabase lama yang masih berisi copy default lama otomatis tampil sebagai teks Hero baru.
- Membersihkan metadata lama di `app/layout.tsx`.

## Verifikasi
- `npx tsc --noEmit` berhasil.