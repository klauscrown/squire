import { BlurView } from 'expo-blur';
import { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { premium } from '@/theme/premium';

interface GlassSurfaceProps {
  children: ReactNode;
  style?: ViewStyle;
  radius?: number;
  intensity?: number;
  shadow?: boolean;
}

export function GlassSurface({
  children,
  style,
  radius = premium.radius.lg,
  intensity = premium.glass.blur,
  shadow = false,
}: GlassSurfaceProps) {
  const shellStyle = [
    styles.shell,
    { borderRadius: radius },
    shadow && styles.shadow,
    style,
  ];

  if (Platform.OS === 'web') {
    return (
      <View style={[shellStyle, styles.webFill]}>
        {children}
      </View>
    );
  }

  return (
    <View style={shellStyle}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={[styles.tint, Platform.OS === 'android' && styles.tintAndroid]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: premium.surface.cardBorder,
    backgroundColor: premium.glass.fill,
  },
  webFill: {
    backgroundColor: premium.glass.fillWeb,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: premium.glass.fillStrong,
  },
  tintAndroid: {
    backgroundColor: 'rgba(12, 16, 32, 0.72)',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
