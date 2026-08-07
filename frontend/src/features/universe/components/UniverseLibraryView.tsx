import { Plus, Search, SearchX, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChips, GlassSurface, SurfaceCard } from '@/components/ui';
import { usePremium } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import { useGetUniverseElements } from '../hooks';
import type { UniverseElementCategory } from '../types';
import { UniverseRecentItem } from './UniverseRecentItem';

const ARCHIVE_CATEGORIES: readonly UniverseElementCategory[] = [
  'item',
  'creature',
  'deity',
  'culture',
  'knowledge',
  'world_rule',
  'file',
];

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

interface UniverseLibraryViewProps {
  universeId: string;
  initialCategory?: UniverseElementCategory | 'archive';
  onOpenElement: (elementId: string) => void;
  onCreate: (category?: UniverseElementCategory) => void;
}

export function UniverseLibraryView({
  universeId,
  initialCategory,
  onOpenElement,
  onCreate,
}: UniverseLibraryViewProps) {
  const palette = useActivePalette();
  const premium = usePremium();
  const { data: elements = [] } = useGetUniverseElements(universeId);
  const categoryOptions = initialCategory === 'archive' ? ARCHIVE_CATEGORIES : [];
  const [category, setCategory] = useState<'all' | UniverseElementCategory>(
    initialCategory && initialCategory !== 'archive' ? initialCategory : 'all',
  );
  const [query, setQuery] = useState('');

  const visibleElements = useMemo(() => {
    const needle = normalize(query.trim());
    return elements.filter((element) => {
      const insideLibrary =
        initialCategory === 'archive'
          ? ARCHIVE_CATEGORIES.includes(element.category)
          : category === 'all' || element.category === category;
      const searchable = normalize(
        [element.name, element.description ?? '', ...(element.tags ?? [])].join(' '),
      );
      return insideLibrary && (!needle || searchable.includes(needle));
    });
  }, [category, elements, initialCategory, query]);

  const title =
    initialCategory === 'archive'
      ? 'Acervo'
      : initialCategory
        ? UNIVERSE_CATEGORY_META[initialCategory].label
        : 'Todo o universo';
  const createCategory = category === 'all' ? undefined : category;

  return (
    <View>
      <Text style={[styles.heading, { color: palette.textPrimary }]}>{title}</Text>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        {initialCategory === 'fragment'
          ? 'Ideias rápidas podem crescer ou mudar de categoria quando você quiser.'
          : 'Encontre, abra e continue construindo cada parte do cenário.'}
      </Text>

      <GlassSurface radius={16} shadow={false}>
        <View style={styles.searchContent}>
          <Search size={19} color={premium.text.muted} strokeWidth={1.7} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Buscar em ${title.toLocaleLowerCase('pt-BR')}...`}
            placeholderTextColor={premium.text.faint}
            style={[styles.searchInput, { color: palette.textPrimary }]}
            returnKeyType="search"
            accessibilityLabel={`Buscar em ${title}`}
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              style={styles.searchAction}
            >
              <X size={17} color={palette.textSecondary} strokeWidth={1.7} />
            </Pressable>
          ) : null}
        </View>
      </GlassSurface>

      {categoryOptions.length ? (
        <View style={styles.filters}>
          <FilterChips
            items={[
              { id: 'all' as const, label: 'Todos' },
              ...categoryOptions.map((item) => ({
                id: item,
                label: UNIVERSE_CATEGORY_META[item].label,
              })),
            ]}
            value={category}
            onChange={setCategory}
            showDivider={false}
          />
        </View>
      ) : null}

      <View style={styles.list}>
        {visibleElements.length ? (
          <SurfaceCard variant="subtle" radius="md" padding="none" shadow={false}>
            {visibleElements.map((element, index) => (
              <UniverseRecentItem
                key={element.id}
                element={element}
                showDivider={index < visibleElements.length - 1}
                onPress={() => onOpenElement(element.id)}
              />
            ))}
          </SurfaceCard>
        ) : (
          <SurfaceCard variant="subtle" radius="md" padding="lg" shadow={false}>
            <View style={styles.empty} accessibilityLiveRegion="polite">
              <SearchX size={27} color={palette.textSecondary} strokeWidth={1.5} />
              <Text style={[styles.emptyTitle, { color: palette.textPrimary }]}>
                {query ? 'Nenhum resultado encontrado' : 'Nada registrado por aqui ainda'}
              </Text>
              <Text style={[styles.emptyBody, { color: palette.textSecondary }]}>
                {query
                  ? 'Tente buscar por outro nome ou termo.'
                  : 'O primeiro registro pode ser simples e crescer depois.'}
              </Text>
            </View>
          </SurfaceCard>
        )}
      </View>

      <SurfaceCard
        variant="interactive"
        radius="sm"
        padding="sm"
        shadow={false}
        onPress={() => onCreate(createCategory)}
        accessibilityLabel={`Criar conteúdo em ${title}`}
        style={styles.createCard}
        contentStyle={styles.createContent}
      >
        <Plus size={18} color={palette.accent} strokeWidth={1.8} />
        <Text style={[styles.createLabel, { color: palette.textPrimary }]}>Criar conteúdo</Text>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...typeRoles.display,
  },
  helper: {
    ...typeRoles.bodySm,
    marginTop: 4,
    marginBottom: 14,
  },
  searchContent: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
  },
  searchInput: {
    ...typeRoles.body,
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
  },
  searchAction: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    marginTop: 8,
    marginHorizontal: -16,
  },
  list: {
    marginTop: 14,
  },
  empty: {
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
  },
  emptyTitle: {
    ...typeRoles.titleSm,
    textAlign: 'center',
  },
  emptyBody: {
    ...typeRoles.bodySm,
    textAlign: 'center',
  },
  createCard: {
    marginTop: 14,
  },
  createContent: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createLabel: {
    ...typeRoles.buttonSm,
  },
});
