import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_ICONS } from '../data/categoryIcons';
import type { UniverseConnectionView } from '../types';

interface UniverseConnectionListProps {
  connections: readonly UniverseConnectionView[];
  onOpenElement?: (elementId: string) => void;
}

export function UniverseConnectionList({
  connections,
  onOpenElement,
}: UniverseConnectionListProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();

  if (!connections.length) return null;

  return (
    <SurfaceCard variant="subtle" radius="md" padding="none" shadow={false} style={styles.list}>
      {connections.map((item, index) => {
        const Icon = UNIVERSE_CATEGORY_ICONS[item.relatedElement.category];
        return (
          <View key={item.connection.id}>
            <Pressable
              onPress={() => onOpenElement?.(item.relatedElement.id)}
              disabled={!onOpenElement}
              accessibilityRole={onOpenElement ? 'button' : undefined}
              accessibilityLabel={`${item.displayRelationLabel} ${item.relatedElement.name}`}
              style={({ pressed }) => [styles.row, pressed && { opacity: opacity.level.pressed }]}
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
                <Icon size={17} color={palette.accent} strokeWidth={1.65} />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.relation, { color: palette.textSecondary }]}>
                  {item.displayRelationLabel}
                </Text>
                <Text style={[styles.elementName, { color: palette.textPrimary }]}>
                  {item.relatedElement.name}
                </Text>
                {item.connection.context ? (
                  <Text style={[styles.context, { color: palette.textSecondary }]}>
                    {item.connection.context}
                  </Text>
                ) : null}
              </View>
              {onOpenElement ? (
                <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
              ) : null}
            </Pressable>
            {index < connections.length - 1 ? (
              <View style={[styles.divider, { backgroundColor: opacity.border.goldSubtle }]} />
            ) : null}
          </View>
        );
      })}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 14,
  },
  row: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  relation: {
    ...typeRoles.caption,
  },
  elementName: {
    ...typeRoles.label,
    marginTop: 1,
  },
  context: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
});
