import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { AmbientRadialGlow } from '@/components/grimoire/AmbientRadialGlow';
import { useComponents } from '@/hooks/useTheme';

/** Glow ambiente da Home — posicionado atrás do card principal e do mascote. */
export function HomeAmbientGlow() {
  const components = useComponents();

  return (
    <AmbientRadialGlow
      goldBottomOffset={CURVED_TAB_BAR_FOOTPRINT + components.ambientGlow.gold.bottomOffset}
    />
  );
}
