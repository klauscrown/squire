-- NPC identity fields: race, class/type, location

alter table public.npcs
  add column race text check (race is null or char_length(race) <= 80),
  add column class_type text check (class_type is null or char_length(class_type) <= 80),
  add column location text check (location is null or char_length(location) <= 120);
