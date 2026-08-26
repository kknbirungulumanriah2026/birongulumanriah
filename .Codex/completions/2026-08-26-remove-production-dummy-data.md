# Remove production dummy data

- Removed bundled sample identity, contact details, logo URL, hero/CTA images, and sample site settings.
- Kept typed empty defaults and empty collections so SSR remains deterministic and empty database states render safely.
- Removed hard-coded public fallbacks for header, footer, hero, CTA, profile, statistics, and profile modal content.
- Public settings continue loading from Supabase through the shared layout context.
- Removed static Open Graph and favicon image references that could not reflect hosted settings.
- Validation: `npx tsc --noEmit` passes and changed-file diagnostics report no errors.
