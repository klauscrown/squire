import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ROUTES } from '@/constants';
import { GrimoireFadeIn, GrimoireScreen } from '@/components/grimoire';
import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { useGetCampaigns } from '@/features/campaign/hooks';
import { HomeAmbientGlow } from '@/features/home/components/HomeAmbientGlow';
import { HomeCampaignsCarousel } from '@/features/home/components/HomeCampaignsCarousel';
import { HomeCreateCampaignCard } from '@/features/home/components/HomeCreateCampaignCard';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { HomeSearchBar } from '@/features/home/components/HomeSearchBar';
import { MasterShortcutsSection } from '@/features/home/components/MasterShortcutsSection';
import { SquireMascotFab } from '@/features/home/components/SquireMascotFab';
import { SquireMascotPopup } from '@/features/home/components/SquireMascotPopup';
import { useComponents } from '@/hooks/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const { create } = useLocalSearchParams<{ create?: string }>();
  const { data: campaigns } = useGetCampaigns();
  const components = useComponents();
  const fab = components.mascotFab;
  const [search, setSearch] = useState('');
  const [showSquirePopup, setShowSquirePopup] = useState(false);

  const carouselCampaigns = useMemo(() => {
    if (!campaigns?.length) return [];
    const active = campaigns.filter((c) => c.status === 'active');
    const pool = active.length ? active : campaigns;
    return [...pool].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 8);
  }, [campaigns]);

  function openCreate() {
    router.push(ROUTES.app.campaignCreate);
  }

  function openSquirePopup() {
    setShowSquirePopup(true);
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
        backgroundOverlay={<HomeAmbientGlow />}
        bottomInset={CURVED_TAB_BAR_FOOTPRINT - 8}
      >
        <GrimoireFadeIn>
          <HomeHeader subtitle="Pronto para criar histórias épicas?" />
        </GrimoireFadeIn>

        <GrimoireFadeIn delay={40}>
          <HomeSearchBar value={search} onChangeText={setSearch} />
        </GrimoireFadeIn>

        {carouselCampaigns.length > 0 ? (
          <GrimoireFadeIn delay={80}>
            <HomeCampaignsCarousel campaigns={carouselCampaigns} />
          </GrimoireFadeIn>
        ) : (
          <GrimoireFadeIn delay={80}>
            <HomeCreateCampaignCard onPress={openCreate} />
          </GrimoireFadeIn>
        )}

        <MasterShortcutsSection />

        <View
          style={[
            styles.mascotRow,
            {
              marginTop: fab.rowMarginTop,
              marginBottom: -fab.rowPullDown,
            },
          ]}
          pointerEvents="box-none"
        >
          <SquireMascotFab onPress={openSquirePopup} />
        </View>
      </GrimoireScreen>

      <SquireMascotPopup visible={showSquirePopup} onClose={() => setShowSquirePopup(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mascotRow: {
    alignSelf: 'flex-start',
    zIndex: 10,
  },
});
