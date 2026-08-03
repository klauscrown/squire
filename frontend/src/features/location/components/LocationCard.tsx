import { useRouter } from 'expo-router';
import { Castle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { GrimoireImage, GrimoireListCard } from '@/components/grimoire';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import type { Location } from '../types';
import { LocationTypeBadge } from './LocationTypeBadge';

interface LocationCardProps {
  location: Location;
  campaignId: string;
}

export function LocationCard({ location, campaignId }: LocationCardProps) {
  const router = useRouter();
  const grimoire = useGrimoire();
  const hasImage = Boolean(location.imageUrl?.trim());

  return (
    <GrimoireListCard
      onPress={() => router.push(`/(app)/campaigns/${campaignId}/locations/${location.id}`)}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.thumbWrap,
            {
              borderRadius: grimoire.radius.md,
              borderColor: grimoire.colors.glassGoldBorder,
              backgroundColor: grimoire.colors.glass,
            },
          ]}
        >
          {hasImage ? (
            <GrimoireImage
              source={{ uri: location.imageUrl! }}
              style={styles.thumb}
              recyclingKey={location.id}
            />
          ) : (
            <View
              style={[
                styles.thumbFallback,
                { backgroundColor: `${grimoire.colors.purpleMid}44` },
              ]}
            >
              <Castle size={22} color={grimoire.colors.goldMuted} strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: grimoire.colors.ivory }]} numberOfLines={1}>
              {location.name}
            </Text>
            <LocationTypeBadge type={location.type} />
          </View>

          {location.region ? (
            <Text style={[styles.region, { color: grimoire.colors.gold }]} numberOfLines={1}>
              {location.region}
            </Text>
          ) : null}

          {location.description ? (
            <Text
              style={[styles.description, { color: `${grimoire.colors.ivoryDim}CC` }]}
              numberOfLines={2}
            >
              {location.description}
            </Text>
          ) : null}
        </View>
      </View>
    </GrimoireListCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    overflow: 'hidden',
    borderWidth: 1,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 20,
  },
  region: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    marginBottom: 4,
  },
  description: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
