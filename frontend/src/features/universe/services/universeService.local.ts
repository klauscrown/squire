/**
 * Persistência local provisória para Universo.
 * A API assíncrona espelha os demais serviços do projeto para que uma futura
 * implementação Supabase possa substituir este arquivo sem alterar a UI.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEMO_CAMPAIGN_ELEMENT_IDS,
  DEMO_CAMPAIGN_UNIVERSE_LINKS,
  DEMO_CONNECTIONS,
  DEMO_ELEMENTS,
  LINKED_CAMPAIGNS,
  RUPTURA_DIVINA,
} from '../data/demoUniverse';
import type {
  CampaignUniverseLink,
  CreateUniverseConnectionInput,
  CreateUniverseElementInput,
  CreateUniverseInput,
  Universe,
  UniverseConnection,
  UniverseConnectionView,
  UniverseElement,
  UniverseElementSummary,
  UpdateUniverseElementInput,
  UpdateUniverseInput,
} from '../types';

const STORAGE_KEY = 'squire-universe-local-v1';

interface UniverseLocalState {
  version: 1;
  activeUniverseId?: string;
  universes: Universe[];
  elements: UniverseElement[];
  connections: UniverseConnection[];
  campaignLinks: CampaignUniverseLink[];
  campaignElementIds: string[];
}

interface SerializedUniverseLocalState extends Omit<UniverseLocalState, 'universes' | 'elements'> {
  universes: (Omit<Universe, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  })[];
  elements: (Omit<UniverseElement, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  })[];
}

let stateCache: UniverseLocalState | null = null;

function createDefaultState(): UniverseLocalState {
  const universe: Universe = {
    id: RUPTURA_DIVINA.id,
    name: RUPTURA_DIVINA.name,
    description: RUPTURA_DIVINA.description,
    icon: RUPTURA_DIVINA.icon,
    createdAt: new Date(RUPTURA_DIVINA.createdAt),
    updatedAt: new Date(RUPTURA_DIVINA.updatedAt),
  };

  return {
    version: 1,
    activeUniverseId: universe.id,
    universes: [universe],
    elements: DEMO_ELEMENTS.map(cloneElement),
    connections: DEMO_CONNECTIONS.map((connection) => ({ ...connection })),
    campaignLinks: DEMO_CAMPAIGN_UNIVERSE_LINKS.map((link) => ({ ...link })),
    campaignElementIds: [...DEMO_CAMPAIGN_ELEMENT_IDS],
  };
}

function cloneUniverse(universe: Universe): Universe {
  return {
    ...universe,
    createdAt: new Date(universe.createdAt),
    updatedAt: new Date(universe.updatedAt),
  };
}

function cloneElement(element: UniverseElement): UniverseElement {
  return {
    ...element,
    tags: element.tags ? [...element.tags] : undefined,
    createdAt: new Date(element.createdAt),
    updatedAt: new Date(element.updatedAt),
  };
}

function deserialize(raw: string): UniverseLocalState {
  const parsed = JSON.parse(raw) as SerializedUniverseLocalState;
  if (parsed.version !== 1 || !Array.isArray(parsed.universes)) {
    throw new Error('Versão de dados locais incompatível.');
  }

  return {
    ...parsed,
    universes: parsed.universes.map((universe) => ({
      ...universe,
      createdAt: new Date(universe.createdAt),
      updatedAt: new Date(universe.updatedAt),
    })),
    elements: parsed.elements.map((element) => ({
      ...element,
      tags: element.tags ? [...element.tags] : undefined,
      createdAt: new Date(element.createdAt),
      updatedAt: new Date(element.updatedAt),
    })),
  };
}

async function getState(): Promise<UniverseLocalState> {
  if (stateCache) return stateCache;

  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      stateCache = deserialize(stored);
      return stateCache;
    } catch {
      // Dados inválidos não interrompem o app; o snapshot padrão será regravado.
    }
  }

  stateCache = createDefaultState();
  await persistState(stateCache);
  return stateCache;
}

async function persistState(state: UniverseLocalState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function commit(mutator: (state: UniverseLocalState) => void): Promise<UniverseLocalState> {
  const state = await getState();
  mutator(state);
  await persistState(state);
  return state;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function optional(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function parseTags(value?: string): string[] | undefined {
  const tags = value
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags?.length ? [...new Set(tags)] : undefined;
}

export async function getUniverses(): Promise<Universe[]> {
  const state = await getState();
  return state.universes
    .map(cloneUniverse)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getUniverse(universeId: string): Promise<Universe> {
  const state = await getState();
  const universe = state.universes.find((candidate) => candidate.id === universeId);
  if (!universe) throw new Error('Universo não encontrado.');
  return cloneUniverse(universe);
}

export async function getActiveUniverse(): Promise<Universe | null> {
  const state = await getState();
  const universe = state.universes.find((candidate) => candidate.id === state.activeUniverseId);
  return universe ? cloneUniverse(universe) : null;
}

export async function selectActiveUniverse(universeId: string): Promise<Universe> {
  const state = await getState();
  const universe = state.universes.find((candidate) => candidate.id === universeId);
  if (!universe) throw new Error('Universo não encontrado.');
  await commit((draft) => {
    draft.activeUniverseId = universeId;
  });
  return cloneUniverse(universe);
}

export async function createUniverse(input: CreateUniverseInput): Promise<Universe> {
  const now = new Date();
  const universe: Universe = {
    id: generateId('universe'),
    name: input.name.trim(),
    description: optional(input.description),
    icon: optional(input.icon) ?? 'orbit',
    createdAt: now,
    updatedAt: now,
  };

  await commit((state) => {
    state.universes.unshift(universe);
    state.activeUniverseId = universe.id;
  });
  return cloneUniverse(universe);
}

export async function updateUniverse(
  universeId: string,
  input: UpdateUniverseInput,
): Promise<Universe> {
  let updated: Universe | undefined;
  await commit((state) => {
    state.universes = state.universes.map((universe) => {
      if (universe.id !== universeId) return universe;
      updated = {
        ...universe,
        name: input.name?.trim() || universe.name,
        description:
          input.description === undefined ? universe.description : optional(input.description),
        icon: input.icon === undefined ? universe.icon : optional(input.icon),
        updatedAt: new Date(),
      };
      return updated;
    });
  });

  if (!updated) throw new Error('Universo não encontrado.');
  return cloneUniverse(updated);
}

export async function getUniverseElements(universeId: string): Promise<UniverseElementSummary[]> {
  const state = await getState();
  const campaignElementIds = new Set(state.campaignElementIds);
  return state.elements
    .filter((element) => element.universeId === universeId)
    .map((element) => ({
      ...cloneElement(element),
      connectionCount: state.connections.filter(
        (connection) =>
          connection.sourceElementId === element.id || connection.targetElementId === element.id,
      ).length,
      linkedCampaignName: campaignElementIds.has(element.id)
        ? LINKED_CAMPAIGNS[0]?.title
        : undefined,
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getUniverseElement(elementId: string): Promise<UniverseElement> {
  const state = await getState();
  const element = state.elements.find((candidate) => candidate.id === elementId);
  if (!element) throw new Error('Conteúdo do universo não encontrado.');
  return cloneElement(element);
}

export async function createUniverseElement(
  input: CreateUniverseElementInput,
  universeId: string,
): Promise<UniverseElement> {
  const now = new Date();
  const element: UniverseElement = {
    id: generateId('element'),
    universeId,
    category: input.category,
    name: input.name.trim(),
    description: optional(input.description),
    tags: parseTags(input.tags),
    imageUrl: optional(input.imageUrl),
    state: optional(input.state),
    occurredAt: optional(input.occurredAt),
    secretNotes: optional(input.secretNotes),
    isSecret: input.isSecret || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await commit((state) => {
    if (!state.universes.some((universe) => universe.id === universeId)) {
      throw new Error('Universo não encontrado.');
    }
    state.elements.unshift(element);
  });
  return cloneElement(element);
}

export async function updateUniverseElement(
  elementId: string,
  input: UpdateUniverseElementInput,
): Promise<UniverseElement> {
  let updated: UniverseElement | undefined;
  await commit((state) => {
    state.elements = state.elements.map((element) => {
      if (element.id !== elementId) return element;
      updated = {
        ...element,
        category: input.category ?? element.category,
        name: input.name?.trim() || element.name,
        description:
          input.description === undefined ? element.description : optional(input.description),
        tags: input.tags === undefined ? element.tags : parseTags(input.tags),
        imageUrl: input.imageUrl === undefined ? element.imageUrl : optional(input.imageUrl),
        state: input.state === undefined ? element.state : optional(input.state),
        occurredAt:
          input.occurredAt === undefined ? element.occurredAt : optional(input.occurredAt),
        secretNotes:
          input.secretNotes === undefined ? element.secretNotes : optional(input.secretNotes),
        isSecret: input.isSecret === undefined ? element.isSecret : input.isSecret || undefined,
        updatedAt: new Date(),
      };
      return updated;
    });
  });

  if (!updated) throw new Error('Conteúdo do universo não encontrado.');
  return cloneElement(updated);
}

export async function deleteUniverseElement(elementId: string): Promise<void> {
  await commit((state) => {
    state.elements = state.elements.filter((element) => element.id !== elementId);
    state.connections = state.connections.filter(
      (connection) =>
        connection.sourceElementId !== elementId && connection.targetElementId !== elementId,
    );
    state.campaignElementIds = state.campaignElementIds.filter((id) => id !== elementId);
  });
}

export async function getUniverseConnections(elementId: string): Promise<UniverseConnectionView[]> {
  const state = await getState();
  return state.connections.flatMap((connection): UniverseConnectionView[] => {
    const outgoing = connection.sourceElementId === elementId;
    const incoming = connection.targetElementId === elementId;
    if (!outgoing && !incoming) return [];

    const relatedId = outgoing ? connection.targetElementId : connection.sourceElementId;
    const relatedElement = state.elements.find((element) => element.id === relatedId);
    if (!relatedElement) return [];

    return [
      {
        connection: { ...connection },
        relatedElement: cloneElement(relatedElement),
        direction: outgoing ? 'outgoing' : 'incoming',
        displayRelationLabel: outgoing
          ? connection.relationLabel
          : connection.inverseRelationLabel || connection.relationLabel,
      },
    ];
  });
}

export async function createUniverseConnection(
  sourceElementId: string,
  input: CreateUniverseConnectionInput,
): Promise<UniverseConnection> {
  const state = await getState();
  const source = state.elements.find((element) => element.id === sourceElementId);
  const target = state.elements.find((element) => element.id === input.targetElementId);

  if (!source || !target || source.universeId !== target.universeId) {
    throw new Error('Os conteúdos precisam pertencer ao mesmo universo.');
  }

  const connection: UniverseConnection = {
    id: generateId('connection'),
    universeId: source.universeId,
    sourceElementId,
    targetElementId: target.id,
    relationLabel: input.relationLabel.trim(),
    inverseRelationLabel: optional(input.inverseRelationLabel),
    context: optional(input.context),
    isSecret: input.isSecret || undefined,
    startedAt: optional(input.startedAt),
    endedAt: optional(input.endedAt),
  };

  await commit((draft) => {
    draft.connections.unshift(connection);
    draft.elements = draft.elements.map((element) =>
      element.id === sourceElementId || element.id === target.id
        ? { ...element, updatedAt: new Date() }
        : element,
    );
  });
  return { ...connection };
}

export async function getCampaignUniverseLinks(
  universeId: string,
): Promise<CampaignUniverseLink[]> {
  const state = await getState();
  return state.campaignLinks
    .filter((link) => link.universeId === universeId)
    .map((link) => ({ ...link }));
}

export async function linkCampaignToUniverse(
  campaignId: string,
  universeId: string,
): Promise<CampaignUniverseLink> {
  const state = await getState();
  const existing = state.campaignLinks.find(
    (link) => link.campaignId === campaignId && link.universeId === universeId,
  );
  if (existing) return { ...existing };

  const link: CampaignUniverseLink = {
    id: generateId('campaign-universe'),
    campaignId,
    universeId,
  };
  await commit((draft) => {
    draft.campaignLinks.unshift(link);
  });
  return { ...link };
}

export async function unlinkCampaignFromUniverse(
  campaignId: string,
  universeId: string,
): Promise<void> {
  await commit((state) => {
    state.campaignLinks = state.campaignLinks.filter(
      (link) => link.campaignId !== campaignId || link.universeId !== universeId,
    );
  });
}
