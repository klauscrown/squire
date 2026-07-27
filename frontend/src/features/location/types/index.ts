import { z } from 'zod';

export type LocationType =
  | 'settlement'
  | 'dungeon'
  | 'wilderness'
  | 'landmark'
  | 'building'
  | 'other';

export interface Location {
  id: string;
  campaignId: string;
  name: string;
  type: LocationType;
  region?: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TYPE_LABELS: Record<LocationType, string> = {
  settlement: 'Assentamento',
  dungeon: 'Masmorra',
  wilderness: 'Natureza',
  landmark: 'Marco',
  building: 'Edificação',
  other: 'Outro',
};

export const createLocationSchema = z.object({
  name: z
    .string({ required_error: 'Nome obrigatório' })
    .min(1, 'Nome obrigatório')
    .max(100, 'Máximo 100 caracteres'),
  type: z
    .enum(['settlement', 'dungeon', 'wilderness', 'landmark', 'building', 'other'])
    .default('other'),
  region: z.string().max(120, 'Máximo 120 caracteres').optional(),
  description: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  imageUrl: z.string().max(2048, 'Máximo 2048 caracteres').optional(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['settlement', 'dungeon', 'wilderness', 'landmark', 'building', 'other']).optional(),
  region: z.string().max(120).optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().max(2048).optional(),
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;

export const LOCATION_TYPE_OPTIONS: LocationType[] = [
  'settlement',
  'dungeon',
  'wilderness',
  'landmark',
  'building',
  'other',
];
