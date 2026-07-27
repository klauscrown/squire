import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, UserPlus } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { fontFamily } from '@/theme/typography';

const GOLD = '#E6C280';
const BACK_BG = '#1A1A1A';
const BACK_BORDER = '#2A2A2A';
const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
}) as string;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NpcsListHeaderProps {
  onCreatePress: () => void;
}

export function NpcsListHeader({ onCreatePress }: NpcsListHeaderProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const createAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        accessibilityLabel="Voltar"
        style={styles.backButton}
      >
        <ChevronLeft size={18} color="#A6A6A6" strokeWidth={2} />
      </Pressable>

      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>NPCs</Text>
          <Text style={styles.meta}>// Habitantes e figuras do universo</Text>
        </View>

        <AnimatedPressable
          onPress={onCreatePress}
          accessibilityLabel="Criar NPC"
          style={[styles.createButton, createAnimStyle]}
          onPressIn={() => {
            scale.value = withTiming(0.97, { duration: 120 });
          }}
          onPressOut={() => {
            scale.value = withTiming(1, { duration: 120 });
          }}
        >
          <UserPlus size={14} color={GOLD} strokeWidth={2.25} />
          <Text style={styles.createLabel}>+ Criar</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BACK_BG,
    borderWidth: 1,
    borderColor: BACK_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.manrope.bold,
    fontSize: 28,
    fontWeight: '800',
    color: GOLD,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  meta: {
    fontFamily: MONO,
    fontSize: 11,
    color: '#A6A6A6',
    letterSpacing: 0.2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
  },
  createLabel: {
    fontFamily: fontFamily.manrope.semibold,
    fontSize: 13,
    color: GOLD,
    letterSpacing: 0.2,
  },
});
