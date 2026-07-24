import { useWindowDimensions } from 'react-native';

import { BREAKPOINTS, type Breakpoint } from '@/theme/breakpoints';

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();

  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export function useIsDesktopWeb(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
}
