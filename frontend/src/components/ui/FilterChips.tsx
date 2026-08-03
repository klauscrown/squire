import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { spacing } from '@/theme/spacing';
import { fontFamily } from '@/theme/typography';

export interface FilterChipItem<T extends string = string> {
  id: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  items: readonly FilterChipItem<T>[];
  value: T;
  onChange: (value: T) => void;
  showDivider?: boolean;
  /** Padding do trilho — default genérico; use `search` na barra de busca da Home */
  trackPadding?: 'default' | 'search';
}

export function FilterChips<T extends string>({
  items,
  value,
  onChange,
  showDivider = true,
  trackPadding = 'default',
}: FilterChipsProps<T>) {
  const palette = useActivePalette();
  const components = useComponents();
  const chip = components.chip;
  const searchBar = components.searchBar;

  function handlePress(id: T) {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onChange(id);
  }

  return (
    <View
      style={[
        showDivider && {
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(255, 255, 255, 0.07)',
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: chip.gap,
          },
          trackPadding === 'search' && {
            paddingHorizontal: searchBar.chipTrackPaddingHorizontal,
            paddingVertical: searchBar.chipTrackPaddingVertical,
          },
        ]}
      >
        {items.map((item) => {
          const active = value === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => handlePress(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Filtrar por ${item.label}`}
            >
              {({ pressed }) => (
                <MotiView
                  animate={{
                    scale: pressed ? 0.96 : active ? 1.02 : 1,
                  }}
                  transition={{ type: 'timing', duration: 160 }}
                  style={[
                    {
                      minHeight: chip.minHeight,
                      paddingHorizontal: chip.paddingHorizontal,
                      borderRadius: chip.radius,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                    },
                    active
                      ? {
                          backgroundColor: palette.accent,
                          borderColor: palette.accent,
                          ...Platform.select({
                            ios: {
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: chip.activeShadow.offsetY },
                              shadowOpacity: chip.activeShadow.opacity,
                              shadowRadius: chip.activeShadow.radius,
                            },
                            android: {
                              elevation: chip.activeShadow.elevation,
                            },
                            default: {},
                          }),
                        }
                      : {
                          backgroundColor: palette.surface,
                          borderColor: palette.surfaceBorder,
                        },
                    !active &&
                      pressed && {
                        backgroundColor: palette.accentSoft,
                        borderColor: palette.accent,
                      },
                    active && pressed && { opacity: chip.pressedOpacity },
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: chip.label.fontSize,
                        lineHeight: chip.label.lineHeight,
                      },
                      active
                        ? {
                            fontFamily: fontFamily.inter.semibold,
                            color: palette.gradientEnd,
                          }
                        : {
                            fontFamily: fontFamily.inter.medium,
                            color: palette.textSecondary,
                          },
                    ]}
                  >
                    {item.label}
                  </Text>
                </MotiView>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
