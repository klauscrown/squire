import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Trophy } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { getGrimoireBannerFallback } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire';
import { usePremium } from '@/hooks/useTheme';
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
  const premium = usePremium();
  const scale = useSharedValue(1);
  const progress = estimateProgress(campaign);
  const progressPct = Math.round(progress * 100);
  const meta = buildMeta(campaign);
  const scrim = premium.surface.scrim;

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
        <Animated.View
          style={[
            styles.card,
            {
              borderRadius: premium.radius.xl,
              borderColor: premium.surface.cardBorder,
              ...Platform.select({
                ios: {
                  shadowColor: premium.shadow.color,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                },
                android: {
                  elevation: 6,
                },
                default: {},
              }),
            },
            animatedStyle,
          ]}
        >
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
            colors={['transparent', scrim.soft, scrim.mid, scrim.start]}
            locations={[0, 0.38, 0.72, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.top}>
            {campaign.system ? (
              <View
                style={[
                  styles.badge,
                  {
                    borderRadius: premium.radius.pill,
                    backgroundColor: premium.surface.icon,
                    borderColor: premium.surface.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: premium.accentLight }]}
                  numberOfLines={1}
                >
                  {campaign.system}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <Pressable
              onPress={longPress}
              hitSlop={8}
              style={({ pressed }) => [
                styles.trophy,
                {
                  backgroundColor: premium.surface.icon,
                  borderColor: premium.surface.cardBorder,
                },
                pressed && styles.trophyPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ações da campanha"
            >
              <Trophy size={18} color={premium.foregroundOnGradient} strokeWidth={1.75} />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.title, { color: premium.text.primary }]} numberOfLines={2}>
              {campaign.title}
            </Text>
            {meta ? (
              <Text style={[styles.meta, { color: premium.text.secondary }]} numberOfLines={1}>
                {meta}
              </Text>
            ) : null}
            <Text style={[styles.nextSession, { color: premium.text.accent }]}>
              {nextSessionLabel(campaign.updatedAt)}
            </Text>

            <View style={styles.progressRow}>
              <View
                style={[
                  styles.track,
                  {
                    borderRadius: premium.radius.pill,
                    backgroundColor: premium.surface.divider,
                  },
                ]}
              >
                <LinearGradient
                  colors={[...premium.gradient]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[
                    styles.fill,
                    { width: `${progressPct}%`, borderRadius: premium.radius.pill },
                  ]}
                />
              </View>
              <Text style={[styles.progressPct, { color: premium.accentLight }]}>
                {progressPct}%
              </Text>
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
    overflow: 'hidden',
    borderWidth: 1,
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
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  trophy: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
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
    fontFamily: fontFamily.cinzel.semibold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  nextSession: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 13,
    lineHeight: 18,
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
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  progressPct: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 12,
    minWidth: 34,
    textAlign: 'right',
  },
});
