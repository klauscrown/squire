import { MotiView } from 'moti';
import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { GlassSurface } from '@/components/ui';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

interface HomeSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function HomeSearchBar({ value, onChangeText }: HomeSearchBarProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const search = components.searchBar;
  const [focused, setFocused] = useState(false);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 280, delay: 50 }}
      style={{ marginTop: components.home.searchMarginTop }}
    >
      <GlassSurface radius={components.radius.lg} shadow focused={focused}>
        <View
          style={[
            styles.content,
            {
              minHeight: search.minHeight,
              paddingHorizontal: search.paddingHorizontal,
              gap: search.gap,
            },
          ]}
        >
          <Search
            size={search.iconSize}
            color={focused ? palette.accent : palette.textSecondary}
            strokeWidth={1.75}
          />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Buscar campanhas..."
            placeholderTextColor={`${palette.textSecondary}88`}
            style={[
              styles.input,
              {
                fontSize: search.inputFontSize,
                lineHeight: search.inputLineHeight,
                color: palette.textPrimary,
              },
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
            ]}
            returnKeyType="search"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessibilityLabel="Buscar campanhas"
          />
          {value ? (
            <Pressable
              onPress={() => onChangeText('')}
              style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              hitSlop={8}
            >
              <X size={18} color={palette.textSecondary} strokeWidth={1.75} />
            </Pressable>
          ) : null}
        </View>
      </GlassSurface>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.inter.regular,
    padding: 0,
  },
  clearButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonPressed: {
    opacity: 0.65,
  },
});
