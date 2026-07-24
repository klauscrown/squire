import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { ImageBackground, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { grimoire } from '@/theme/grimoire';

interface GrimoireBackgroundProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function GrimoireBackground({ children, style }: GrimoireBackgroundProps) {
  return (
    <ImageBackground
      source={grimoireImages.loginHero}
      style={[styles.root, style]}
      resizeMode="cover"
    >
      <LinearGradient
        pointerEvents="none"
        colors={[
          `${grimoire.colors.purpleDeep}EE`,
          `${grimoire.colors.purpleDeep}99`,
          `${grimoire.colors.purpleDeep}22`,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.55)', 'transparent']}
        style={styles.topScrim}
      />
      <View style={styles.petrolGlow} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: grimoire.colors.purpleDeep,
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  petrolGlow: {
    position: 'absolute',
    top: '18%',
    left: '10%',
    right: '10%',
    height: 280,
    borderRadius: 999,
    backgroundColor: `${grimoire.colors.petrol}55`,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
});
