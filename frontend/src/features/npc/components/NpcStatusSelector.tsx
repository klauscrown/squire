import { Pressable, StyleSheet, Text, View } from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

import { STATUS_LABELS, type NpcStatus } from '../types';

const STATUS_OPTIONS: NpcStatus[] = ['alive', 'dead', 'missing'];

const DOT_COLORS: Record<NpcStatus, string> = {
  alive: grimoire.colors.success,
  dead: grimoire.colors.ivoryDim,
  missing: '#7B5EA7',
};

interface NpcStatusSelectorProps {
  value: NpcStatus;
  onChange: (status: NpcStatus) => void;
}

export function NpcStatusSelector({ value, onChange }: NpcStatusSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Status</Text>
      <View style={styles.row}>
        {STATUS_OPTIONS.map((status) => {
          const isSelected = value === status;
          return (
            <Pressable
              key={status}
              onPress={() => onChange(status)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[styles.chip, isSelected ? styles.chipSelected : styles.chipIdle]}
            >
              <View style={[styles.dot, { backgroundColor: DOT_COLORS[status] }]} />
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                {STATUS_LABELS[status]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  chipIdle: {
    borderColor: grimoire.colors.cardBorder,
    backgroundColor: grimoire.colors.glass,
  },
  chipSelected: {
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: grimoire.colors.glassGold,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: grimoire.colors.ivoryDim,
  },
  chipLabelSelected: {
    fontFamily: fontFamily.inter.semibold,
    color: grimoire.colors.gold,
  },
});
