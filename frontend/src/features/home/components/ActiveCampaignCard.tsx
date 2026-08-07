import * as Haptics from 'expo-haptics';
import { CalendarDays, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { getGrimoireBannerFallback } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire';
import { CampaignStatusBadge } from '@/features/campaign/components/CampaignStatusBadge';
import type { Campaign } from '@/features/campaign/types';
import { useIsCompactWidth, useIsNarrowWidth } from '@/hooks/useLayoutMetrics';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';
import { typeRoles } from '@/theme/typography';

export interface ActiveCampaignCardProps {
  campaign?: Campaign | null;
  /** Skeleton / loading do card (não da Home inteira). */
  loading?: boolean;
  /** Toque no card (e na ação) — abre a campanha. */
  onPress?: (campaign: Campaign) => void;
  actionLabel?: string;
  /**
   * Linha da próxima sessão (já resolvida).
   * Se omitido / null e não loading de sessão: “Próxima sessão ainda não agendada”.
   */
  nextSessionLine?: string | null;
  /** Carregando informação de sessão (placeholder discreto). */
  nextSessionLoading?: boolean;
  style?: ViewStyle;
}

const NO_SESSION_LINE = 'Próxima sessão ainda não agendada';

/**
 * Card protagonista de campanha ativa — copy + capa em cartão lateral + CTA.
 */
export function ActiveCampaignCard({
  campaign,
  loading = false,
  onPress,
  actionLabel = 'Continuar',
  nextSessionLine = null,
  nextSessionLoading = false,
  style,
}: ActiveCampaignCardProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const components = useComponents();
  const cfg = components.home.activeCampaign;
  const surface = components.surfaceCard;
  const elevated = surface.variants.elevated;
  const interactive = surface.variants.interactive;
  const cta = components.cta;
  const { animatedStyle, setPressed } = usePressScale(motion.press.scale);
  const [imageReady, setImageReady] = useState(false);
  const narrow = useIsNarrowWidth();
  const compact = useIsCompactWidth();
  const minHeight = narrow ? Math.max(152, cfg.minHeight - 16) : cfg.minHeight;
  const coverWidth = compact ? 86 : narrow ? 96 : 108;
  const coverHeight = Math.round(coverWidth * 1.28);

  const navySurface = elevated.background;
  const borderColor = elevated.border;
  const borderWidth = surface.borderWidth;
  const pressedBorder = interactive.pressedBorder;
  const skeleton = cfg.skeleton;
  const coverRadius = components.radius.md - 2;

  if (loading || !campaign) {
    return (
      <View
        style={[
          styles.shell,
          {
            minHeight,
            borderRadius: components.radius.lg,
            borderWidth,
            borderColor,
            backgroundColor: navySurface,
            padding: cfg.padding,
          },
          style,
        ]}
        accessibilityState={{ busy: true }}
        accessibilityLabel="Carregando campanha ativa"
      >
        <View style={styles.loadingBody}>
          <View style={styles.loadingCopy}>
            <View
              style={[
                styles.skeletonLine,
                { width: '42%', backgroundColor: skeleton.mid },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                { width: '72%', height: 18, backgroundColor: skeleton.strong },
              ]}
            />
            <View
              style={[
                styles.skeletonLine,
                { width: '88%', backgroundColor: skeleton.soft },
              ]}
            />
            <ActivityIndicator color={palette.accent} style={styles.loadingSpinner} />
          </View>
          <View
            style={[
              styles.coverShell,
              {
                width: coverWidth,
                height: coverHeight,
                borderRadius: coverRadius,
                borderWidth,
                borderColor,
                backgroundColor: skeleton.mid,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  const bodyPadding = compact ? Math.max(12, cfg.padding - 6) : narrow ? Math.max(14, cfg.padding - 4) : cfg.padding;
  const sessionLine = !nextSessionLine?.trim() ? NO_SESSION_LINE : nextSessionLine.trim();
  const showSessionSkeleton = nextSessionLoading;
  const coverSource = campaign.coverImageUrl?.trim()
    ? { uri: campaign.coverImageUrl.trim() }
    : getGrimoireBannerFallback(0);

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(campaign!);
  }

  const a11ySession = showSessionSkeleton ? 'Carregando próxima sessão' : sessionLine;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={`${campaign.title}. ${a11ySession}. ${actionLabel}`}
      style={style}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.shell,
            {
              minHeight,
              borderRadius: components.radius.lg,
              borderWidth,
              borderColor: pressed ? pressedBorder : borderColor,
              backgroundColor: navySurface,
              opacity: pressed ? opacity.level.pressed : 1,
              ...Platform.select({
                ios: {
                  shadowColor: elevated.shadow.color,
                  shadowOffset: { width: 0, height: elevated.shadow.offsetY },
                  shadowOpacity: elevated.shadow.opacity,
                  shadowRadius: elevated.shadow.radius,
                },
                android: {
                  elevation: elevated.shadow.elevation,
                },
                default: {},
              }),
            },
            animatedStyle,
          ]}
        >
          <View style={[styles.row, { minHeight, padding: bodyPadding }]}>
            <View style={styles.copy}>
              <View style={styles.metaRow}>
                <View style={styles.indicatorRow}>
                  <View
                    style={[
                      styles.goldAccent,
                      {
                        width: cfg.goldAccentWidth,
                        height: cfg.goldAccentHeight,
                        backgroundColor: palette.accent,
                        borderRadius: cfg.goldAccentWidth,
                      },
                    ]}
                  />
                  <Text style={[styles.indicator, { color: palette.accent }]} numberOfLines={1}>
                    Campanha ativa
                  </Text>
                </View>
                <CampaignStatusBadge status={campaign.status} size="small" />
              </View>

              <Text
                style={[styles.title, { color: palette.textPrimary }]}
                numberOfLines={2}
                maxFontSizeMultiplier={1.3}
              >
                {campaign.title}
              </Text>

              <View style={styles.sessionRow}>
                <CalendarDays size={13} color={palette.accent} strokeWidth={1.75} />
                {showSessionSkeleton ? (
                  <View style={[styles.sessionSkeleton, { backgroundColor: skeleton.mid }]} />
                ) : (
                  <Text
                    style={[styles.sessionLine, { color: palette.textSecondary }]}
                    numberOfLines={2}
                    maxFontSizeMultiplier={1.3}
                  >
                    {sessionLine}
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.cta,
                  {
                    borderRadius: cta.radius,
                    backgroundColor: palette.buttonPrimary,
                    minHeight: MIN_TOUCH_TARGET - 8,
                  },
                ]}
                pointerEvents="none"
              >
                <Text style={[styles.ctaLabel, { color: cta.foreground }]}>{actionLabel}</Text>
                <ChevronRight size={16} color={cta.foreground} strokeWidth={2.2} />
              </View>
            </View>

            {/* Capa do RPG — cartão lateral (real ou fallback do grimório) */}
            <View
              style={[
                styles.coverShell,
                {
                  width: coverWidth,
                  height: coverHeight,
                  borderRadius: coverRadius,
                  borderWidth,
                  borderColor: pressed ? pressedBorder : borderColor,
                  ...Platform.select({
                    ios: {
                      shadowColor: elevated.shadow.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.28,
                      shadowRadius: 8,
                    },
                    android: { elevation: 4 },
                    default: {},
                  }),
                },
              ]}
            >
              <GrimoireImage
                source={coverSource}
                style={styles.coverImage}
                contentFit="cover"
                recyclingKey={`${campaign.id}-home-cover`}
                onLoad={() => setImageReady(true)}
              />
              {!imageReady && campaign.coverImageUrl?.trim() ? (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: skeleton.mid }]} />
              ) : null}
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 8,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    minWidth: 0,
  },
  goldAccent: {
    flexShrink: 0,
  },
  indicator: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  title: {
    ...typeRoles.title,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionLine: {
    ...typeRoles.caption,
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
  },
  sessionSkeleton: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },
  cta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  ctaLabel: {
    ...typeRoles.buttonSm,
  },
  coverShell: {
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: 'rgba(4, 12, 28, 0.55)',
  },
  coverImage: {
    ...StyleSheet.absoluteFill,
  },
  loadingBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  loadingCopy: {
    flex: 1,
    gap: 10,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },
  loadingSpinner: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});
