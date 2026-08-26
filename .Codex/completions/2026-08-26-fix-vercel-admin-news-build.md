# Fix Vercel admin news build

- Verified the current `app/admin/news/page.tsx` wraps the `useSearchParams` consumer in `Suspense`.
- Local production build now completes successfully: static pages generated 14/14, including `/admin/news`.
- Vercel error came from deploying older commit `63390ca`; deploy a new commit containing the current working-tree changes.
- Current build has no viewport warnings.
- `.env.local` remains ignored and must not be committed.
