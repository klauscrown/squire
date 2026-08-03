import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useActivePalette, useThemeStore } from '@/store/useThemeStore';
import { palettes, THEME_NAMES, type ThemeName } from '@/theme/palettes';
import { fontFamily } from '@/theme/typography';

interface ThemePickerCardsProps {
  /** Texto auxiliar abaixo dos cards */
  showHint?: boolean;
}

export function ThemePickerCards({ showHint = true }: ThemePickerCardsProps) {
  const activePalette = useActivePalette();
  const themeName = useThemeStore((s) => s.themeName);
  const setTheme = useThemeStore((s) => s.setTheme);

  function handleSelect(name: ThemeName) {
    if (name === themeName) return;
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setTheme(name);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {THEME_NAMES.map((name) => {
          const preview = palettes[name];
          const selected = themeName === name;

          return (
            <Pressable
              key={name}
              onPress={() => handleSelect(name)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Tema ${preview.name}`}
              style={({ pressed }) => [
                styles.card,
                {
                  borderColor: selected ? activePalette.accent : activePalette.surfaceBorder,
                  backgroundColor: activePalette.surface,
                  opacity: pressed ? 0.9 : 1,
                },
                selected && styles.cardSelected,
              ]}
            >
              <LinearGradient
                colors={[preview.gradientStart, preview.gradientEnd]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.preview}
              >
                <View style={styles.swatches}>
                  <View style={[styles.swatch, { backgroundColor: preview.primary }]} />
                  <View style={[styles.swatch, { backgroundColor: preview.accent }]} />
                </View>
              </LinearGradient>

              <Text style={[styles.label, { color: activePalette.textPrimary }]}>
                {preview.name}
              </Text>
              <Text style={[styles.meta, { color: activePalette.textSecondary }]}>
                {name === 'tormenta' ? 'Vermelho & bronze' : 'Roxo & dourado'}
              </Text>

              {selected ? (
                <View style={[styles.activeDot, { backgroundColor: activePalette.accent }]} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {showHint ? (
        <Text style={[styles.hint, { color: activePalette.textSecondary }]}>
          A troca aplica na hora em todo o grimório.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 10,
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 2,
  },
  preview: {
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 10,
  },
  swatches: {
    flexDirection: 'row',
    gap: 6,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    letterSpacing: 0.2,
  },
  meta: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    lineHeight: 14,
    marginTop: -4,
  },
  activeDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  hint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    lineHeight: 18,
  },
});
