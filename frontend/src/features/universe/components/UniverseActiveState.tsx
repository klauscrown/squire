import { Link2, Plus, SearchX } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GrimoireFadeIn } from '@/components/grimoire';
import { SectionHeader, SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import { DEFAULT_PINNED_CATEGORIES, UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import { useGetUniverseElements } from '../hooks';
import type { LinkedCampaignSummary, Universe } from '../types';
import { LinkedCampaignCard } from './LinkedCampaignCard';
import { UniverseCategoryCard } from './UniverseCategoryCard';
import { UniverseFragmentSection } from './UniverseFragmentSection';
import { UniverseHeroCard } from './UniverseHeroCard';
import { UniverseRecentItem } from './UniverseRecentItem';
import {
  UniverseSearchBar,
  type UniverseCampaignFilter,
  type UniverseCategoryFilter,
  type UniverseTagFilter,
} from './UniverseSearchBar';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

interface UniverseActiveStateProps {
  universe: Universe;
  linkedCampaigns: readonly LinkedCampaignSummary[];
  onOptions: () => void;
  onAddFragment: () => void;
  onViewFragments: () => void;
  onOpenArchive: () => void;
  onLinkCampaign: () => void;
  onCreateCampaign: () => void;
  onOpenElement: (elementId: string) => void;
  onOpenCampaign: (campaignId: string) => void;
}

export function UniverseActiveState({
  universe,
  linkedCampaigns,
  onOptions,
  onAddFragment,
  onViewFragments,
  onOpenArchive,
  onLinkCampaign,
  onCreateCampaign,
  onOpenElement,
  onOpenCampaign,
}: UniverseActiveStateProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState<UniverseCategoryFilter>('all');
  const [tag, setTag] = useState<UniverseTagFilter>('all');
  const [campaign, setCampaign] = useState<UniverseCampaignFilter>('all');
  const { data: universeElements = [] } = useGetUniverseElements(universe.id);
  const createdFragments = universeElements.filter((element) => element.category === 'fragment');
  const fragmentPreviews = createdFragments
    .map((element) => ({
      id: element.id,
      text: element.description || element.name,
      tag: element.tags?.[0] || 'Fragmento',
    }))
    .slice(0, 3);
  const availableTags = useMemo(
    () => [...new Set(universeElements.flatMap((element) => element.tags ?? []))].sort(),
    [universeElements],
  );
  const availableCampaigns = useMemo(
    () => linkedCampaigns.map((linked) => linked.title),
    [linkedCampaigns],
  );

  const filteredElements = useMemo(() => {
    const needle = normalize(query.trim());
    return universeElements.filter((element) => {
      const searchable = normalize(
        [
          element.name,
          element.description ?? '',
          UNIVERSE_CATEGORY_META[element.category].label,
          ...(element.tags ?? []),
          element.linkedCampaignName ?? '',
        ].join(' '),
      );
      const matchesQuery = !needle || searchable.includes(needle);
      const matchesCategory = category === 'all' || element.category === category;
      const matchesTag = tag === 'all' || element.tags?.includes(tag);
      const matchesCampaign =
        campaign === 'all' ||
        (campaign === 'Sem campanha'
          ? !element.linkedCampaignName
          : element.linkedCampaignName === campaign);

      return matchesQuery && matchesCategory && matchesTag && matchesCampaign;
    });
  }, [campaign, category, query, tag, universeElements]);

  const hasActiveFilters = category !== 'all' || tag !== 'all' || campaign !== 'all';
  const isFiltering = query.trim().length > 0 || hasActiveFilters;
  const visibleElements = isFiltering ? filteredElements : filteredElements.slice(0, 5);

  function clearSearch() {
    setQuery('');
    setCategory('all');
    setTag('all');
    setCampaign('all');
  }

  return (
    <>
      <GrimoireFadeIn>
        <UniverseHeroCard
          universe={universe}
          elementCount={universeElements.length}
          campaignCount={linkedCampaigns.length}
          onOptions={onOptions}
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={70}>
        <UniverseSearchBar
          query={query}
          onQueryChange={setQuery}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
          category={category}
          onCategoryChange={setCategory}
          tag={tag}
          onTagChange={setTag}
          campaign={campaign}
          onCampaignChange={setCampaign}
          availableTags={availableTags}
          availableCampaigns={availableCampaigns}
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={130}>
        <View style={{ marginTop: components.spacing.section }}>
          <UniverseFragmentSection
            fragments={fragmentPreviews}
            fragmentCount={createdFragments.length}
            onAddFragment={onAddFragment}
            onViewAll={onViewFragments}
            onOpenFragment={onOpenElement}
          />
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={190}>
        <View style={{ marginTop: components.spacing.section }}>
          <SectionHeader
            title="Categorias favoritas"
            actionLabel="Ver todo o acervo"
            onActionPress={onOpenArchive}
          />
          <View style={[styles.favoriteGrid, { gap: components.spacing.grid }]}>
            {DEFAULT_PINNED_CATEGORIES.map((favorite) => {
              const count =
                favorite.id === 'archive'
                  ? universeElements.filter((element) =>
                      [
                        'item',
                        'creature',
                        'deity',
                        'culture',
                        'knowledge',
                        'world_rule',
                        'file',
                      ].includes(element.category),
                    ).length
                  : universeElements.filter((element) => element.category === favorite.id).length;

              return (
                <UniverseCategoryCard
                  key={favorite.id}
                  category={favorite.id}
                  label={favorite.label}
                  summary={
                    count ? `${count} ${count === 1 ? 'registro' : 'registros'}` : favorite.summary
                  }
                  onPress={() => {
                    if (favorite.id === 'archive') {
                      onOpenArchive();
                      return;
                    }

                    if (favorite.id === 'fragment') {
                      onViewFragments();
                      return;
                    }

                    setCategory(favorite.id);
                    setFiltersOpen(true);
                  }}
                />
              );
            })}
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={250}>
        <View style={{ marginTop: components.spacing.section }}>
          <SectionHeader title={isFiltering ? 'Resultados' : 'Conteúdo recente'} />
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
              <View style={styles.noResults} accessibilityLiveRegion="polite">
                <SearchX size={28} color={palette.textSecondary} strokeWidth={1.5} />
                <Text style={[styles.noResultsTitle, { color: palette.textPrimary }]}>
                  Nenhum resultado encontrado
                </Text>
                <Text style={[styles.noResultsBody, { color: palette.textSecondary }]}>
                  Tente outro termo ou remova alguns filtros.
                </Text>
                <Pressable
                  onPress={clearSearch}
                  accessibilityRole="button"
                  accessibilityLabel="Limpar todos os filtros"
                  style={({ pressed }) => [
                    styles.clearFilters,
                    pressed && { opacity: opacity.level.pressed },
                  ]}
                >
                  <Text style={[styles.clearFiltersLabel, { color: palette.accent }]}>
                    Limpar filtros
                  </Text>
                </Pressable>
              </View>
            </SurfaceCard>
          )}
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={310}>
        <View style={{ marginTop: components.spacing.section }}>
          <SectionHeader title="Campanhas neste universo" />
          <View style={[styles.campaignGrid, { gap: components.spacing.grid }]}>
            {linkedCampaigns.map((linked) => (
              <LinkedCampaignCard
                key={linked.id}
                campaign={linked}
                onPress={() => onOpenCampaign(linked.id)}
              />
            ))}
            {!linkedCampaigns.length ? (
              <SurfaceCard variant="subtle" radius="sm" padding="sm" shadow={false}>
                <Text style={[styles.emptyCampaigns, { color: palette.textSecondary }]}>
                  Nenhuma campanha vinculada. Seu universo continua independente e pronto para ser
                  usado.
                </Text>
              </SurfaceCard>
            ) : null}
          </View>
          <View style={[styles.campaignActions, { gap: components.spacing.grid }]}>
            <SurfaceCard
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={onLinkCampaign}
              accessibilityLabel="Vincular campanha existente"
              style={styles.campaignAction}
              contentStyle={styles.campaignActionContent}
            >
              <Link2 size={17} color={palette.accent} strokeWidth={1.7} />
              <Text style={[styles.campaignActionLabel, { color: palette.textPrimary }]}>
                Vincular campanha
              </Text>
            </SurfaceCard>
            <SurfaceCard
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={onCreateCampaign}
              accessibilityLabel="Criar nova campanha"
              style={styles.campaignAction}
              contentStyle={styles.campaignActionContent}
            >
              <Plus size={17} color={palette.accent} strokeWidth={1.7} />
              <Text style={[styles.campaignActionLabel, { color: palette.textPrimary }]}>
                Criar nova campanha
              </Text>
            </SurfaceCard>
          </View>
        </View>
      </GrimoireFadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  favoriteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noResults: {
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
  },
  noResultsTitle: {
    ...typeRoles.titleSm,
    textAlign: 'center',
  },
  noResultsBody: {
    ...typeRoles.bodySm,
    textAlign: 'center',
  },
  clearFilters: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFiltersLabel: {
    ...typeRoles.buttonSm,
  },
  campaignGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  campaignActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  campaignAction: {
    flexBasis: '46%',
    flexGrow: 1,
    minWidth: 164,
  },
  campaignActionContent: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  campaignActionLabel: {
    ...typeRoles.buttonSm,
  },
  emptyCampaigns: {
    ...typeRoles.bodySm,
  },
});
