import { z } from 'zod';

export type UniverseVisualState = 'none' | 'ready' | 'active';

export type UniverseElementCategory =
  | 'character'
  | 'location'
  | 'faction'
  | 'culture'
  | 'deity'
  | 'creature'
  | 'item'
  | 'history'
  | 'knowledge'
  | 'world_rule'
  | 'file'
  | 'fragment';

export type UniverseHomeCategory = UniverseElementCategory | 'archive';

export interface Universe {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UniverseElement {
  id: string;
  universeId: string;
  category: UniverseElementCategory;
  name: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  state?: string;
  occurredAt?: string;
  secretNotes?: string;
  isSecret?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UniverseElementSummary extends UniverseElement {
  connectionCount: number;
  linkedCampaignName?: string;
}

export interface UniverseConnection {
  id: string;
  universeId: string;
  sourceElementId: string;
  targetElementId: string;
  relationLabel: string;
  inverseRelationLabel?: string;
  context?: string;
  isSecret?: boolean;
  startedAt?: string;
  endedAt?: string;
}

export interface UniverseConnectionView {
  connection: UniverseConnection;
  relatedElement: UniverseElement;
  direction: 'outgoing' | 'incoming';
  displayRelationLabel: string;
}

export interface CampaignUniverseLink {
  id: string;
  campaignId: string;
  universeId: string;
}

export interface UniverseFragmentPreview {
  id: string;
  text: string;
  tag: string;
}

export interface LinkedCampaignSummary {
  id: string;
  title: string;
  system: string;
  status: 'Ativa' | 'Em preparação' | 'Pausada' | 'Concluída';
  nextSession?: string;
  usedElements: number;
}

export const createUniverseSchema = z.object({
  name: z
    .string({ required_error: 'Nome obrigatório' })
    .trim()
    .min(1, 'Nome obrigatório')
    .max(120, 'Máximo 120 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  icon: z.string().max(80, 'Máximo 80 caracteres').optional(),
});

export type CreateUniverseInput = z.infer<typeof createUniverseSchema>;

export const updateUniverseSchema = createUniverseSchema.partial();
export type UpdateUniverseInput = z.infer<typeof updateUniverseSchema>;

export const universeElementCategories: readonly UniverseElementCategory[] = [
  'character',
  'location',
  'faction',
  'culture',
  'deity',
  'creature',
  'item',
  'history',
  'knowledge',
  'world_rule',
  'file',
  'fragment',
];

export const createUniverseElementSchema = z.object({
  name: z
    .string({ required_error: 'Nome obrigatório' })
    .trim()
    .min(1, 'Nome obrigatório')
    .max(120, 'Máximo 120 caracteres'),
  category: z.enum(
    universeElementCategories as [UniverseElementCategory, ...UniverseElementCategory[]],
  ),
  description: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  tags: z.string().max(500, 'Máximo 500 caracteres').optional(),
  imageUrl: z.string().max(2048, 'Máximo 2048 caracteres').optional(),
  state: z.string().max(80, 'Máximo 80 caracteres').optional(),
  occurredAt: z.string().max(80, 'Máximo 80 caracteres').optional(),
  secretNotes: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  isSecret: z.boolean().optional(),
});

export type CreateUniverseElementInput = z.infer<typeof createUniverseElementSchema>;

export const updateUniverseElementSchema = createUniverseElementSchema.partial();
export type UpdateUniverseElementInput = z.infer<typeof updateUniverseElementSchema>;

export const createUniverseConnectionSchema = z.object({
  targetElementId: z.string().min(1, 'Escolha um conteúdo'),
  relationLabel: z
    .string({ required_error: 'Descreva a relação' })
    .trim()
    .min(1, 'Descreva a relação')
    .max(120, 'Máximo 120 caracteres'),
  inverseRelationLabel: z.string().max(120, 'Máximo 120 caracteres').optional(),
  context: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  isSecret: z.boolean().optional(),
  startedAt: z.string().max(80, 'Máximo 80 caracteres').optional(),
  endedAt: z.string().max(80, 'Máximo 80 caracteres').optional(),
});

export type CreateUniverseConnectionInput = z.infer<typeof createUniverseConnectionSchema>;
