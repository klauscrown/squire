import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGrimoire } from '@/hooks/useTheme';
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
  const grimoire = useGrimoire();
  const soft = grimoire.softGlass;
  const isSoftGlass = variant === 'softGlass';

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          {
            fontSize: grimoire.typography.label.fontSize,
            letterSpacing: grimoire.typography.label.letterSpacing,
            color: grimoire.colors.goldMuted,
          },
          isSoftGlass && {
            fontFamily: fontFamily.inter.medium,
            fontSize: 11,
            letterSpacing: 1,
            color: soft.muted,
            textTransform: 'none',
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.row,
          isSoftGlass && {
            flexWrap: 'nowrap',
            gap: 0,
            borderRadius: soft.themeTrack.borderRadius,
            backgroundColor: soft.themeTrack.backgroundColor,
            padding: soft.themeTrack.padding,
          },
        ]}
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [
                styles.pill,
                {
                  borderColor: grimoire.colors.cardBorder,
                },
                isSoftGlass && styles.pillSoft,
                selected &&
                  (isSoftGlass
                    ? {
                        borderColor: soft.gold,
                        backgroundColor: soft.themeTrack.selectedBackground,
                      }
                    : {
                        borderColor: grimoire.colors.glassGoldBorder,
                        backgroundColor: grimoire.colors.glassGold,
                      }),
                pressed && { opacity: 0.88 },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: grimoire.colors.ivoryDim },
                  isSoftGlass && {
                    fontFamily: fontFamily.inter.medium,
                    color: soft.muted,
                    textAlign: 'center',
                  },
                  selected &&
                    (isSoftGlass
                      ? {
                          fontFamily: fontFamily.inter.bold,
                          fontWeight: '700',
                          color: soft.gold,
                        }
                      : {
                          fontFamily: fontFamily.inter.semibold,
                          color: grimoire.colors.gold,
                        }),
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

const styles = StyleSheet.create({
  wrap: {
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
  pill: {
    borderRadius: 999,
    borderWidth: 1,
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
  pillText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
  },
});
