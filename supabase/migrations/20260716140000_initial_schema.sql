-- Squire — schema inicial (campanhas e módulos MVP)

create extension if not exists "pgcrypto";

-- ─── helpers ────────────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── campaigns ──────────────────────────────────────────────────────────────

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  description text check (description is null or char_length(description) <= 500),
  system text check (system is null or char_length(system) <= 50),
  cover_image_url text,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  players_count integer check (players_count is null or players_count between 1 and 20),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index campaigns_created_by_idx on public.campaigns (created_by);
create index campaigns_updated_at_idx on public.campaigns (updated_at desc);

create trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.handle_updated_at();

-- ─── sessions ───────────────────────────────────────────────────────────────

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  session_number integer check (session_number is null or session_number between 1 and 999),
  played_at timestamptz,
  summary text not null default '' check (char_length(summary) <= 5000),
  status text not null default 'planned' check (status in ('planned', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sessions_campaign_id_idx on public.sessions (campaign_id);
create index sessions_session_number_idx on public.sessions (campaign_id, session_number);

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.handle_updated_at();

-- ─── npcs ───────────────────────────────────────────────────────────────────

create table public.npcs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  role text check (role is null or char_length(role) <= 80),
  description text not null default '' check (char_length(description) <= 5000),
  disposition text not null default 'unknown' check (disposition in ('ally', 'neutral', 'enemy', 'unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index npcs_campaign_id_idx on public.npcs (campaign_id);
create index npcs_name_idx on public.npcs (campaign_id, name);

create trigger npcs_updated_at
  before update on public.npcs
  for each row execute function public.handle_updated_at();

-- ─── notes ──────────────────────────────────────────────────────────────────

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  content text not null default '' check (char_length(content) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_campaign_id_idx on public.notes (campaign_id);
create index notes_updated_at_idx on public.notes (campaign_id, updated_at desc);

create trigger notes_updated_at
  before update on public.notes
  for each row execute function public.handle_updated_at();

-- ─── RLS helpers ────────────────────────────────────────────────────────────

create or replace function public.is_campaign_owner(campaign_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaigns
    where id = campaign_id
      and created_by = auth.uid()
  );
$$;

-- ─── RLS: campaigns ─────────────────────────────────────────────────────────

alter table public.campaigns enable row level security;

create policy "campaigns_select_own"
  on public.campaigns for select
  using (created_by = auth.uid());

create policy "campaigns_insert_own"
  on public.campaigns for insert
  with check (created_by = auth.uid());

create policy "campaigns_update_own"
  on public.campaigns for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "campaigns_delete_own"
  on public.campaigns for delete
  using (created_by = auth.uid());

-- ─── RLS: sessions ──────────────────────────────────────────────────────────

alter table public.sessions enable row level security;

create policy "sessions_select_own"
  on public.sessions for select
  using (public.is_campaign_owner(campaign_id));

create policy "sessions_insert_own"
  on public.sessions for insert
  with check (public.is_campaign_owner(campaign_id));

create policy "sessions_update_own"
  on public.sessions for update
  using (public.is_campaign_owner(campaign_id))
  with check (public.is_campaign_owner(campaign_id));

create policy "sessions_delete_own"
  on public.sessions for delete
  using (public.is_campaign_owner(campaign_id));

-- ─── RLS: npcs ──────────────────────────────────────────────────────────────

alter table public.npcs enable row level security;

create policy "npcs_select_own"
  on public.npcs for select
  using (public.is_campaign_owner(campaign_id));

create policy "npcs_insert_own"
  on public.npcs for insert
  with check (public.is_campaign_owner(campaign_id));

create policy "npcs_update_own"
  on public.npcs for update
  using (public.is_campaign_owner(campaign_id))
  with check (public.is_campaign_owner(campaign_id));

create policy "npcs_delete_own"
  on public.npcs for delete
  using (public.is_campaign_owner(campaign_id));

-- ─── RLS: notes ─────────────────────────────────────────────────────────────

alter table public.notes enable row level security;

create policy "notes_select_own"
  on public.notes for select
  using (public.is_campaign_owner(campaign_id));

create policy "notes_insert_own"
  on public.notes for insert
  with check (public.is_campaign_owner(campaign_id));

create policy "notes_update_own"
  on public.notes for update
  using (public.is_campaign_owner(campaign_id))
  with check (public.is_campaign_owner(campaign_id));

create policy "notes_delete_own"
  on public.notes for delete
  using (public.is_campaign_owner(campaign_id));
