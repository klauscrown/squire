import { type ReactNode } from 'react';

import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useContentGutter,
  useContentMaxWidth,
  useTabBarClearance,
} from '@/hooks/useLayoutMetrics';
import { useGrimoire } from '@/hooks/useTheme';

import { AmbientGlow, type GlowVariant } from './AmbientGlow';
import { GrimoireAtmosphereShell } from './GrimoireAtmosphere';

interface GrimoireScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  glow?: GlowVariant | GlowVariant[] | 'none';
  backgroundOverlay?: ReactNode;
  contentStyle?: ViewStyle;
  /**
   * Padding inferior absoluto. Se omitido, usa clearance da tab bar + safe area.
   * Prefira `tabBarExtraPadding` em telas com bottom nav.
   */
  bottomInset?: number;
  /**
   * Espaço extra além da tab bar (ex.: respiro da Home).
   * Ignorado se `bottomInset` for passado.
   */
  tabBarExtraPadding?: number;
  /** false desativa reserva da tab (ex.: fluxo full-screen sem bottom nav). */
  reserveTabBar?: boolean;
  /** maxWidth wide (1200) em vez do default (960) em tablet/web. */
  wide?: boolean;
}

export function GrimoireScreen({
  children,
  scrollable = true,
  glow = 'none',
  backgroundOverlay,
  contentStyle,
  bottomInset,
  tabBarExtraPadding = 0,
  reserveTabBar = true,
  wide = false,
}: GrimoireScreenProps) {
  const grimoire = useGrimoire();
  const gutter = useContentGutter(grimoire.spacing.screen);
  const contentMaxWidth = useContentMaxWidth(wide);
  const tabClearance = useTabBarClearance(tabBarExtraPadding);
  const paddingBottom = bottomInset ?? (reserveTabBar ? tabClearance : tabBarExtraPadding);

  const glows = glow === 'none' ? [] : Array.isArray(glow) ? glow : [glow];

  const content = (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal: gutter,
          paddingBottom,
          maxWidth: contentMaxWidth,
          width: '100%',
          alignSelf: contentMaxWidth != null ? 'center' : undefined,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <GrimoireAtmosphereShell>
      <SafeAreaView style={styles.root} edges={['top']}>
        {backgroundOverlay}

        {glows.map((variant) => (
          <AmbientGlow key={variant} variant={variant} />
        ))}

        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            // Home e listas não usam campos de texto inline — KAV só em forms
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </GrimoireAtmosphereShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    zIndex: 1,
  },
});
