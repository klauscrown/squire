/**
 * Fachada do domínio Universo.
 * Quando o backend estiver disponível, somente este seletor precisará apontar
 * para a implementação remota, como já acontece nos demais módulos.
 */

export {
  createUniverseConnection,
  createUniverseElement,
  createUniverse,
  deleteUniverseElement,
  getCampaignUniverseLinks,
  getActiveUniverse,
  getUniverseConnections,
  getUniverseElement,
  getUniverseElements,
  getUniverse,
  getUniverses,
  linkCampaignToUniverse,
  selectActiveUniverse,
  unlinkCampaignFromUniverse,
  updateUniverse,
  updateUniverseElement,
} from './universeService.local';
