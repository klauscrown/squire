import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { LAYOUT_WIDTH } from '@/theme/accessibility';
import { BREAKPOINTS, CONTENT_MAX_WIDTH } from '@/theme/breakpoints';

/**
 * Altura reservada sob o conteúdo para a tab bar curva + safe area inferior.
 * Garante que nada fique oculto atrás da navegação.
 */
export function useTabBarClearance(extraPadding = 0): number {
  const insets = useSafeAreaInsets();
  return CURVED_TAB_BAR_FOOTPRINT + Math.max(insets.bottom, 8) + extraPadding;
}

/** Padding horizontal fluido (não fixo a uma resolução). */
export function useContentGutter(base = 24): number {
  const { width } = useWindowDimensions();
  if (width < LAYOUT_WIDTH.compact) return Math.max(16, base - 8);
  if (width < LAYOUT_WIDTH.narrow) return Math.max(18, base - 4);
  if (width >= BREAKPOINTS.desktop) return base + 8;
  return base;
}

/** maxWidth + centralização em web/tablet; mobile full-bleed com gutters. */
export function useContentMaxWidth(wide = false): number | undefined {
  const breakpoint = useBreakpoint();
  if (breakpoint === 'mobile') return undefined;
  // Native tablet e web compartilham o teto de leitura confortável
  if (Platform.OS === 'web' || breakpoint === 'tablet' || breakpoint === 'desktop') {
    return wide ? CONTENT_MAX_WIDTH.wide : CONTENT_MAX_WIDTH.default;
  }
  return undefined;
}

export function useIsCompactWidth(): boolean {
  const { width } = useWindowDimensions();
  return width < LAYOUT_WIDTH.compact;
}

export function useIsNarrowWidth(): boolean {
  const { width } = useWindowDimensions();
  return width < LAYOUT_WIDTH.narrow;
}
