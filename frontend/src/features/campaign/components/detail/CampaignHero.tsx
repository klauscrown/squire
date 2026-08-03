import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { getGrimoireBannerFallback } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire';
import type { Campaign } from '@/features/campaign/types';
import { STATUS_LABELS } from '@/features/campaign/types';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { AnimatedPressable } from './AnimatedPressable';

interface CampaignHeroProps {
  campaign: Campaign;
  lastSessionRelative: string;
  bannerIndex?: number;
}

export function CampaignHero({
  campaign,
  lastSessionRelative,
  bannerIndex = 0,
}: CampaignHeroProps) {
  const router = useRouter();
  const grimoire = useGrimoire();

  const metaParts: string[] = [];
  if (campaign.playersCount) {
    metaParts.push(
      `${campaign.playersCount} ${campaign.playersCount === 1 ? 'jogador' : 'jogadores'}`,
    );
  }
  metaParts.push(lastSessionRelative);

  return (
    <View style={styles.heroSection}>
      <GrimoireImage
        source={
          campaign.coverImageUrl
            ? { uri: campaign.coverImageUrl }
            : getGrimoireBannerFallback(bannerIndex)
        }
        style={styles.banner}
        recyclingKey={campaign.id}
      />
      <LinearGradient
        colors={[
          `${grimoire.colors.background}33`,
          `${grimoire.colors.background}99`,
          grimoire.colors.background,
        ]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <AnimatedPressable
            onPress={() => router.back()}
            accessibilityLabel="Voltar"
            style={[
              styles.backButton,
              { borderColor: grimoire.colors.glassBorder },
            ]}
          >
            <ArrowLeft size={16} color={grimoire.colors.ivory} strokeWidth={1.5} />
          </AnimatedPressable>
          <View
            style={[
              styles.statusBadge,
              { borderColor: grimoire.colors.glassGoldBorder },
            ]}
          >
            <Text style={[styles.statusText, { color: grimoire.colors.gold }]}>
              {STATUS_LABELS[campaign.status]}
            </Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          {campaign.system ? (
            <Text style={[styles.system, { color: `${grimoire.colors.gold}CC` }]}>
              {campaign.system}
            </Text>
          ) : null}
          <Text style={[styles.title, { color: grimoire.colors.ivory }]}>{campaign.title}</Text>
          {campaign.description ? (
            <Text
              style={[styles.chapter, { color: `${grimoire.colors.ivoryDim}CC` }]}
              numberOfLines={2}
            >
              {campaign.description}
            </Text>
          ) : (
            <Text style={[styles.chapter, { color: `${grimoire.colors.ivoryDim}CC` }]}>
              {metaParts.join(' · ')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    height: 288,
    position: 'relative',
    overflow: 'hidden',
  },
  banner: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  titleBlock: {
    gap: 4,
  },
  system: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 36,
    lineHeight: 40,
  },
  chapter: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    marginTop: 4,
  },
});
