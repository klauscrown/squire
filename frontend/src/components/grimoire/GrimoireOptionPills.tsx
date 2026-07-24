import { Pressable, StyleSheet, Text, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

type GrimoireOptionPillsVariant = 'default' | 'softGlass';

interface GrimoireOptionPillsProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (value: T) => string;
  variant?: GrimoireOptionPillsVariant;
}

export function GrimoireOptionPills<T extends string>({
  label,
  options,
  value,
  onChange,
  getLabel,
  variant = 'default',
}: GrimoireOptionPillsProps<T>) {
  const isSoftGlass = variant === 'softGlass';

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, isSoftGlass && styles.labelSoft]}>{label}</Text>
      <View style={[styles.row, isSoftGlass && styles.trackSoft]}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.pill,
                isSoftGlass && styles.pillSoft,
                selected && (isSoftGlass ? styles.pillSoftSelected : styles.pillSelected),
                pressed && { opacity: 0.88 },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  isSoftGlass && styles.pillTextSoft,
                  selected && (isSoftGlass ? styles.pillTextSoftSelected : styles.pillTextSelected),
                ]}
              >
                {getLabel(option)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const soft = grimoire.softGlass;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: grimoire.typography.label.fontSize,
    letterSpacing: grimoire.typography.label.letterSpacing,
    textTransform: 'uppercase',
    color: grimoire.colors.goldMuted,
    marginBottom: 8,
  },
  labelSoft: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 11,
    letterSpacing: 1,
    color: soft.muted,
    textTransform: 'none',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackSoft: {
    flexWrap: 'nowrap',
    gap: 0,
    borderRadius: soft.themeTrack.borderRadius,
    backgroundColor: soft.themeTrack.backgroundColor,
    padding: soft.themeTrack.padding,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: grimoire.colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillSoft: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillSelected: {
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: grimoire.colors.glassGold,
  },
  pillSoftSelected: {
    borderColor: soft.gold,
    backgroundColor: 'rgba(230, 194, 128, 0.18)',
  },
  pillText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: grimoire.colors.ivoryDim,
  },
  pillTextSoft: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 12,
    color: soft.muted,
    textAlign: 'center',
  },
  pillTextSelected: {
    fontFamily: fontFamily.inter.semibold,
    color: grimoire.colors.gold,
  },
  pillTextSoftSelected: {
    fontFamily: fontFamily.inter.bold,
    fontWeight: '700',
    color: soft.gold,
  },
});
