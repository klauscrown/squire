import { z } from 'zod';

export type NpcDisposition = 'ally' | 'neutral' | 'enemy' | 'unknown';

export type NpcStatus = 'alive' | 'dead' | 'missing';

export interface Npc {
  id: string;
  campaignId: string;
  name: string;
  role?: string;
  race?: string;
  classType?: string;
  location?: string;
  portraitUrl?: string;
  description: string;
  disposition: NpcDisposition;
  status: NpcStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const DISPOSITION_LABELS: Record<NpcDisposition, string> = {
  ally: 'Aliado',
  neutral: 'Neutro',
  enemy: 'Inimigo',
  unknown: 'Desconhecido',
};

export const STATUS_LABELS: Record<NpcStatus, string> = {
  alive: 'Vivo',
  dead: 'Morto',
  missing: 'Desaparecido',
};

export const createNpcSchema = z.object({
  name: z
    .string({ required_error: 'Nome obrigatório' })
    .min(1, 'Nome obrigatório')
    .max(100, 'Máximo 100 caracteres'),
  role: z.string().max(80, 'Máximo 80 caracteres').optional(),
  race: z.string().max(80, 'Máximo 80 caracteres').optional(),
  classType: z.string().max(80, 'Máximo 80 caracteres').optional(),
  location: z.string().max(120, 'Máximo 120 caracteres').optional(),
  portraitUrl: z.string().max(2048, 'Máximo 2048 caracteres').optional(),
  description: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  disposition: z.enum(['ally', 'neutral', 'enemy', 'unknown']).default('unknown'),
  status: z.enum(['alive', 'dead', 'missing']).default('alive'),
});

export type CreateNpcInput = z.infer<typeof createNpcSchema>;

export const updateNpcSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.string().max(80).optional(),
  race: z.string().max(80).optional(),
  classType: z.string().max(80).optional(),
  location: z.string().max(120).optional(),
  portraitUrl: z.string().max(2048).optional(),
  description: z.string().max(5000).optional(),
  disposition: z.enum(['ally', 'neutral', 'enemy', 'unknown']).optional(),
  status: z.enum(['alive', 'dead', 'missing']).optional(),
});

export type UpdateNpcInput = z.infer<typeof updateNpcSchema>;
