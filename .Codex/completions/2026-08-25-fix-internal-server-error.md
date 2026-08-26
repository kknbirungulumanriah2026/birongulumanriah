# Fix Internal Server Error

- Menambahkan `Suspense` boundary pada halaman `/admin/news` untuk penggunaan `useSearchParams()`.
- Validasi `npm run build` berhasil dengan seluruh 14 halaman ter-generate.
- Warning metadata `metadataBase` dan `viewport` masih ada, tetapi tidak menghentikan build.
- Verifikasi lanjutan menemukan `.next` kembali korup ketika `next dev` berjalan bersamaan dengan `next build`; dev server lama dihentikan dan cache dibangun ulang.
- Dev server bersih mengembalikan HTTP 401 untuk `GET /api/admin` tanpa sesi.
