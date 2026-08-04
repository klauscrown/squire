import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
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

import { GrimoireImage } from '@/components/grimoire';
import { useIsNarrowWidth } from '@/hooks/useLayoutMetrics';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';
import { typeRoles } from '@/theme/typography';
import type { Campaign } from '@/features/campaign/types';

const SUMMARY_MAX = 96;

export interface ActiveCampaignCardProps {
  campaign?: Campaign | null;
  /** Skeleton / loading do card (não da Home inteira). */
  loading?: boolean;
  /** Toque no card (e na ação) — abre a campanha. */
  onPress?: (campaign: Campaign) => void;
  actionLabel?: string;
  style?: ViewStyle;
}

function buildSummary(campaign: Campaign): string {
  const desc = campaign.description?.trim();
  if (desc) {
    if (desc.length <= SUMMARY_MAX) return desc;
    return `${desc.slice(0, SUMMARY_MAX).trim()}…`;
  }

  const bits: string[] = [];
  if (campaign.playersCount != null) {
    bits.push(
      `${campaign.playersCount} ${campaign.playersCount === 1 ? 'jogador' : 'jogadores'}`,
    );
  }
  if (campaign.status === 'active') bits.push('Em andamento');
  if (campaign.status === 'paused') bits.push('Pausada');
  if (campaign.status === 'completed') bits.push('Concluída');

  return bits.length > 0 ? bits.join(' · ') : 'Abra para continuar a crônica.';
}

/**
 * Card reutilizável de campanha ativa — protagonista de telas como a Home.
 * Superfície navy translúcida, borda azul discreta, detalhe dourado e CTA evidente.
 * Funciona sem imagem; com imagem, usa ~38% à direita + overlay escuro.
 */
export function ActiveCampaignCard({
  campaign,
  loading = false,
  onPress,
  actionLabel = 'Continuar campanha',
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
  const minHeight = narrow ? Math.max(148, cfg.minHeight - 20) : cfg.minHeight;

  const navySurface = elevated.background;
  const borderColor = elevated.border;
  const pressedBorder = interactive.pressedBorder;
  const skeleton = cfg.skeleton;

  if (loading || !campaign) {
    return (
      <View
        style={[
          styles.shell,
          {
            minHeight,
            borderRadius: components.radius.lg,
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
            <ActivityIndicator
              color={palette.accent}
              style={{ marginTop: 8, alignSelf: 'flex-start' }}
            />
          </View>
        </View>
      </View>
    );
  }

  /** Em telas estreitas, prioriza legibilidade: sem painel lateral de imagem. */
  const hasImage = Boolean(campaign.coverImageUrl?.trim()) && !narrow;
  const summary = buildSummary(campaign);
  const system = campaign.system?.trim();
  const bodyPadding = narrow ? Math.max(14, cfg.padding - 4) : cfg.padding;

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(campaign!);
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir campanha ${campaign.title}. ${actionLabel}`}
      style={style}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.shell,
            {
              minHeight,
              borderRadius: components.radius.lg,
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
          {/* Conteúdo + imagem lateral */}
          <View style={[styles.row, { minHeight }]}>
            <View
              style={[
                styles.body,
                {
                  padding: bodyPadding,
                  paddingRight: hasImage ? 12 : bodyPadding,
                  flex: hasImage ? 1 - cfg.imageWidthRatio : 1,
                },
              ]}
            >
              {/* Detalhe dourado discreto */}
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

              <View style={styles.copy}>
                {system ? (
                  <Text style={[styles.system, { color: palette.accent }]} numberOfLines={1}>
                    {system}
                  </Text>
                ) : null}

                <Text
                  style={[styles.title, { color: palette.textPrimary }]}
                  numberOfLines={2}
                  maxFontSizeMultiplier={1.3}
                >
                  {campaign.title}
                </Text>

                <Text
                  style={[styles.summary, { color: palette.textSecondary }]}
                  numberOfLines={narrow ? 3 : 2}
                  maxFontSizeMultiplier={1.35}
                >
                  {summary}
                </Text>

                <View
                  style={[
                    styles.cta,
                    {
                      borderRadius: cta.radius,
                      backgroundColor: palette.buttonPrimary,
                      marginTop: 12,
                      minHeight: MIN_TOUCH_TARGET - 8,
                    },
                  ]}
                  pointerEvents="none"
                >
                  <Text style={[styles.ctaLabel, { color: cta.foreground }]}>{actionLabel}</Text>
                  <ChevronRight size={16} color={cta.foreground} strokeWidth={2.2} />
                </View>
              </View>
            </View>

            {hasImage ? (
              <View
                style={[
                  styles.imagePanel,
                  {
                    width: `${cfg.imageWidthRatio * 100}%` as `${number}%`,
                    borderTopRightRadius: components.radius.lg,
                    borderBottomRightRadius: components.radius.lg,
                  },
                ]}
              >
                <GrimoireImage
                  source={{ uri: campaign.coverImageUrl! }}
                  style={styles.image}
                  contentFit="cover"
                  recyclingKey={campaign.id}
                  onLoad={() => setImageReady(true)}
                />
                {/* Overlay escuro para legibilidade / soft fade da esquerda */}
                <LinearGradient
                  colors={[
                    navySurface,
                    cfg.imageOverlayMid,
                    cfg.imageOverlayEnd,
                  ]}
                  locations={[0, 0.35, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
                {!imageReady ? (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      { backgroundColor: skeleton.mid },
                    ]}
                  />
                ) : null}
              </View>
            ) : null}
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
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    zIndex: 1,
  },
  goldAccent: {
    marginTop: 4,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  system: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
  },
  title: {
    ...typeRoles.title,
  },
  summary: {
    ...typeRoles.editorialSm,
    marginTop: 2,
  },
  cta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  ctaLabel: {
    ...typeRoles.buttonSm,
  },
  imagePanel: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  loadingBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  loadingCopy: {
    flex: 1,
    gap: 10,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },
});
