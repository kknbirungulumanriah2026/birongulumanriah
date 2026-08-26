# Supabase setup

The portal reads public display data through the anonymous Supabase client. All admin writes go through the server-side `/api/admin` route, which requires a signed HttpOnly session and the service-role key.

## Required environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSCODE=a-strong-unique-password
ADMIN_SESSION_SECRET=a-random-secret-at-least-32-characters-long
```

Never use `NEXT_PUBLIC_` for the last three values. There is intentionally no default admin password.

## Apply the database changes

For a new project, run `migrations/0001_initial_schema.sql`, then `seed.sql` in the Supabase SQL Editor. For a database created before this security update, run `migrations/0002_harden_admin_access.sql` as well; it removes direct public access to `site_settings` and exposes the safe `site_settings_public` view used by the app.

After the base schema, run `migrations/0006_admin_credentials.sql` to enable changing the admin password from the Security page. This creates a server-only password-hash table; do not grant `anon` or `authenticated` access to it.

Run `migrations/0007_site_content_settings.sql` to enable editing the footer description and Visi/Misi from the Admin Settings page.

The RLS policy for `document_applications` allows public submission. Review its public-read policy before storing any personally identifiable applicant data in production.
