-- Public bucket for compressed landing-page images uploaded from the admin
-- panel. Images are compressed in the browser before upload; only image
-- extensions are accepted by policy.

insert into storage.buckets (id, name, public)
values ('landing-images', 'landing-images', true)
on conflict (id) do update set public = true;

drop policy if exists "landing_images_public_read" on storage.objects;
create policy "landing_images_public_read" on storage.objects
  for select
  using (bucket_id = 'landing-images');

drop policy if exists "landing_images_anon_insert" on storage.objects;
create policy "landing_images_anon_insert" on storage.objects
  for insert
  with check (
    bucket_id = 'landing-images'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  );

drop policy if exists "landing_images_anon_update" on storage.objects;
create policy "landing_images_anon_update" on storage.objects
  for update
  using (bucket_id = 'landing-images')
  with check (bucket_id = 'landing-images');

drop policy if exists "landing_images_anon_delete" on storage.objects;
create policy "landing_images_anon_delete" on storage.objects
  for delete
  using (bucket_id = 'landing-images');
