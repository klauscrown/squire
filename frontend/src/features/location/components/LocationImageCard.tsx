import { ImageIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireImage } from '@/components/grimoire';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface LocationImageCardProps {
  imageUrl?: string | null;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function LocationImageCard({
  imageUrl,
  onPress,
  loading = false,
  disabled = false,
}: LocationImageCardProps) {
  const grimoire = useGrimoire();
  const hasImage = Boolean(imageUrl?.trim());
  const isInteractive = Boolean(onPress) && !disabled && !loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.card,
        {
          borderRadius: grimoire.radius.lg,
          borderColor: grimoire.colors.glassGoldBorder,
          backgroundColor: grimoire.colors.glass,
        },
        pressed && isInteractive && styles.pressed,
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={hasImage ? 'Alterar imagem do local' : 'Adicionar imagem do local'}
    >
      {hasImage ? (
        <>
          <GrimoireImage source={{ uri: imageUrl! }} style={styles.image} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.gradient}
            pointerEvents="none"
          />
          <Text style={[styles.changeLabel, { color: grimoire.colors.ivory }]}>
            TOCAR PARA ALTERAR
          </Text>
        </>
      ) : (
        <View style={[styles.empty, { backgroundColor: `${grimoire.colors.purpleMid}44` }]}>
          <ImageIcon size={32} color={grimoire.colors.goldMuted} strokeWidth={1.5} />
          <Text style={[styles.emptyLabel, { color: grimoire.colors.goldMuted }]}>
            ADICIONAR IMAGEM
          </Text>
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
    height: 180,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  changeLabel: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
});
