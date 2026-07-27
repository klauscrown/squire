import { ChevronRight } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

const SPRING_IN = { damping: 18, stiffness: 380, mass: 0.6 };
const SPRING_OUT = { damping: 12, stiffness: 280, mass: 0.7 };

interface ModuleCardProps {
  label: string;
  hint: string;
  icon: LucideIcon;
  enabled: boolean;
  onPress: () => void;
}

export function ModuleCard({ label, hint, icon: Icon, enabled, onPress }: ModuleCardProps) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, SPRING_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_OUT);
      }}
      style={styles.modulePressable}
    >
      <Animated.View style={[styles.moduleCard, !enabled && styles.moduleCardDisabled, pressStyle]}>
        <View style={styles.moduleIconWrap}>
          <Icon size={14} color={grimoire.colors.gold} strokeWidth={1.5} />
        </View>
        <Text style={styles.moduleLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.moduleHint} numberOfLines={2}>
          {hint}
        </Text>
        {enabled ? (
          <ChevronRight
            size={11}
            color={`${grimoire.colors.ivoryDim}66`}
            strokeWidth={1.5}
            style={styles.moduleChevron}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modulePressable: {
    width: '100%',
  },
  moduleCard: {
    minHeight: 92,
    borderRadius: grimoire.radius.md,
    borderWidth: 1,
    borderColor: grimoire.colors.cardBorder,
    backgroundColor: grimoire.colors.glass,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  moduleCardDisabled: {
    opacity: 0.55,
  },
  moduleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: grimoire.colors.glassGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: grimoire.colors.ivory,
    textAlign: 'center',
    width: '100%',
  },
  moduleHint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 9,
    lineHeight: 12,
    color: `${grimoire.colors.ivoryDim}99`,
    textAlign: 'center',
    width: '100%',
    minHeight: 24,
  },
  moduleChevron: {
    marginTop: 2,
  },
});
