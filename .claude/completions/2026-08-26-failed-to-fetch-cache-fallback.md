# Fix "Failed to fetch" dengan localStorage cache

## Masalah

`getNews()` dan `getSiteSettings()` melempar `Runtime TypeError: Failed to fetch`
dari chrome extension (`injectScriptAdjust.js`) yang meng-override `window.fetch`.
Fetch ke Supabase di-block sebelum sampai server, padahal env `NEXT_PUBLIC_*`
sudah ter-set sehingga `isSupabaseConfigured === true`.

Efeknya: walaupun try/catch di repository sudah handle error dan kembalikan
`null`, halaman publik (home, berita, profil) render dengan state kosong
karena `NEWS_DATA`, `VILLAGE_STATS`, `VILLAGE_OFFICIALS` di
`src/data/portalData.ts` sudah dikosongkan — fallback ke default tidak
mungkin karena default-nya kosong.

## Solusi

Cache layer di `localStorage` yang:

1. **Menyimpan hasil fetch yang sukses** — hemat token/koneksi untuk
   request berikutnya (fresh window 5 menit, max age 7 hari).
2. **Mengembalikan cached value saat fetch gagal** — Supabase down,
   ext blocking, offline → halaman tetap punya konten.
3. **Pre-populate state dari cache** — `useState` initializer baca cache
   sync, jadi tidak ada flash kosong sebelum `useEffect` jalan.

## Perubahan

### File baru
- `src/lib/cache.ts` — TTL cache (`readCache`, `writeCache`,
  `isCacheFresh`, `clearCache`), namespace `portal:cache:v1:*`,
  safe localStorage access (SSR-safe + try/catch untuk quota/disabled).

### File diubah
- `src/lib/repository.ts` — tiap getter (`getSiteSettings`, `getNews`,
  `getVillageOfficials`, `getVillageStats`):
  - Skip fetch kalau cache masih fresh.
  - Fallback ke cache saat `error` atau exception.
  - Tulis cache setelah fetch sukses.
- `app/(public)/page.tsx` — `useState` initializer pre-populate dari cache.
- `app/(public)/berita/page.tsx` — sama, untuk list berita.
- `app/(public)/berita/[slug]/page.tsx` — fallback chain:
  fetch → cache → `NEWS_DATA`.
- `app/(public)/profil/page.tsx` — pre-populate settings/officials/stats.
- `src/components/Footer.tsx` — pre-populate settings dari cache saat
  parent tidak mengirim prop.

## Cara kerja singkat

```
Halaman mount
  └─ useState(initializer)
       └─ readCache(key)         ← sync, dari localStorage
            ├─ ada  → render pakai cache (instant, no flash)
            └─ kosong → render pakai default (DEFAULT_SITE_SETTINGS dll)
  └─ useEffect
       └─ getX()
            ├─ cache fresh   → return cache
            └─ cache stale   → fetch Supabase
                  ├─ ok      → writeCache + return
                  └─ gagal   → return stale cache (atau null)
```

## Yang TIDAK berubah

- API contract tiap getter: tetep return `T | null`.
- `adminRepository.ts` (admin write) tidak butuh cache.
- Schema Supabase, env var, layout/admin pages.

## Test plan

1. Buka `/berita` dengan Supabase aktif → list tampil, cache terisi.
2. Hard reload dengan DevTools "Offline" → list tetap tampil dari cache.
3. Disable chrome ext yang block fetch → halaman tetap punya konten.
4. Buka `/profil/<id>` dengan offline + cache ada → berita detail tampil.
5. Inspect `localStorage` → ada key `portal:cache:v1:news`,
   `portal:cache:v1:site_settings`, dll.