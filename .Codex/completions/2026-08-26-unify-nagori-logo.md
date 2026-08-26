# Unify Nagori logo configuration

- Shared public layout now loads site settings once and provides them through `PublicSettingsContext`.
- Header receives the configured `logoUrl` and `villageName`.
- Footer, profile page, and letter preview use the configured Nagori logo.
- Removed duplicate settings fetches from Footer and LetterFormModal.
- Metadata and application icons use the canonical `LOGO_URL` fallback.
- Validation: `npx tsc --noEmit` passes; diagnostics report no errors in changed files.
