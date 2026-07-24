-- NPC portrait image URL

alter table public.npcs
  add column portrait_url text
  check (portrait_url is null or char_length(portrait_url) <= 2048);
