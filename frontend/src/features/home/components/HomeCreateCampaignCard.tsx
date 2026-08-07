import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import { getGrimoireBannerFallback } from '@/assets/grimoire';
import { GrimoireImage } from '@/components/grimoire';
import { useIsCompactWidth } from '@/hooks/useLayoutMetrics';
import { usePressScale } from '@/hooks/usePressScale';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { motion } from '@/theme/motion';
import { typeRoles } from '@/theme/typography';

interface HomeCreateCampaignCardProps {
  onPress: () => void;
}

/**
 * Empty state — hero com capa generosa (preenche o vazio da Home sem campanha).
 * Capa em cima, copy + CTA embaixo; mesmo idioma de borda ouro dos demais cards.
 */
export function HomeCreateCampaignCard({ onPress }: HomeCreateCampaignCardProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const components = useComponents();
  const cfg = components.home.activeCampaign;
  const surface = components.surfaceCard;
  const elevated = surface.variants.elevated;
  const interactive = surface.variants.interactive;
  const cta = components.cta;
  const home = components.home;
  const { animatedStyle, setPressed } = usePressScale(motion.press.scale);
  const compact = useIsCompactWidth();
  const { height: windowHeight } = useWindowDimensions();

  const borderWidth = surface.borderWidth;
  const bodyPadding = compact ? Math.max(14, cfg.padding - 4) : cfg.padding + 2;
  /** Capa ~28–34% da viewport, com teto/piso estáveis em telas curtas/longas */
  const coverHeight = Math.round(
    Math.min(300, Math.max(compact ? 168 : 196, windowHeight * (compact ? 0.26 : 0.3))),
  );

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View style={[styles.section, { marginTop: home.heroMarginTop }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel="Começar a primeira crônica — criar campanha"
      >
        {({ pressed }) => (
          <Animated.View
            style={[
              styles.shell,
              {
                borderRadius: components.radius.lg,
                borderWidth,
                borderColor: pressed ? interactive.pressedBorder : elevated.border,
                backgroundColor: elevated.background,
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
            <View
              style={[
                styles.coverBlock,
                {
                  height: coverHeight,
                  borderTopLeftRadius: components.radius.lg - 1,
                  borderTopRightRadius: components.radius.lg - 1,
                },
              ]}
            >
              <GrimoireImage
                source={getGrimoireBannerFallback(0)}
                style={styles.coverImage}
                contentFit="cover"
                recyclingKey="home-create-cover"
              />
              <LinearGradient
                colors={[
                  'transparent',
                  cfg.imageOverlayMid,
                  elevated.background,
                ]}
                locations={[0.35, 0.72, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
            </View>

            <View style={[styles.body, { padding: bodyPadding, paddingTop: compact ? 14 : 16 }]}>
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
                  Primeira crônica
                </Text>
              </View>

              <Text
                style={[
                  styles.title,
                  { color: palette.textPrimary },
                  compact && styles.titleCompact,
                ]}
                numberOfLines={2}
                maxFontSizeMultiplier={1.3}
              >
                Comece sua primeira crônica
              </Text>

              <Text
                style={[styles.subtitle, { color: palette.textSecondary }]}
                numberOfLines={3}
                maxFontSizeMultiplier={1.3}
              >
                Organize sessões, NPCs, locais e notas num só grimório — antes da primeira mesa.
              </Text>

              <View style={styles.ctaRow}>
                <View
                  style={[
                    styles.ctaGlowShell,
                    {
                      borderRadius: cta.radius + 6,
                      ...Platform.select({
                        ios: {
                          shadowColor: palette.buttonPrimary,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.55,
                          shadowRadius: 14,
                        },
                        android: {
                          elevation: 8,
                        },
                        default: {},
                      }),
                    },
                  ]}
                >
                  <View
                    pointerEvents="none"
                    style={[
                      styles.ctaHalo,
                      {
                        borderRadius: cta.radius + 4,
                        backgroundColor: palette.buttonPrimaryShadow,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.cta,
                      {
                        borderRadius: cta.radius,
                        backgroundColor: palette.buttonPrimary,
                        minHeight: MIN_TOUCH_TARGET - 4,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <Text style={[styles.ctaLabel, { color: cta.foreground }]}>Começar</Text>
                    <ChevronRight size={16} color={cta.foreground} strokeWidth={2.2} />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  shell: {
    width: '100%',
    overflow: 'hidden',
  },
  coverBlock: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(4, 12, 28, 0.55)',
  },
  coverImage: {
    ...StyleSheet.absoluteFill,
  },
  body: {
    gap: 10,
    alignItems: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 19,
    lineHeight: 25,
  },
  subtitle: {
    ...typeRoles.caption,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
  },
  ctaRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  ctaGlowShell: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaHalo: {
    position: 'absolute',
    top: -3,
    bottom: -3,
    left: -6,
    right: -6,
    opacity: 0.32,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 26,
    zIndex: 1,
  },
  ctaLabel: {
    ...typeRoles.buttonSm,
  },
});
