export const CREATE_STEPS = [
  { id: 'info', label: 'Informações' },
  { id: 'characters', label: 'Personagens' },
  { id: 'review', label: 'Revisão' },
] as const;

export const RPG_SYSTEMS = [
  'D&D 5e',
  'Pathfinder 2e',
  'D&D 3.5',
  'Fate',
  'Call of Cthulhu',
  'Tormenta 20',
  'Outro',
] as const;

export const INITIAL_LEVELS = Array.from({ length: 20 }, (_, index) => String(index + 1));

export interface CharacterDraft {
  id: string;
  name: string;
  className: string;
  attachmentUri?: string | null;
}

export function createEmptyCharacter(): CharacterDraft {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    className: '',
    attachmentUri: null,
  };
}
