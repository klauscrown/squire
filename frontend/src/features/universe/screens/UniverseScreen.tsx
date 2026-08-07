import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { GrimoireScreen } from '@/components/grimoire';
import { ROUTES } from '@/constants';
import { useGetCampaigns } from '@/features/campaign/hooks';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

import { UniverseActiveState } from '../components/UniverseActiveState';
import { UniverseEmptyState } from '../components/UniverseEmptyState';
import { UniverseReadyState } from '../components/UniverseReadyState';
import { LINKED_CAMPAIGNS } from '../data/demoUniverse';
import {
  useGetActiveUniverse,
  useGetCampaignUniverseLinks,
  useGetUniverseElements,
} from '../hooks';
import { useUniverseCreationStore } from '../store/useUniverseCreationStore';
import type { LinkedCampaignSummary } from '../types';

export function UniverseScreen() {
  const router = useRouter();
  const palette = useActivePalette();
  const components = useComponents();
  const { data: activeUniverse, isLoading: isLoadingUniverse } = useGetActiveUniverse();
  const { data: universeElements = [], isLoading: isLoadingElements } = useGetUniverseElements(
    activeUniverse?.id,
  );
  const { data: campaignLinks = [] } = useGetCampaignUniverseLinks(activeUniverse?.id);
  const { data: campaigns = [] } = useGetCampaigns();
  const openCreationMenu = useUniverseCreationStore((store) => store.openMenu);
  const openElementDetail = useUniverseCreationStore((store) => store.openDetail);
  const openLibrary = useUniverseCreationStore((store) => store.openLibrary);
  const openUniverseForm = useUniverseCreationStore((store) => store.openUniverseForm);
  const openUniverseOptions = useUniverseCreationStore((store) => store.openUniverseOptions);
  const openCampaignLink = useUniverseCreationStore((store) => store.openCampaignLink);

  const linkedCampaigns = campaignLinks.flatMap((link): LinkedCampaignSummary[] => {
    const campaign = campaigns.find((candidate) => candidate.id === link.campaignId);
    if (campaign) {
      return [
        {
          id: campaign.id,
          title: campaign.title,
          system: campaign.system || 'Sistema não informado',
          status:
            campaign.status === 'active'
              ? 'Ativa'
              : campaign.status === 'paused'
                ? 'Pausada'
                : 'Concluída',
          usedElements: universeElements.filter(
            (element) => element.linkedCampaignName === campaign.title,
          ).length,
        },
      ];
    }

    const demoCampaign = LINKED_CAMPAIGNS.find((candidate) => candidate.id === link.campaignId);
    return demoCampaign ? [{ ...demoCampaign }] : [];
  });

  function openCampaign(campaignId: string) {
    const campaign = campaigns.find((candidate) => candidate.id === campaignId);
    if (campaign) {
      router.push(`/(app)/campaigns/${campaign.id}`);
      return;
    }

    const demo = LINKED_CAMPAIGNS.find((candidate) => candidate.id === campaignId);
    if (demo) {
      Alert.alert(demo.title, `${demo.status} · ${demo.usedElements} elementos deste universo`);
    }
  }

  const isLoading = isLoadingUniverse || (Boolean(activeUniverse) && isLoadingElements);

  return (
    <GrimoireScreen
      glow="purple-left"
      wide
      tabBarExtraPadding={components.home.tabBarExtraPad + components.home.bottomSpacer}
    >
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.accent} />
        </View>
      ) : !activeUniverse ? (
        <UniverseEmptyState
          onCreate={() => openUniverseForm('create')}
          onLearnMore={() =>
            Alert.alert(
              'Como funciona',
              'O universo guarda o cenário. Campanhas usam esse mundo, sessões registram acontecimentos e fragmentos preservam ideias rápidas.',
            )
          }
        />
      ) : universeElements.length === 0 ? (
        <UniverseReadyState
          universe={activeUniverse}
          onOptions={openUniverseOptions}
          onCreateFirst={() => openCreationMenu()}
          onAddFragment={() => openCreationMenu('fragment')}
          onLinkCampaign={openCampaignLink}
        />
      ) : (
        <UniverseActiveState
          universe={activeUniverse}
          linkedCampaigns={linkedCampaigns}
          onOptions={openUniverseOptions}
          onAddFragment={() => openCreationMenu('fragment')}
          onViewFragments={() => openLibrary('fragment')}
          onOpenArchive={() => openLibrary('archive')}
          onLinkCampaign={openCampaignLink}
          onCreateCampaign={() => router.push(ROUTES.app.campaignCreate)}
          onOpenElement={openElementDetail}
          onOpenCampaign={openCampaign}
        />
      )}
    </GrimoireScreen>
  );
}

const styles = StyleSheet.create({
  loading: {
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
