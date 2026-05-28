create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.essays (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  category text not null check (category in ('影评', '社评', '个人小品', '日记')),
  language text not null check (language in ('英语', '德语', '中文', '日语')),
  cover_url text,
  published_at date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists essays_category_idx on public.essays(category);
create index if not exists essays_language_idx on public.essays(language);
create index if not exists essays_published_at_idx on public.essays(published_at desc);
create index if not exists essays_search_idx on public.essays using gin (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  quote text,
  image_url text not null,
  target_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_path text not null,
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists essays_set_updated_at on public.essays;
create trigger essays_set_updated_at
before update on public.essays
for each row execute function public.set_updated_at();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.essays enable row level security;
alter table public.gallery_items enable row level security;
alter table public.assets enable row level security;

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
on public.profiles for select
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Published essays are readable by everyone" on public.essays;
create policy "Published essays are readable by everyone"
on public.essays for select
using (is_published = true);

drop policy if exists "Authors can manage their own essays" on public.essays;
create policy "Authors can manage their own essays"
on public.essays for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "Active gallery items are readable by everyone" on public.gallery_items;
create policy "Active gallery items are readable by everyone"
on public.gallery_items for select
using (is_active = true);

drop policy if exists "Asset owners can read their own assets" on public.assets;
create policy "Asset owners can read their own assets"
on public.assets for select
using (auth.uid() = owner_id);

drop policy if exists "Asset owners can insert their own assets" on public.assets;
create policy "Asset owners can insert their own assets"
on public.assets for insert
with check (auth.uid() = owner_id);

insert into public.gallery_items (title, subtitle, quote, image_url, target_url, sort_order)
values
  ('Stochastic Harmony', 'Mount Elara, Winter 2023', 'Seeking the invisible.', '/gallery/stochastic-harmony.jpg', '/archive/stochastic-harmony', 10),
  ('Rain on Glass', 'Shanghai, Spring 2026', 'A soft city, briefly translated.', '/gallery/rain-on-glass.jpg', '/archive/rain-on-glass', 20),
  ('White Vase Hour', 'Home Studio, Autumn 2025', 'The room answers by becoming quiet.', '/gallery/white-vase-hour.jpg', '/archive/white-vase-hour', 30)
on conflict do nothing;
