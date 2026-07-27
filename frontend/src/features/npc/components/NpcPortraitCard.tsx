import { ImageIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireImage } from '@/components/grimoire';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

interface NpcPortraitCardProps {
  portraitUrl?: string | null;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function NpcPortraitCard({
  portraitUrl,
  onPress,
  loading = false,
  disabled = false,
}: NpcPortraitCardProps) {
  const hasImage = Boolean(portraitUrl?.trim());
  const isInteractive = Boolean(onPress) && !disabled && !loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [styles.card, pressed && isInteractive && styles.pressed]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={hasImage ? 'Alterar retrato do NPC' : 'Adicionar retrato do NPC'}
    >
      {hasImage ? (
        <>
          <GrimoireImage source={{ uri: portraitUrl! }} style={styles.image} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.gradient}
            pointerEvents="none"
          />
          <Text style={styles.changeLabel}>TOCAR PARA ALTERAR</Text>
        </>
      ) : (
        <View style={styles.empty}>
          <ImageIcon size={32} color={grimoire.colors.goldMuted} strokeWidth={1.5} />
          <Text style={styles.emptyLabel}>ADICIONAR RETRATO</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={grimoire.colors.gold} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 200,
    borderRadius: grimoire.radius.lg,
    backgroundColor: grimoire.colors.glass,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.88,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  changeLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    textAlign: 'center',
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1,
    color: `${grimoire.colors.ivory}BF`,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${grimoire.colors.purpleMid}33`,
  },
  emptyLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1,
    color: grimoire.colors.ivoryDim,
    marginTop: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
