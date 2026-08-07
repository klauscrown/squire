import { ChevronRight, Link2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressScale } from '@/hooks/usePressScale';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_ICONS } from '../data/categoryIcons';
import { UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import type { UniverseElementSummary } from '../types';

interface UniverseRecentItemProps {
  element: UniverseElementSummary;
  showDivider: boolean;
  onPress: () => void;
}

export function UniverseRecentItem({ element, showDivider, onPress }: UniverseRecentItemProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const { animatedStyle, setPressed } = usePressScale();
  const Icon = UNIVERSE_CATEGORY_ICONS[element.category];
  const categoryLabel = UNIVERSE_CATEGORY_META[element.category].singular;
  const updatedLabel = `Atualizado em ${element.updatedAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })}`;

  return (
    <>
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${element.name}, ${categoryLabel}`}
      >
        {({ pressed }) => (
          <Animated.View
            style={[styles.row, animatedStyle, pressed && { backgroundColor: opacity.card.subtle }]}
          >
            <View
              style={[
                styles.icon,
                {
                  borderColor: opacity.iconCircle.goldBorder,
                  backgroundColor: opacity.iconCircle.goldSubtle,
                },
              ]}
            >
              <Icon size={18} color={palette.accent} strokeWidth={1.65} />
            </View>
            <View style={styles.copy}>
              <Text style={[styles.category, { color: palette.accent }]}>{categoryLabel}</Text>
              <Text style={[styles.title, { color: palette.textPrimary }]}>{element.name}</Text>
              {element.description ? (
                <Text style={[styles.summary, { color: palette.textSecondary }]}>
                  {element.description}
                </Text>
              ) : null}
              <View style={styles.metaRow}>
                <Text style={[styles.meta, { color: palette.textSecondary }]}>{updatedLabel}</Text>
                {element.connectionCount ? (
                  <View style={[styles.connectionBadge, { backgroundColor: opacity.card.subtle }]}>
                    <Link2 size={11} color={palette.textSecondary} strokeWidth={1.6} />
                    <Text style={[styles.connectionText, { color: palette.textSecondary }]}>
                      {element.connectionCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
          </Animated.View>
        )}
      </Pressable>
      {showDivider ? (
        <View style={[styles.divider, { backgroundColor: opacity.border.goldSubtle }]} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  category: {
    ...typeRoles.badge,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  title: {
    ...typeRoles.label,
    marginTop: 1,
  },
  summary: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  meta: {
    ...typeRoles.caption,
    fontSize: 10,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  connectionText: {
    ...typeRoles.caption,
    fontSize: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
});
