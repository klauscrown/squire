import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import { STATUS_LABELS, type NpcStatus } from '../types';

const STATUS_OPTIONS: NpcStatus[] = ['alive', 'dead', 'missing'];

interface NpcStatusSelectorProps {
  value: NpcStatus;
  onChange: (status: NpcStatus) => void;
}

export function NpcStatusSelector({ value, onChange }: NpcStatusSelectorProps) {
  const grimoire = useGrimoire();

  const dotColors: Record<NpcStatus, string> = {
    alive: grimoire.colors.success,
    dead: grimoire.colors.ivoryDim,
    missing: '#7B5EA7',
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            fontSize: grimoire.typography.label.fontSize,
            letterSpacing: grimoire.typography.label.letterSpacing,
            color: grimoire.colors.goldMuted,
          },
        ]}
      >
        Status
      </Text>
      <View style={styles.row}>
        {STATUS_OPTIONS.map((status) => {
          const isSelected = value === status;
          return (
            <Pressable
              key={status}
              onPress={() => onChange(status)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.chip,
                isSelected
                  ? {
                      borderColor: grimoire.colors.glassGoldBorder,
                      backgroundColor: grimoire.colors.glassGold,
                    }
                  : {
                      borderColor: grimoire.colors.cardBorder,
                      backgroundColor: grimoire.colors.glass,
                    },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: dotColors[status] }]} />
              <Text
                style={[
                  styles.chipLabel,
                  { color: grimoire.colors.ivoryDim },
                  isSelected && {
                    fontFamily: fontFamily.inter.semibold,
                    color: grimoire.colors.gold,
                  },
                ]}
              >
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
    textTransform: 'uppercase',
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
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
  },
});
