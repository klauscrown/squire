import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AnimatePresence, MotiView } from 'moti';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ROUTES } from '@/constants';
import { FilterChips, GlassSurface } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

export type SearchFilterId = 'all' | 'campaigns' | 'npcs' | 'sessions';

const HOME_SEARCH_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'campaigns', label: 'Campanhas' },
  { id: 'npcs', label: 'NPCs' },
  { id: 'sessions', label: 'Sessões' },
] as const satisfies readonly { id: SearchFilterId; label: string }[];

interface HomeSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function HomeSearchBar({ value, onChangeText }: HomeSearchBarProps) {
  const router = useRouter();
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const search = components.searchBar;
  const [focused, setFocused] = useState(false);
  const [filter, setFilter] = useState<SearchFilterId>('campaigns');
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilters() {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setShowFilters((open) => !open);
  }

  function handleFilterChange(next: SearchFilterId) {
    setFilter(next);
    setShowFilters(false);
  }

  const filterActive = showFilters || filter !== 'all';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
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
          <Search size={search.iconSize} color={palette.textSecondary} strokeWidth={1.75} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Buscar campanhas, sessões, NPCs..."
            placeholderTextColor={`${palette.textSecondary}66`}
            style={[
              styles.input,
              {
                fontSize: search.inputFontSize,
                lineHeight: search.inputLineHeight,
                color: palette.textPrimary,
              },
            ]}
            returnKeyType="search"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={() => router.push(ROUTES.app.campaigns)}
          />
          <View
            style={{
              width: 1,
              height: search.dividerHeight,
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
            }}
          />
          <Pressable
            style={({ pressed }) => [
              {
                width: search.filterSize,
                height: search.filterSize,
                borderRadius: components.radius.sm,
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                backgroundColor: filterActive ? palette.accentSoft : palette.surface,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: filterActive ? palette.accent : palette.surfaceBorder,
                opacity: pressed ? opacity.level.muted : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filtros"
            accessibilityState={{ expanded: showFilters }}
            onPress={toggleFilters}
          >
            <SlidersHorizontal
              size={search.iconSize - 4}
              color={filterActive ? palette.accent : palette.textSecondary}
              strokeWidth={1.75}
            />
          </Pressable>
        </View>

        <AnimatePresence>
          {showFilters ? (
            <MotiView
              key="filters"
              from={{ opacity: 0, translateY: -6 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -6 }}
              transition={{ type: 'timing', duration: 200 }}
            >
              <FilterChips
                items={HOME_SEARCH_FILTERS}
                value={filter}
                onChange={handleFilterChange}
                trackPadding="search"
              />
            </MotiView>
          ) : null}
        </AnimatePresence>
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
});
