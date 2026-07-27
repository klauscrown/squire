import { shouldUseLocalBackend } from '@/services/dataBackend';

import type { CreateLocationInput, Location, UpdateLocationInput } from '../types';

import * as local from './locationsService.local';
import * as remote from './locationsService.supabase';

function getSvc() {
  return shouldUseLocalBackend() ? local : remote;
}

export async function getLocations(campaignId: string): Promise<Location[]> {
  return getSvc().getLocations(campaignId);
}

export async function getLocation(id: string): Promise<Location> {
  return getSvc().getLocation(id);
}

export async function createLocation(
  input: CreateLocationInput,
  campaignId: string,
): Promise<Location> {
  return getSvc().createLocation(input, campaignId);
}

export async function updateLocation(id: string, input: UpdateLocationInput): Promise<void> {
  return getSvc().updateLocation(id, input);
}

export async function deleteLocation(id: string): Promise<void> {
  return getSvc().deleteLocation(id);
}
