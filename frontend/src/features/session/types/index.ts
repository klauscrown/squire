import { z } from 'zod';

export type SessionStatus = 'planned' | 'completed' | 'cancelled';

export interface Session {
  id: string;
  campaignId: string;
  title: string;
  sessionNumber?: number;
  playedAt?: Date;
  summary: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const STATUS_LABELS: Record<SessionStatus, string> = {
  planned: 'Agendada',
  completed: 'Realizada',
  cancelled: 'Cancelada',
};

export const createSessionSchema = z.object({
  title: z
    .string({ required_error: 'Título obrigatório' })
    .min(1, 'Título obrigatório')
    .max(100, 'Máximo 100 caracteres'),
  sessionNumber: z.coerce
    .number()
    .int('Deve ser um número inteiro')
    .min(1, 'Mínimo 1')
    .max(999, 'Máximo 999')
    .optional()
    .or(z.literal('')),
  playedAt: z.string().optional(),
  summary: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  status: z.enum(['planned', 'completed', 'cancelled']).default('planned'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  sessionNumber: z.number().int().min(1).max(999).optional(),
  playedAt: z.string().optional(),
  summary: z.string().max(5000).optional(),
  status: z.enum(['planned', 'completed', 'cancelled']).optional(),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

export function parseDateInput(value?: string): Date | undefined {
  if (!value?.trim()) return undefined;

  const parts = value.trim().split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts.map(Number);
    if (day && month && year) {
      const date = new Date(year, month - 1, day);
      if (!Number.isNaN(date.getTime())) return date;
    }
  }

  const iso = new Date(value);
  if (!Number.isNaN(iso.getTime())) return iso;

  return undefined;
}

export function formatDateInput(date?: Date): string {
  if (!date) return '';
  return date.toLocaleDateString('pt-BR');
}
