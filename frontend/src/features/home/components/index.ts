/**
 * Componentes da Home (feature).
 *
 * Mapeamento da estrutura sugerida → padrão do projeto:
 * - AtmosphericBackground → `@/components/grimoire` (compartilhado, não Home-only)
 * - SurfaceCard           → `@/components/ui`
 * - HomeHeader, ActiveCampaignCard, NextSessionCard, QuickActionsGrid → este diretório
 */
export { HomeHeader } from './HomeHeader';
export { ActiveCampaignCard } from './ActiveCampaignCard';
export type { ActiveCampaignCardProps } from './ActiveCampaignCard';
export { HomeActiveCampaign } from './HomeActiveCampaign';
export { HomeCreateCampaignCard } from './HomeCreateCampaignCard';
export { HomeNextSessionSection } from './HomeNextSessionSection';
export { NextSessionCard } from './NextSessionCard';
export type { NextSessionCardProps } from './NextSessionCard';
export { QuickActionsGrid } from './QuickActionsGrid';
export type { QuickActionsGridProps } from './QuickActionsGrid';
export { HomeCampaignError } from './HomeCampaignError';
