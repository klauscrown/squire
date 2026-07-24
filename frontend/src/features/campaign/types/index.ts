import { z } from 'zod';

export type CampaignStatus = 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  system?: string;
  coverImageUrl?: string;
  status: CampaignStatus;
  playersCount?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createCampaignSchema = z.object({
  title: z
    .string({ required_error: 'Título obrigatório' })
    .min(1, 'Título obrigatório')
    .max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  system: z
    .string({ required_error: 'Sistema obrigatório' })
    .min(1, 'Sistema obrigatório')
    .max(50, 'Máximo 50 caracteres'),
  coverImageUrl: z.string().optional(),
  status: z.enum(['active', 'paused', 'completed']).default('active'),
  playersCount: z.coerce
    .number()
    .int('Deve ser um número inteiro')
    .min(1, 'Mínimo 1 jogador')
    .max(20, 'Máximo 20 jogadores')
    .optional()
    .or(z.literal('')),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  system: z.string().max(50).optional(),
  status: z.enum(['active', 'paused', 'completed']).optional(),
  playersCount: z.number().int().min(1).max(20).optional(),
});

export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída',
};
