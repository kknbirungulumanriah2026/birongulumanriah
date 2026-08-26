# Hide Admin Trigger

- Menghapus tombol Panel Admin dan Lihat Berita dari header, termasuk drawer mobile.
- Menghapus tautan Panel Admin dari footer.
- Menambahkan trigger akses `/admin/login` melalui tiga klik berurutan pada teks Nagori Birong Ulu Manriah.
- Validasi: `npx tsc --noEmit` berhasil.
- `npm run build` terhenti pada masalah existing di `/admin/news`: `useSearchParams()` belum dibungkus `Suspense`.
