import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GrimoireFadeIn, GrimoireScreen } from '@/components/grimoire';
import { ROUTES } from '@/constants';
import { useGetCampaigns } from '@/features/campaign/hooks';
import {
  HomeActiveCampaign,
  HomeCampaignError,
  HomeCreateCampaignCard,
  HomeHeader,
  HomeNextSessionSection,
  HomePendingSection,
  QuickActionsGrid,
  resolveHomeFeaturedCampaign,
} from '@/features/home';
import { useComponents } from '@/hooks/useTheme';
import { motion } from '@/theme/motion';

/**
 * Home — orquestra seções. UI e dados ficam em `features/home`.
 *
 * Hierarquia do painel de preparação do mestre:
 * 1. Cabeçalho (onboarding | jornada)
 * 2. Campanha ativa / empty de criar crônica
 * 3. Pendências (se há campanha)
 * 4. Próxima sessão (se há sessão real)
 * 5. Atalhos (só com campanha)
 */
export default function HomeScreen() {
  const router = useRouter();
  const { create } = useLocalSearchParams<{ create?: string }>();
  const { data: campaigns, isLoading, isError, refetch } = useGetCampaigns();
  const home = useComponents().home;

  const featured = useMemo(() => resolveHomeFeaturedCampaign(campaigns), [campaigns]);
  const headerMode = !isError && !isLoading && !featured ? 'onboarding' : 'journey';

  function openCreate() {
    router.push(ROUTES.app.campaignCreate);
  }

  function openCampaign(id: string) {
    router.push(`/(app)/campaigns/${id}`);
  }

  function openCampaignsList() {
    router.push('/(app)/campaigns');
  }

  useEffect(() => {
    if (create !== '1') return;
    openCreate();
    router.setParams({ create: undefined });
  }, [create, router]);

  return (
    <View style={styles.root}>
      <GrimoireScreen
        glow="none"
        scrollable
        tabBarExtraPadding={home.tabBarExtraPad + home.bottomSpacer}
      >
        <GrimoireFadeIn delay={motion.home.header}>
          <HomeHeader mode={headerMode} />
        </GrimoireFadeIn>

        {isError ? (
          <HomeCampaignError onRetry={() => void refetch()} />
        ) : isLoading ? (
          <GrimoireFadeIn delay={motion.home.campaign}>
            <HomeActiveCampaign loading onPress={() => undefined} />
          </GrimoireFadeIn>
        ) : featured ? (
          <GrimoireFadeIn delay={motion.home.campaign}>
            <HomeActiveCampaign
              campaign={featured}
              onPress={(c) => openCampaign(c.id)}
              onViewAll={openCampaignsList}
            />
          </GrimoireFadeIn>
        ) : (
          <GrimoireFadeIn delay={motion.home.campaign}>
            <HomeCreateCampaignCard onPress={openCreate} />
          </GrimoireFadeIn>
        )}

        {featured ? (
          <GrimoireFadeIn delay={motion.home.campaign + motion.staggerMs}>
            <HomePendingSection campaign={featured} />
          </GrimoireFadeIn>
        ) : null}

        {featured ? (
          <GrimoireFadeIn delay={motion.home.nextSession}>
            <HomeNextSessionSection campaign={featured} />
          </GrimoireFadeIn>
        ) : null}

        {featured ? <QuickActionsGrid campaignId={featured.id} /> : null}
      </GrimoireScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
