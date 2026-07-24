import { type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

interface GrimoireFadeInProps {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
}

/** Wrapper simples — animação desativada para evitar tela presa no emulador. */
export function GrimoireFadeIn({ children, style }: GrimoireFadeInProps) {
  return <View style={style}>{children}</View>;
}
