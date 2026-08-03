import { BlurView } from 'expo-blur';
import { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useComponents } from '@/hooks/useTheme';

interface GlassSurfaceProps {
  children: ReactNode;
  style?: ViewStyle;
  radius?: number;
  intensity?: number;
  shadow?: boolean;
  focused?: boolean;
}

export function GlassSurface({
  children,
  style,
  radius,
  intensity,
  shadow = false,
  focused = false,
}: GlassSurfaceProps) {
  const components = useComponents();
  const glass = components.glass;
  const resolvedRadius = radius ?? components.radius.lg;
  const resolvedIntensity = intensity ?? glass.blur;

  const shellStyle = [
    styles.shell,
    {
      borderRadius: resolvedRadius,
      borderColor: focused ? glass.borderStrong : glass.cardBorder,
      backgroundColor: glass.fill,
    },
    shadow && {
      shadowColor: glass.shadow.color,
      shadowOpacity: glass.shadow.opacity,
      shadowRadius: glass.shadow.radius,
      shadowOffset: { width: 0, height: glass.shadow.offsetY },
      elevation: glass.shadow.elevation,
    },
    style,
  ];

  if (Platform.OS === 'web') {
    return (
      <View style={[shellStyle, { backgroundColor: glass.fillWeb }]}>
        <View
          style={[
            styles.highlight,
            {
              borderTopLeftRadius: resolvedRadius,
              borderTopRightRadius: resolvedRadius,
              backgroundColor: glass.highlight,
            },
          ]}
        />
        {children}
      </View>
    );
  }

  return (
    <View style={shellStyle}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={resolvedIntensity} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              Platform.OS === 'android' ? glass.fillAndroid : glass.fillStrong,
          },
        ]}
      />
      <View
        style={[
          styles.highlight,
          {
            borderTopLeftRadius: resolvedRadius,
            borderTopRightRadius: resolvedRadius,
            backgroundColor: glass.highlight,
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});
