import { z } from 'zod';

export interface Note {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: 'Título obrigatório' })
    .min(1, 'Título obrigatório')
    .max(100, 'Máximo 100 caracteres'),
  content: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().max(5000).optional(),
});

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
