import type {
  CampaignUniverseLink,
  LinkedCampaignSummary,
  Universe,
  UniverseConnection,
  UniverseElement,
  UniverseElementCategory,
  UniverseHomeCategory,
} from '../types';
import { universeElementCategories } from '../types';

export const RUPTURA_DIVINA: Universe = {
  id: 'ruptura-divina-universe',
  name: 'Ruptura Divina',
  description: 'Um mundo marcado pela queda dos deuses e pelos ecos de uma guerra impossível.',
  icon: 'orbit',
  createdAt: new Date('2026-01-08T12:00:00.000Z'),
  updatedAt: new Date('2026-08-05T12:00:00.000Z'),
};

export const UNIVERSE_CATEGORY_META: Record<
  UniverseElementCategory,
  { label: string; singular: string; description: string }
> = {
  character: {
    label: 'Personagens',
    singular: 'Personagem',
    description: 'Heróis, aliados, rivais e figuras do cenário.',
  },
  location: {
    label: 'Locais',
    singular: 'Local',
    description: 'Cidades, regiões, construções e territórios.',
  },
  faction: {
    label: 'Facções',
    singular: 'Facção',
    description: 'Casas, ordens, guildas e organizações.',
  },
  culture: {
    label: 'Povos e culturas',
    singular: 'Povo ou cultura',
    description: 'Povos, costumes, idiomas e tradições.',
  },
  deity: {
    label: 'Divindades e religiões',
    singular: 'Divindade ou religião',
    description: 'Deuses, cultos, ritos e crenças.',
  },
  creature: {
    label: 'Criaturas',
    singular: 'Criatura',
    description: 'Seres, monstros e espécies singulares.',
  },
  item: {
    label: 'Itens e artefatos',
    singular: 'Item ou artefato',
    description: 'Objetos, relíquias e equipamentos memoráveis.',
  },
  history: {
    label: 'História e eventos',
    singular: 'História ou evento',
    description: 'Eras, conflitos, acontecimentos e linhas do tempo.',
  },
  knowledge: {
    label: 'Conhecimento',
    singular: 'Conhecimento',
    description: 'Teorias, segredos, idiomas e saberes.',
  },
  world_rule: {
    label: 'Regras do mundo',
    singular: 'Regra do mundo',
    description: 'Leis da magia, da natureza e da realidade.',
  },
  file: {
    label: 'Mapas e arquivos',
    singular: 'Mapa ou arquivo',
    description: 'Mapas, documentos e materiais de referência.',
  },
  fragment: {
    label: 'Fragmentos',
    singular: 'Fragmento',
    description: 'Ideias rápidas ainda não classificadas.',
  },
};

export const UNIVERSE_CATEGORIES = universeElementCategories;

export const QUICK_CREATE_CATEGORIES: readonly UniverseElementCategory[] = [
  'character',
  'location',
  'faction',
  'item',
  'history',
  'fragment',
];

export const DEMO_ELEMENTS: readonly UniverseElement[] = [
  {
    id: 'ruina',
    universeId: RUPTURA_DIVINA.id,
    name: 'Ruína',
    description: 'Lâmina divina que conserva a memória de tudo que destrói.',
    category: 'item',
    tags: ['Relíquia', 'Divino'],
    state: 'Em circulação',
    createdAt: new Date('2026-06-12T14:00:00.000Z'),
    updatedAt: new Date('2026-08-05T12:00:00.000Z'),
  },
  {
    id: 'apollyon-velkyn',
    universeId: RUPTURA_DIVINA.id,
    name: 'Apollyon Velkyn',
    description: 'Herdeiro de uma linhagem apagada dos registros celestes.',
    category: 'character',
    tags: ['Profecia', 'Política'],
    createdAt: new Date('2026-05-20T10:00:00.000Z'),
    updatedAt: new Date('2026-08-04T16:30:00.000Z'),
  },
  {
    id: 'guerra-ruptura',
    universeId: RUPTURA_DIVINA.id,
    name: 'Guerra da Ruptura',
    description: 'O conflito que dividiu o firmamento e encerrou a era dos milagres.',
    category: 'history',
    tags: ['História', 'Divino'],
    occurredAt: 'Era da Ruptura',
    createdAt: new Date('2026-04-02T09:00:00.000Z'),
    updatedAt: new Date('2026-08-03T11:00:00.000Z'),
  },
  {
    id: 'galrasia',
    universeId: RUPTURA_DIVINA.id,
    name: 'Galrasia',
    description: 'Cidade erguida dentro da carcaça de um titã adormecido.',
    category: 'location',
    tags: ['Ruínas', 'Magia'],
    createdAt: new Date('2026-03-14T18:00:00.000Z'),
    updatedAt: new Date('2026-08-01T20:00:00.000Z'),
  },
  {
    id: 'casa-archmond',
    universeId: RUPTURA_DIVINA.id,
    name: 'Casa Archmond',
    description: 'Dinastia mercante que controla as rotas entre as fendas.',
    category: 'faction',
    tags: ['Política', 'História'],
    createdAt: new Date('2026-02-09T13:00:00.000Z'),
    updatedAt: new Date('2026-07-29T15:00:00.000Z'),
  },
  {
    id: 'frag-1',
    universeId: RUPTURA_DIVINA.id,
    name: 'A chuva invertida',
    description: 'A chuva sobe quando um deus está prestes a morrer.',
    category: 'fragment',
    tags: ['Presságio'],
    createdAt: new Date('2026-01-20T11:00:00.000Z'),
    updatedAt: new Date('2026-07-24T13:00:00.000Z'),
  },
  {
    id: 'frag-2',
    universeId: RUPTURA_DIVINA.id,
    name: 'A cidade sem nomes',
    description: 'Uma cidade onde ninguém consegue pronunciar o próprio nome.',
    category: 'fragment',
    tags: ['Lugar'],
    createdAt: new Date('2026-01-18T10:00:00.000Z'),
    updatedAt: new Date('2026-07-22T09:30:00.000Z'),
  },
  {
    id: 'frag-3',
    universeId: RUPTURA_DIVINA.id,
    name: 'O último cartógrafo',
    description: 'O último anjo trabalha como cartógrafo.',
    category: 'fragment',
    tags: ['Personagem'],
    createdAt: new Date('2026-01-12T08:00:00.000Z'),
    updatedAt: new Date('2026-07-20T17:00:00.000Z'),
  },
];

export const DEMO_CONNECTIONS: readonly UniverseConnection[] = [
  {
    id: 'connection-war-ruina',
    universeId: RUPTURA_DIVINA.id,
    sourceElementId: 'guerra-ruptura',
    targetElementId: 'ruina',
    relationLabel: 'envolve',
    inverseRelationLabel: 'é parte de',
  },
  {
    id: 'connection-ruina-apollyon',
    universeId: RUPTURA_DIVINA.id,
    sourceElementId: 'ruina',
    targetElementId: 'apollyon-velkyn',
    relationLabel: 'é portada atualmente por',
    inverseRelationLabel: 'porta atualmente',
  },
];

/** Configuração inicial; futuramente poderá vir das preferências do usuário. */
export const DEFAULT_PINNED_CATEGORIES: readonly {
  id: UniverseHomeCategory;
  label: string;
  summary: string;
}[] = [
  { id: 'character', label: 'Personagens', summary: 'Heróis, aliados e rivais' },
  { id: 'location', label: 'Locais', summary: 'Cidades, regiões e marcos' },
  { id: 'faction', label: 'Facções', summary: 'Casas, ordens e guildas' },
  { id: 'history', label: 'História', summary: 'Eras, guerras e eventos' },
  { id: 'archive', label: 'Acervo', summary: 'Itens, criaturas e mais' },
  { id: 'fragment', label: 'Fragmentos', summary: 'Ideias livres' },
];

export const LINKED_CAMPAIGNS: readonly LinkedCampaignSummary[] = [
  {
    id: 'ruptura-divina-campaign',
    title: 'Ruptura Divina',
    system: 'Tormenta 20',
    status: 'Ativa',
    nextSession: '12 ago · 19:30',
    usedElements: 4,
  },
];

export const DEMO_CAMPAIGN_UNIVERSE_LINKS: readonly CampaignUniverseLink[] = [
  {
    id: 'link-ruptura-divina',
    campaignId: 'ruptura-divina-campaign',
    universeId: RUPTURA_DIVINA.id,
  },
];

export const DEMO_CAMPAIGN_ELEMENT_IDS = new Set([
  'ruina',
  'apollyon-velkyn',
  'guerra-ruptura',
  'galrasia',
]);
