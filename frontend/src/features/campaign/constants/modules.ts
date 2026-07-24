import {
  BookOpen,
  Calendar,
  Castle,
  Library,
  Map,
  NotebookPen,
  Package,
  Scroll,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

export interface CampaignModuleStats {
  sessions: number;
  npcs: number;
  notes: number;
  quests: number;
  items: number;
  locations: number;
  factions: number;
}

export interface CampaignModuleDefinition {
  key: ModuleKey;
  label: string;
  tagline: string;
  icon: LucideIcon;
  enabled: boolean;
  description?: string;
  getStatLabel?: (stats: CampaignModuleStats) => string;
}

export const MODULES = [
  {
    key: 'sessions',
    label: 'Sessões',
    tagline: 'Toda aventura merece ser lembrada.',
    icon: BookOpen,
    enabled: true,
    getStatLabel: (stats) =>
      stats.sessions > 0
        ? `${stats.sessions} ${stats.sessions === 1 ? 'sessão' : 'sessões'}`
        : '',
  },
  {
    key: 'npcs',
    label: 'NPCs',
    tagline: 'Aliados, inimigos e figuras importantes.',
    icon: Users,
    enabled: true,
    getStatLabel: (stats) =>
      stats.npcs > 0
        ? `${stats.npcs} ${stats.npcs === 1 ? 'personagem' : 'personagens'}`
        : '',
  },
  {
    key: 'notes',
    label: 'Anotações',
    tagline: 'Ideias, segredos e referências do mestre.',
    icon: NotebookPen,
    enabled: true,
    getStatLabel: (stats) =>
      stats.notes > 0
        ? `${stats.notes} ${stats.notes === 1 ? 'documento' : 'documentos'}`
        : '',
  },
  {
    key: 'quests',
    label: 'Missões',
    tagline: 'Objetivos e desafios da campanha.',
    icon: Scroll,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'items',
    label: 'Itens',
    tagline: 'Artefatos, poções e equipamentos.',
    icon: Package,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'locations',
    label: 'Locais',
    tagline: 'Cidades, tavernas, masmorras e regiões.',
    icon: Castle,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'factions',
    label: 'Facções',
    tagline: 'Reinos, guildas e organizações.',
    icon: Shield,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'calendar',
    label: 'Calendário',
    tagline: 'O tempo e as estações do seu mundo.',
    icon: Calendar,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'diary',
    label: 'Diário',
    tagline: 'Reflexões pessoais sobre a jornada.',
    icon: BookOpen,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'bestiary',
    label: 'Bestiário',
    tagline: 'Criaturas e monstros do seu mundo.',
    icon: Skull,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'combats',
    label: 'Combates',
    tagline: 'Batalhas memoráveis e estratégias.',
    icon: Swords,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'timeline',
    label: 'Linha do Tempo',
    tagline: 'A cronologia da sua campanha.',
    icon: Map,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'sharedInventory',
    label: 'Inventário',
    tagline: 'Tesouros e recursos do grupo.',
    icon: Package,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'wiki',
    label: 'Wiki',
    tagline: 'Enciclopédia do seu universo.',
    icon: Sparkles,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
  {
    key: 'library',
    label: 'Biblioteca',
    tagline: 'Referências e regras do sistema.',
    icon: Library,
    enabled: false,
    description: 'Em breve',
    getStatLabel: () => 'Em breve',
  },
] as const satisfies readonly CampaignModuleDefinition[];

export type ModuleKey = (typeof MODULES)[number]['key'];

export const MODULE_DISPLAY_ORDER: ModuleKey[] = [
  'sessions',
  'npcs',
  'locations',
  'factions',
  'items',
  'quests',
  'notes',
  'bestiary',
];

export function getModuleByKey(key: ModuleKey): CampaignModuleDefinition {
  const mod = MODULES.find((m) => m.key === key);
  if (!mod) throw new Error(`Módulo não encontrado: ${key}`);
  return mod;
}

export function getModuleTileLabel(
  mod: CampaignModuleDefinition,
  stats: CampaignModuleStats,
): string {
  if (!mod.enabled) return 'Em breve';
  switch (mod.key) {
    case 'sessions':
      return stats.sessions > 0 ? `${stats.sessions} registradas` : 'Explorar';
    case 'npcs':
      return stats.npcs > 0 ? `${stats.npcs} cadastrados` : 'Explorar';
    case 'notes':
      return stats.notes > 0 ? `${stats.notes} documentos` : 'Explorar';
    default:
      return 'Explorar';
  }
}

export const ACTIVE_MODULES = MODULES.filter((m) => m.enabled);
export const FUTURE_MODULES = MODULES.filter((m) => !m.enabled);

export function getModuleStatLabel(
  mod: CampaignModuleDefinition,
  stats: CampaignModuleStats,
): string {
  if (mod.getStatLabel) return mod.getStatLabel(stats);
  return mod.description ?? 'Em breve';
}

export function getModuleRoute(key: ModuleKey, campaignId: string): string | null {
  const routes: Partial<Record<ModuleKey, string>> = {
    sessions: `/(app)/campaigns/${campaignId}/sessions`,
    npcs: `/(app)/campaigns/${campaignId}/npcs`,
    notes: `/(app)/campaigns/${campaignId}/notes`,
  };
  return routes[key] ?? null;
}
