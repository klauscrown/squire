import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { CampaignCard } from '@/features/campaign/components/CampaignCard';
import type { Campaign } from '@/features/campaign/types';
import { HomeSectionHeader } from '@/features/home/components/ui/HomeSectionHeader';
import { premium } from '@/theme/premium';

interface HomeCampaignsCarouselProps {
  campaigns: Campaign[];
}

export function HomeCampaignsCarousel({ campaigns }: HomeCampaignsCarouselProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = width - 56;

  if (!campaigns.length) return null;

  return (
    <View style={styles.section}>
      <HomeSectionHeader
        title="Campanhas"
        actionLabel="Ver todas"
        onActionPress={() => router.push('/(app)/campaigns')}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + 12}
        snapToAlignment="start"
        contentContainerStyle={styles.track}
      >
        {campaigns.map((campaign, index) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            index={index}
            style={{ width: cardWidth, marginRight: 12 }}
            onPress={(c) => router.push(`/(app)/campaigns/${c.id}`)}
            onLongPress={(c) => router.push(`/(app)/campaigns/${c.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: premium.spacing.section,
  },
  track: {
    paddingRight: 4,
  },
});
