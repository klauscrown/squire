-- Add NPC life status (alive / dead / missing)

alter table public.npcs
  add column status text not null default 'alive'
  check (status in ('alive', 'dead', 'missing'));

create index npcs_status_idx on public.npcs (campaign_id, status);
