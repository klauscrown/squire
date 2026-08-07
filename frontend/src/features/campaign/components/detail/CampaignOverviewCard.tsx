import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { getGrimoireBannerFallback } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire';
import { SurfaceCard } from '@/components/ui';
import type { CampaignModuleStats } from '@/features/campaign/constants/modules';
import type { Campaign } from '@/features/campaign/types';
import { CampaignStatusBadge } from '@/features/campaign/components/CampaignStatusBadge';
import { useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily, typeRoles } from '@/theme/typography';

interface CampaignOverviewCardProps {
  campaign: Campaign;
  stats: CampaignModuleStats;
  progress: number;
  bannerIndex?: number;
}

/**
 * Card protagonista — capa com altura equilibrada (legível sem dominar a tela).
 */
export function CampaignOverviewCard({
  campaign,
  stats,
  progress,
  bannerIndex = 0,
}: CampaignOverviewCardProps) {
  const grimoire = useGrimoire();
  const palette = useActivePalette();
  const percent = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  const metaParts: string[] = [];
  if (campaign.playersCount != null) {
    metaParts.push(
      `${campaign.playersCount} ${campaign.playersCount === 1 ? 'jogador' : 'jogadores'}`,
    );
  }
  if (stats.sessions > 0) {
    metaParts.push(
      `${stats.sessions} ${stats.sessions === 1 ? 'sessão' : 'sessões'}`,
    );
  } else if (campaign.system) {
    metaParts.push(campaign.system);
  }

  return (
    <SurfaceCard
      variant="elevated"
      radius="md"
      padding="none"
      shadow={false}
      style={styles.shell}
      contentStyle={styles.content}
      accessibilityLabel={`Campanha ${campaign.title}`}
    >
      <View style={styles.imageBlock}>
        <GrimoireImage
          source={
            campaign.coverImageUrl
              ? { uri: campaign.coverImageUrl }
              : getGrimoireBannerFallback(bannerIndex)
          }
          style={styles.image}
          contentFit="cover"
          recyclingKey={`${campaign.id}-overview`}
        />
        <LinearGradient
          colors={[
            'transparent',
            'rgba(2, 8, 24, 0.4)',
            'rgba(2, 8, 24, 0.92)',
            grimoire.backgroundAtmosphericBottom,
          ]}
          locations={[0, 0.32, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: palette.textPrimary }]}
              numberOfLines={2}
              maxFontSizeMultiplier={1.25}
            >
              {campaign.title}
            </Text>
            <CampaignStatusBadge status={campaign.status} size="small" />
          </View>

          {metaParts.length > 0 ? (
            <Text style={[styles.meta, { color: palette.textSecondary }]} numberOfLines={1}>
              {metaParts.join(' · ')}
            </Text>
          ) : null}

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: `${palette.accent}CC` }]}>
                Progresso da crônica
              </Text>
              <Text style={[styles.progressPercent, { color: palette.primaryLight }]}>
                {percent}%
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
              <LinearGradient
                colors={[palette.primary, palette.primaryLight]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.fill, { width: `${percent}%` }]}
              />
            </View>
          </View>
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: 18,
  },
  content: {
    padding: 0,
  },
  imageBlock: {
    height: 168,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  copy: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 36,
    gap: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    ...typeRoles.title,
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 20,
    lineHeight: 25,
    flex: 1,
    minWidth: 0,
  },
  meta: {
    ...typeRoles.caption,
    fontSize: 12,
    lineHeight: 16,
  },
  progressBlock: {
    marginTop: 4,
    gap: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 11,
  },
  track: {
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
