# Fix Next Metadata Warnings

- Menambahkan `metadataBase` dari `NEXT_PUBLIC_APP_URL` dengan fallback domain resmi.
- Memindahkan konfigurasi viewport dari `Metadata` ke export `Viewport` resmi Next.js.
- Production build berhasil tanpa warning metadataBase/viewport.
- Dev server diperbarui dan halaman utama HTTP 200.
