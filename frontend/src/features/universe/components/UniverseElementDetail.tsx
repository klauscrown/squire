import { Pencil, Trash2 } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_ICONS } from '../data/categoryIcons';
import { UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import { useGetUniverseConnections, useGetUniverseElement } from '../hooks';
import { UniverseConnectionsSection } from './UniverseConnectionsSection';

interface UniverseElementDetailProps {
  elementId: string;
  onAddConnection: () => void;
  onOpenElement: (elementId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UniverseElementDetail({
  elementId,
  onAddConnection,
  onOpenElement,
  onEdit,
  onDelete,
}: UniverseElementDetailProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const { data: element, isLoading } = useGetUniverseElement(elementId);
  const { data: connections = [] } = useGetUniverseConnections(elementId);

  if (isLoading || !element) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  const Icon = UNIVERSE_CATEGORY_ICONS[element.category];
  const meta = UNIVERSE_CATEGORY_META[element.category];

  return (
    <View>
      <SurfaceCard
        variant="elevated"
        radius="md"
        padding="lg"
        shadow={false}
        contentStyle={styles.hero}
      >
        <View
          style={[
            styles.icon,
            {
              backgroundColor: opacity.iconCircle.goldSubtle,
              borderColor: opacity.iconCircle.goldBorder,
            },
          ]}
        >
          <Icon size={23} color={palette.accent} strokeWidth={1.65} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.category, { color: palette.accent }]}>{meta.singular}</Text>
          <Text style={[styles.name, { color: palette.textPrimary }]}>{element.name}</Text>
          {element.description ? (
            <Text style={[styles.description, { color: palette.textSecondary }]}>
              {element.description}
            </Text>
          ) : null}
        </View>
      </SurfaceCard>

      {element.tags?.length || element.state || element.occurredAt ? (
        <View style={styles.metadata}>
          {element.state ? (
            <View style={[styles.metaPill, { backgroundColor: opacity.card.subtle }]}>
              <Text style={[styles.metaText, { color: palette.textSecondary }]}>
                {element.state}
              </Text>
            </View>
          ) : null}
          {element.occurredAt ? (
            <View style={[styles.metaPill, { backgroundColor: opacity.card.subtle }]}>
              <Text style={[styles.metaText, { color: palette.textSecondary }]}>
                {element.occurredAt}
              </Text>
            </View>
          ) : null}
          {element.tags?.map((tag) => (
            <View key={tag} style={[styles.metaPill, { backgroundColor: opacity.card.subtle }]}>
              <Text style={[styles.metaText, { color: palette.textSecondary }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <UniverseConnectionsSection
        connections={connections}
        onAddConnection={onAddConnection}
        onOpenElement={onOpenElement}
      />

      <View style={styles.actions}>
        <SurfaceCard
          variant="interactive"
          radius="sm"
          padding="sm"
          shadow={false}
          onPress={onEdit}
          accessibilityLabel={`Editar ${element.name}`}
          style={styles.actionCard}
          contentStyle={styles.actionContent}
        >
          <Pencil size={17} color={palette.accent} strokeWidth={1.7} />
          <Text style={[styles.actionLabel, { color: palette.textPrimary }]}>Editar conteúdo</Text>
        </SurfaceCard>
        <SurfaceCard
          variant="interactive"
          radius="sm"
          padding="sm"
          shadow={false}
          onPress={onDelete}
          accessibilityLabel={`Excluir ${element.name}`}
          style={styles.actionCard}
          contentStyle={styles.actionContent}
        >
          <Trash2 size={17} color={palette.textSecondary} strokeWidth={1.7} />
          <Text style={[styles.actionLabel, { color: palette.textSecondary }]}>
            Excluir conteúdo
          </Text>
        </SurfaceCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  category: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
  },
  name: {
    ...typeRoles.display,
    marginTop: 2,
  },
  description: {
    ...typeRoles.bodySm,
    marginTop: 6,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
  },
  metaPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  metaText: {
    ...typeRoles.caption,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  actionCard: {
    flexBasis: '46%',
    flexGrow: 1,
    minWidth: 170,
  },
  actionContent: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionLabel: {
    ...typeRoles.buttonSm,
  },
});
