import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChips, GlassSurface, SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity, usePremium } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORIES, UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import type { UniverseElementCategory } from '../types';

export type UniverseCategoryFilter = 'all' | UniverseElementCategory;
export type UniverseTagFilter = string;
export type UniverseCampaignFilter = string;

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Todas' },
  ...UNIVERSE_CATEGORIES.map((category) => ({
    id: category,
    label: UNIVERSE_CATEGORY_META[category].label,
  })),
] as readonly { id: UniverseCategoryFilter; label: string }[];

interface UniverseSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  category: UniverseCategoryFilter;
  onCategoryChange: (value: UniverseCategoryFilter) => void;
  tag: UniverseTagFilter;
  onTagChange: (value: UniverseTagFilter) => void;
  campaign: UniverseCampaignFilter;
  onCampaignChange: (value: UniverseCampaignFilter) => void;
  availableTags: readonly string[];
  availableCampaigns: readonly string[];
}

export function UniverseSearchBar({
  query,
  onQueryChange,
  filtersOpen,
  onToggleFilters,
  category,
  onCategoryChange,
  tag,
  onTagChange,
  campaign,
  onCampaignChange,
  availableTags,
  availableCampaigns,
}: UniverseSearchBarProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const premium = usePremium();
  const activeFilterCount =
    Number(category !== 'all') + Number(tag !== 'all') + Number(campaign !== 'all');
  const hasActiveFilters = activeFilterCount > 0;
  const tagFilters = [
    { id: 'all', label: 'Todas' },
    ...availableTags.map((value) => ({ id: value, label: value })),
  ];
  const campaignFilters = [
    { id: 'all', label: 'Todas' },
    ...availableCampaigns.map((value) => ({ id: value, label: value })),
    { id: 'Sem campanha', label: 'Sem campanha' },
  ];

  return (
    <View style={{ marginTop: components.home.searchMarginTop }}>
      <GlassSurface radius={components.radius.lg} shadow>
        <View style={styles.searchContent}>
          <Search size={21} color={premium.text.muted} strokeWidth={1.8} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Buscar em todo o universo..."
            placeholderTextColor={premium.text.faint}
            style={[styles.searchInput, { color: palette.textPrimary }]}
            returnKeyType="search"
            accessibilityLabel="Buscar em todo o universo"
          />
          {query ? (
            <Pressable
              onPress={() => onQueryChange('')}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              hitSlop={8}
              style={styles.searchAction}
            >
              <X size={18} color={palette.textSecondary} strokeWidth={1.7} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onToggleFilters}
            accessibilityRole="button"
            accessibilityLabel={`${filtersOpen ? 'Ocultar' : 'Mostrar'} filtros${
              hasActiveFilters ? `, ${activeFilterCount} ativos` : ''
            }`}
            accessibilityState={{ expanded: filtersOpen }}
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor:
                  filtersOpen || hasActiveFilters ? opacity.card.strong : opacity.card.subtle,
                borderColor:
                  filtersOpen || hasActiveFilters
                    ? opacity.border.goldStrong
                    : opacity.border.goldSubtle,
              },
              pressed && { opacity: opacity.level.pressed },
            ]}
          >
            <SlidersHorizontal size={18} color={palette.accent} strokeWidth={1.7} />
            {hasActiveFilters ? (
              <Text style={[styles.filterCount, { color: palette.accent }]}>
                {activeFilterCount}
              </Text>
            ) : null}
          </Pressable>
        </View>
      </GlassSurface>

      {filtersOpen ? (
        <SurfaceCard
          variant="subtle"
          radius="md"
          padding="none"
          shadow={false}
          style={styles.filtersCard}
        >
          <FilterGroup label="Categoria">
            <FilterChips
              items={CATEGORY_FILTERS}
              value={category}
              onChange={onCategoryChange}
              showDivider={false}
            />
          </FilterGroup>
          <FilterGroup label="Tag">
            <FilterChips
              items={tagFilters}
              value={tag}
              onChange={onTagChange}
              showDivider={false}
            />
          </FilterGroup>
          <FilterGroup label="Campanha vinculada">
            <FilterChips
              items={campaignFilters}
              value={campaign}
              onChange={onCampaignChange}
              showDivider={false}
            />
          </FilterGroup>
        </SurfaceCard>
      ) : null}
    </View>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const palette = useActivePalette();
  return (
    <View style={styles.filterGroup}>
      <Text style={[styles.filterLabel, { color: palette.textSecondary }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContent: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  searchInput: {
    ...typeRoles.body,
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
  },
  searchAction: {
    width: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    minWidth: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
  },
  filterCount: {
    ...typeRoles.badge,
    fontSize: 10,
  },
  filtersCard: {
    marginTop: 10,
  },
  filterGroup: {
    paddingTop: 10,
  },
  filterLabel: {
    ...typeRoles.caption,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
});
