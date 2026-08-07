import { Sparkles } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SectionHeader, SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import type { UniverseFragmentPreview } from '../types';
import { UniversePrimaryButton } from './UniversePrimitives';

interface UniverseFragmentSectionProps {
  fragments: readonly UniverseFragmentPreview[];
  fragmentCount: number;
  onAddFragment: () => void;
  onViewAll: () => void;
  onOpenFragment?: (fragmentId: string) => void;
}

export function UniverseFragmentSection({
  fragments,
  fragmentCount,
  onAddFragment,
  onViewAll,
  onOpenFragment,
}: UniverseFragmentSectionProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();

  return (
    <View>
      <SectionHeader title="Fragmentos" actionLabel="Ver todos" onActionPress={onViewAll} />
      <View style={[styles.intro, { gap: components.spacing.grid }]}>
        <View style={styles.introCopy}>
          <Text style={[styles.description, { color: palette.textSecondary }]}>
            Ideias rápidas ainda não classificadas, prontas para crescer quando fizer sentido.
          </Text>
          <View style={[styles.count, { backgroundColor: opacity.iconCircle.lilacFill }]}>
            <Sparkles size={12} color={opacity.iconStroke.lilac} strokeWidth={1.7} />
            <Text style={[styles.countText, { color: palette.textSecondary }]}>
              {fragmentCount} {fragmentCount === 1 ? 'ideia guardada' : 'ideias guardadas'}
            </Text>
          </View>
        </View>
        <UniversePrimaryButton label="Novo fragmento" onPress={onAddFragment} />
      </View>

      {fragments.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.track, { gap: components.spacing.grid }]}
        >
          {fragments.map((fragment) => (
            <SurfaceCard
              key={fragment.id}
              variant={onOpenFragment ? 'interactive' : 'subtle'}
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={onOpenFragment ? () => onOpenFragment(fragment.id) : undefined}
              accessibilityLabel={onOpenFragment ? `Abrir fragmento ${fragment.text}` : undefined}
              style={styles.card}
              contentStyle={styles.cardContent}
            >
              <Sparkles size={18} color={opacity.iconStroke.lilac} strokeWidth={1.65} />
              <Text style={[styles.fragmentText, { color: palette.textPrimary }]} numberOfLines={3}>
                {fragment.text}
              </Text>
              <Text style={[styles.fragmentTag, { color: palette.textSecondary }]}>
                #{fragment.tag}
              </Text>
            </SurfaceCard>
          ))}
        </ScrollView>
      ) : (
        <SurfaceCard variant="subtle" radius="sm" padding="sm" shadow={false}>
          <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
            Nenhuma ideia solta por enquanto. Registre um lampejo sem precisar classificá-lo.
          </Text>
        </SurfaceCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  introCopy: {
    flex: 1,
    minWidth: 220,
  },
  description: {
    ...typeRoles.bodySm,
  },
  count: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  countText: {
    ...typeRoles.caption,
  },
  track: {
    paddingRight: 4,
  },
  card: {
    width: 238,
  },
  cardContent: {
    minHeight: 108,
    gap: 7,
  },
  fragmentText: {
    ...typeRoles.editorialSm,
    flex: 1,
  },
  fragmentTag: {
    ...typeRoles.caption,
  },
  emptyText: {
    ...typeRoles.bodySm,
  },
});
