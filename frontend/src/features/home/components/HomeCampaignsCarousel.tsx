import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { SectionHeader } from '@/components/ui';
import { CampaignCard } from '@/features/campaign/components/CampaignCard';
import type { Campaign } from '@/features/campaign/types';
import { useComponents } from '@/hooks/useTheme';

interface HomeCampaignsCarouselProps {
  campaigns: Campaign[];
}

export function HomeCampaignsCarousel({ campaigns }: HomeCampaignsCarouselProps) {
  const router = useRouter();
  const components = useComponents();
  const { width } = useWindowDimensions();
  const cardWidth = width - 56;
  const home = components.home;

  if (!campaigns.length) return null;

  return (
    <View style={{ marginTop: home.sectionGap }}>
      <SectionHeader
        title="Campanhas"
        actionLabel="Ver todas"
        onActionPress={() => router.push('/(app)/campaigns')}
        isFirst
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + components.spacing.grid}
        snapToAlignment="start"
        contentContainerStyle={styles.track}
      >
        {campaigns.map((campaign, index) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            index={index}
            style={{
              width: cardWidth,
              height: home.campaignCardHeight,
              marginRight: components.spacing.grid,
            }}
            onPress={(c) => router.push(`/(app)/campaigns/${c.id}`)}
            onLongPress={(c) => router.push(`/(app)/campaigns/${c.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    paddingRight: 4,
  },
});
