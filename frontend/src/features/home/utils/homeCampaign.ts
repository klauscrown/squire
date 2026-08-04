import type { Campaign } from '@/features/campaign/types';

/** Campanha em destaque na Home: ativa mais recente, senão a mais recente no geral. */
export function resolveHomeFeaturedCampaign(
  campaigns: Campaign[] | undefined | null,
): Campaign | null {
  if (!campaigns?.length) return null;
  const sorted = [...campaigns].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return sorted.find((c) => c.status === 'active') ?? sorted[0] ?? null;
}

export function buildCampaignMeta(campaign: Campaign): string {
  const parts = [
    campaign.system,
    campaign.playersCount != null
      ? `${campaign.playersCount} ${campaign.playersCount === 1 ? 'jogador' : 'jogadores'}`
      : null,
  ].filter(Boolean);
  return parts.join(' · ');
}
