import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { ROUTES } from '@/constants';
import { GrimoireFadeIn, GrimoireScreen } from '@/components/grimoire';
import { useGetCampaigns } from '@/features/campaign/hooks';
import { HomeCampaignsCarousel } from '@/features/home/components/HomeCampaignsCarousel';
import { HomeCreateCampaignCard } from '@/features/home/components/HomeCreateCampaignCard';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { HomeSearchBar } from '@/features/home/components/HomeSearchBar';
import { MasterShortcutsSection } from '@/features/home/components/MasterShortcutsSection';

export default function HomeScreen() {
  const router = useRouter();
  const { create } = useLocalSearchParams<{ create?: string }>();
  const { data: campaigns } = useGetCampaigns();
  const [search, setSearch] = useState('');

  const carouselCampaigns = useMemo(() => {
    if (!campaigns?.length) return [];
    const active = campaigns.filter((c) => c.status === 'active');
    const pool = active.length ? active : campaigns;
    return [...pool].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 8);
  }, [campaigns]);

  function openCreate() {
    router.push(ROUTES.app.campaignCreate);
  }

  useEffect(() => {
    if (create !== '1') return;
    openCreate();
    router.setParams({ create: undefined });
  }, [create, router]);

  return (
    <GrimoireScreen glow="none">
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
    </GrimoireScreen>
  );
}
