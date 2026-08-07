import { StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_HOME_CATEGORY_ICONS } from '../data/categoryIcons';
import type { UniverseHomeCategory } from '../types';

interface UniverseCategoryCardProps {
  category: UniverseHomeCategory;
  label: string;
  summary: string;
  onPress: () => void;
}

export function UniverseCategoryCard({
  category,
  label,
  summary,
  onPress,
}: UniverseCategoryCardProps) {
  const palette = useActivePalette();
  const opacity = useOpacity();
  const Icon = UNIVERSE_HOME_CATEGORY_ICONS[category];

  return (
    <SurfaceCard
      variant="interactive"
      radius="sm"
      padding="sm"
      shadow={false}
      onPress={onPress}
      accessibilityLabel={category === 'archive' ? 'Abrir acervo do universo' : `Abrir ${label}`}
      style={styles.card}
      contentStyle={styles.content}
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
        <Icon size={19} color={palette.accent} strokeWidth={1.65} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: palette.textPrimary }]}>{label}</Text>
        <Text style={[styles.meta, { color: palette.textSecondary }]}>{summary}</Text>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 142,
  },
  content: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typeRoles.label,
  },
  meta: {
    ...typeRoles.caption,
    marginTop: 2,
  },
});
