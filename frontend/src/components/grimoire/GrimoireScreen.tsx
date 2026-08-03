import { type ReactNode } from 'react';

import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { useGrimoire } from '@/hooks/useTheme';

import { AmbientGlow, type GlowVariant } from './AmbientGlow';
import { GrimoireAtmosphereShell } from './GrimoireAtmosphere';

interface GrimoireScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  glow?: GlowVariant | GlowVariant[] | 'none';
  backgroundOverlay?: ReactNode;
  contentStyle?: ViewStyle;
  bottomInset?: number;
}

export function GrimoireScreen({
  children,
  scrollable = true,
  glow = 'none',
  backgroundOverlay,
  contentStyle,
  bottomInset = CURVED_TAB_BAR_FOOTPRINT,
}: GrimoireScreenProps) {
  const grimoire = useGrimoire();
  const glows = glow === 'none' ? [] : Array.isArray(glow) ? glow : [glow];

  const content = (
    <View
      style={[
        styles.content,
        { paddingHorizontal: grimoire.spacing.screen, paddingBottom: bottomInset },
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
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
    zIndex: 1,
  },
});
