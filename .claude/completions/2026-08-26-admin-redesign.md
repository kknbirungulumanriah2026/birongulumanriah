# Redesign Panel Admin — Seragam dengan Portal Publik

## Tujuan

Membuat seluruh tampilan admin (sidebar, dashboard, settings, news, stats,
security, login) mengikuti design system yang sama dengan portal publik
Nagori Birong Ulu Manriah — tanpa mengubah satu pun alur/fungsi.

## Design system yang diadopsi (dari publik)

| Token publik               | Penggunaan di publik                                | Diterapkan di admin                                  |
| -------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `bg-[#FCFCFC]` body        | Body root layout                                    | Modal & login background                             |
| `bg-[#F7F7F5]`             | Section lembut, footer                              | Main background admin, badge area                    |
| `bg-white` + `border-[#EDEDE9]` + `rounded-2xl` | Card public            | Card section, modal panel, tile aksi cepat            |
| `bg-[#1A1A1A]` primary CTA | Tombol primer publik, hero, CTA banner              | Sidebar, tombol primer admin, hero banner             |
| Emerald accent             | Icon statistik publik, badge "Live", CTA banner     | Icon metric card, badge Live, label section, aksen    |
| Eyebrow + Headline + Desc  | Section header publik                               | Header halaman admin (komponen `AdminPageHeader`)     |
| Material Symbols Outlined  | Icon publik                                         | Konsisten di seluruh admin                           |
| Dotted grid + radial blob  | Background dekoratif `StatisticsSection`            | Halaman login, hero banner dashboard                 |
| Ken Burns + fadeInUp        | Hero + section transition                            | Modal entry animation (`animate-fadeInUp`)            |

## Yang berubah (desain saja)

### Komponen baru
- [src/components/admin/AdminPageHeader.tsx](src/components/admin/AdminPageHeader.tsx) — eyebrow + icon + judul + deskripsi + slot aksi. Dipakai konsisten di semua halaman.

### File di-redesain
- [app/admin/layout.tsx](app/admin/layout.tsx) — sidebar lebih gelap (`#0F0F0F`), emerald icon untuk item aktif, emerald accent line kiri, badge "Live" pulsing, footer dengan link portal publik + tombol logout merah.
- [app/admin/dashboard/page.tsx](app/admin/dashboard/page.tsx) — hero banner dengan gradien emerald (mirip `CTASection`), metric cards gaya `StatisticsSection` dengan hover lift + top accent, quick actions dengan ikon berwarna per kategori, daftar berita terbaru dengan thumbnail + chip kategori.
- [app/admin/settings/page.tsx](app/admin/settings/page.tsx) — section cards `rounded-2xl` bernomor 01/02/03, form input `focus:ring-2 focus:ring-[#1A1A1A]/10`, hero preview pane dengan gradient + label "Pratinjau Live".
- [app/admin/news/page.tsx](app/admin/news/page.tsx) — filter bar gaya tombol kategori publik, news card `hover:-translate-y-0.5 hover:shadow-lg`, modal full-width mobile dengan header emerald chip.
- [app/admin/stats/page.tsx](app/admin/stats/page.tsx) — section bernomor, stat indicator cards gaya `StatisticsSection`, official cards dengan avatar circle + chip role + efek hover emerald.
- [app/admin/security/page.tsx](app/admin/security/page.tsx) — kartu sesi (status + tombol keluar merah), kartu ganti password dengan header ikon, danger zone dengan border merah.
- [app/admin/login/page.tsx](app/admin/login/page.tsx) — decorative dotted-grid + radial emerald (konsisten dengan `StatisticsSection`), top accent gradient emerald, error dalam card merah rounded.

### Yang TIDAK berubah (fungsi intact)
- API call ke `/api/admin`
- `AdminContext` provider, hooks, dan reducer logic
- Validasi form, error handling, toast behavior
- Navigasi, redirect, middleware flow
- Schema Supabase, env vars
- Tidak ada perubahan pada `app/api/admin/route.ts` atau `src/lib/*`

## Detail kecil untuk konsistensi

- `focus:ring-2 focus:ring-[#1A1A1A]/10` di semua input (mirip `LetterFormModal`).
- `font-headline` (Lexend) untuk judul, `font-body` (Poppins) untuk teks.
- Uppercase eyebrow `text-[10px] tracking-[0.18em] font-semibold text-emerald-700` di semua section card admin (konsisten dengan eyebrow `StatisticsSection`).
- Tombol primer admin: `bg-[#1A1A1A] hover:bg-black px-5 py-2.5 rounded-xl text-xs font-headline font-medium shadow-sm transition-all flex items-center gap-2`.
- Tombol sekunder: `border border-[#EDEDE9] bg-white text-gray-700 hover:bg-gray-50`.
- Pill/badge: `bg-emerald-50 border border-emerald-100 text-emerald-700` untuk status positif, konsisten dengan publik.

## Verifikasi

```bash
# TypeScript clean
npx tsc --noEmit   # exit 0

# Manual test checklist
1. Buka /admin/login        → styling baru, login flow normal
2. Buka /admin/dashboard    → hero banner + metric cards
3. Buka /admin/settings     → form section cards bernomor
4. Buka /admin/news         → filter + news grid, modal edit berfungsi
5. Buka /admin/stats        → stat indicators + official cards, modal add berfungsi
6. Buka /admin/security     → ganti password + reset, logout berfungsi
7. Toggle dark/light sidebar di mobile   → drawer slide-in
8. Klik "Lihat Portal Publik" di sidebar → buka tab baru ke /
```

## Catatan

- `AdminPanelModal.tsx` dan `AdminLoginModal.tsx` di `src/components/admin/`
  adalah orphan (tidak diimpor di mana pun sejak migrasi ke layout-based
  admin). Tidak disentuh untuk menjaga backward-compat kalau ada referensi
  eksternal. Hapus nanti kalau sudah yakin clean.