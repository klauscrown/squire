import { useRef } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { BlurView, BlurTargetView } from 'expo-blur';

const BACKGROUND_IMAGE = require('../../../../../assets/images/campaign-universe-bg.png');

/**
 * Fundo imersivo da tela de universo da campanha:
 * textura cósmica escura + BlurView intenso (vidro escuro).
 */
export function CampaignUniverseBackground() {
  const blurTargetRef = useRef<View>(null);
  const isAndroid = Platform.OS === 'android';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <BlurTargetView ref={blurTargetRef} style={StyleSheet.absoluteFill}>
        <Image source={BACKGROUND_IMAGE} style={styles.image} resizeMode="cover" />
      </BlurTargetView>

      <BlurView
        intensity={80}
        tint="dark"
        blurMethod={isAndroid ? 'dimezisBlurView' : undefined}
        blurTarget={isAndroid ? blurTargetRef : undefined}
        experimentalBlurMethod={isAndroid ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />

      {/* Scrim extra para legibilidade dos textos off-white */}
      <View style={styles.scrim} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 8, 12, 0.55)',
  },
});
