import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Trophy } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { getGrimoireBannerFallback } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

import type { Campaign } from '../types';

const SPRING = { damping: 16, stiffness: 280 };
const HEIGHT = 248;

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
  onPress: (campaign: Campaign) => void;
  onLongPress?: (campaign: Campaign) => void;
  style?: ViewStyle;
}

function estimateProgress(campaign: Campaign): number {
  const days = Math.floor((Date.now() - campaign.createdAt.getTime()) / 86400000);
  if (campaign.status === 'completed') return 1;
  if (campaign.status === 'paused') return Math.min(0.5, days / 120);
  return Math.min(0.85, 0.15 + days / 90);
}

function buildMeta(campaign: Campaign): string {
  const parts = [
    campaign.system,
    campaign.playersCount != null
      ? `${campaign.playersCount} ${campaign.playersCount === 1 ? 'jogador' : 'jogadores'}`
      : null,
  ].filter(Boolean);
  return parts.join(' • ');
}

function nextSessionLabel(updatedAt: Date): string {
  const diffDays = Math.ceil((updatedAt.getTime() + 7 * 86400000 - Date.now()) / 86400000);
  if (diffDays <= 0) return 'Próxima sessão: Em breve';
  if (diffDays === 1) return 'Próxima sessão: Amanhã';
  return `Próxima sessão: Em ${diffDays} dias`;
}

export function CampaignCard({ campaign, index, onPress, onLongPress, style }: CampaignCardProps) {
  const scale = useSharedValue(1);
  const progress = estimateProgress(campaign);
  const progressPct = Math.round(progress * 100);
  const meta = buildMeta(campaign);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function press() {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(campaign);
  }

  function longPress() {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.(campaign);
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: 70 + index * 50 }}
      style={style}
    >
      <Pressable
        onPress={press}
        onLongPress={longPress}
        onPressIn={() => {
          scale.value = withSpring(0.985, SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, SPRING);
        }}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <GrimoireImage
            source={
              campaign.coverImageUrl
                ? { uri: campaign.coverImageUrl }
                : getGrimoireBannerFallback(index)
            }
            style={styles.cover}
            recyclingKey={campaign.id}
          />

          <LinearGradient
            colors={[
              'transparent',
              'rgba(11,17,32,0.4)',
              'rgba(11,17,32,0.92)',
              'rgba(11,17,32,0.98)',
            ]}
            locations={[0, 0.4, 0.78, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.top}>
            {campaign.system ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {campaign.system}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <Pressable
              onPress={longPress}
              hitSlop={8}
              style={({ pressed }) => [styles.trophy, pressed && styles.trophyPressed]}
              accessibilityRole="button"
              accessibilityLabel="Ações da campanha"
            >
              <Trophy size={18} color="#FFFFFF" strokeWidth={1.75} />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.title} numberOfLines={2}>
              {campaign.title}
            </Text>
            {meta ? (
              <Text style={styles.meta} numberOfLines={1}>
                {meta}
              </Text>
            ) : null}
            <Text style={styles.nextSession}>{nextSessionLabel(campaign.updatedAt)}</Text>

            <View style={styles.progressRow}>
              <View style={styles.track}>
                <LinearGradient
                  colors={[...premium.gradient]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.fill, { width: `${progressPct}%` }]}
                />
              </View>
              <Text style={styles.progressPct}>{progressPct}%</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    height: HEIGHT,
    borderRadius: premium.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: premium.surface.cardBorder,
  },
  cover: {
    ...StyleSheet.absoluteFill,
  },
  top: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  badge: {
    maxWidth: '68%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: premium.radius.pill,
    backgroundColor: 'rgba(59, 130, 246, 0.28)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(96, 165, 250, 0.4)',
  },
  badgeText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: premium.accentLight,
  },
  trophy: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.65)',
  },
  trophyPressed: {
    opacity: 0.85,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 20,
    gap: 6,
    zIndex: 1,
  },
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: premium.text.primary,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    color: 'rgba(244, 241, 234, 0.72)',
  },
  nextSession: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 13,
    color: premium.accentSoft,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: premium.radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  fill: {
    height: '100%',
    borderRadius: premium.radius.pill,
  },
  progressPct: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 12,
    color: premium.accentLight,
    minWidth: 34,
    textAlign: 'right',
  },
});
