-- Squire — locais de campanha (cidades, masmorras, regiões)

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  type text not null default 'other' check (
    type in ('settlement', 'dungeon', 'wilderness', 'landmark', 'building', 'other')
  ),
  region text check (region is null or char_length(region) <= 120),
  description text not null default '' check (char_length(description) <= 5000),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index locations_campaign_id_idx on public.locations (campaign_id);
create index locations_name_idx on public.locations (campaign_id, name);

create trigger locations_updated_at
  before update on public.locations
  for each row execute function public.handle_updated_at();

alter table public.locations enable row level security;

create policy "locations_select_own"
  on public.locations for select
  using (public.is_campaign_owner(campaign_id));

create policy "locations_insert_own"
  on public.locations for insert
  with check (public.is_campaign_owner(campaign_id));

create policy "locations_update_own"
  on public.locations for update
  using (public.is_campaign_owner(campaign_id))
  with check (public.is_campaign_owner(campaign_id));

create policy "locations_delete_own"
  on public.locations for delete
  using (public.is_campaign_owner(campaign_id));
