/**
 * Feature Home — composição da tela de início do mestre.
 *
 * UI da home em `./components`; utilitários em `./utils`.
 * Superfícies genéricas e atmosfera: `@/components/ui`, `@/components/grimoire`.
 */
export * from './components';
export { resolveHomeFeaturedCampaign } from './utils/homeCampaign';
export {
  formatSessionDate,
  formatSessionTime,
  preparationStatusLabel,
  resolveNextSession,
} from './utils/nextSession';
export { resolveSquireContext } from './utils/squireContext';
export type { SquireContextContent, SquireContextKind } from './utils/squireContext';
