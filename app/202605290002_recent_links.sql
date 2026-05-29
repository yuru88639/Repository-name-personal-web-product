create table if not exists public.recent_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  url text not null,
  description text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recent_links_created_at_idx on public.recent_links(created_at desc);
create index if not exists recent_links_is_active_idx on public.recent_links(is_active);

drop trigger if exists recent_links_set_updated_at on public.recent_links;
create trigger recent_links_set_updated_at
before update on public.recent_links
for each row execute function public.set_updated_at();

alter table public.recent_links enable row level security;

drop policy if exists "Active recent links are readable by everyone" on public.recent_links;
create policy "Active recent links are readable by everyone"
on public.recent_links for select
using (is_active = true);

drop policy if exists "Owners can manage their own recent links" on public.recent_links;
create policy "Owners can manage their own recent links"
on public.recent_links for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
