alter table public.gallery_items
add column if not exists country text,
add column if not exists location_name text,
add column if not exists map_url text,
add column if not exists captured_at date;
