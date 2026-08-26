# Fix berita hydration mismatch

- Changed `app/(public)/berita/page.tsx` to initialize news state from deterministic bundled `NEWS_DATA`.
- Removed the server/client-sensitive `isSupabaseConfigured` initializer branch.
- Existing cache and Supabase refresh behavior remains in `useEffect`.
- Changed `src/components/Footer.tsx` and `app/(public)/profil/page.tsx` to avoid reading `localStorage` during render.
- Cache restoration for footer and profile data now runs after mount, preserving live settings without hydration mismatches.
- Validation: `npx tsc --noEmit` passes.
- `npm run build` compiles but fails during page-data collection on existing route-resolution errors for `/_not-found`, `/profil`, `/berita/[slug]`, and admin routes.
