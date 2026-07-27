/**
 * Serviço local de locais (memória).
 */

import type { CreateLocationInput, Location, UpdateLocationInput } from '../types';

let store: Location[] = [];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function getLocations(campaignId: string): Promise<Location[]> {
  return store
    .filter((location) => location.campaignId === campaignId)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export async function getLocation(id: string): Promise<Location> {
  const location = store.find((item) => item.id === id);
  if (!location) throw new Error('Local não encontrado.');
  return location;
}

export async function createLocation(
  input: CreateLocationInput,
  campaignId: string,
): Promise<Location> {
  const now = new Date();

  const location: Location = {
    id: generateId(),
    campaignId,
    name: input.name,
    type: input.type ?? 'other',
    region: input.region || undefined,
    description: input.description ?? '',
    imageUrl: input.imageUrl || undefined,
    createdAt: now,
    updatedAt: now,
  };

  store = [location, ...store];
  return location;
}

export async function updateLocation(id: string, input: UpdateLocationInput): Promise<void> {
  store = store.map((location) =>
    location.id === id ? { ...location, ...input, updatedAt: new Date() } : location,
  );
}

export async function deleteLocation(id: string): Promise<void> {
  store = store.filter((location) => location.id !== id);
}
