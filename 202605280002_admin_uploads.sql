alter table public.gallery_items
add column if not exists owner_id uuid references public.profiles(id) on delete set null;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Gallery owners can manage their own items" on public.gallery_items;
create policy "Gallery owners can manage their own items"
on public.gallery_items for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Site assets are publicly readable" on storage.objects;
create policy "Site assets are publicly readable"
on storage.objects for select
using (bucket_id = 'site-assets');

drop policy if exists "Authenticated users can upload site assets" on storage.objects;
create policy "Authenticated users can upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets');

drop policy if exists "Authenticated users can update own site assets" on storage.objects;
create policy "Authenticated users can update own site assets"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets' and owner = auth.uid())
with check (bucket_id = 'site-assets' and owner = auth.uid());

drop policy if exists "Authenticated users can delete own site assets" on storage.objects;
create policy "Authenticated users can delete own site assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets' and owner = auth.uid());
