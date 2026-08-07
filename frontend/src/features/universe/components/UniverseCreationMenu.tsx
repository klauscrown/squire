import { ChevronRight, Library } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { UNIVERSE_CATEGORY_ICONS } from '../data/categoryIcons';
import { QUICK_CREATE_CATEGORIES, UNIVERSE_CATEGORY_META } from '../data/demoUniverse';
import type { UniverseElementCategory } from '../types';

const QUICK_CREATE_LABELS: Partial<Record<UniverseElementCategory, string>> = {
  character: 'Personagem',
  location: 'Local',
  faction: 'Facção',
  item: 'Item',
  history: 'História',
  fragment: 'Fragmento',
};

interface UniverseCreationMenuProps {
  universeName: string;
  suggestedCategory?: UniverseElementCategory;
  onSelectCategory: (category: UniverseElementCategory) => void;
  onViewAll: () => void;
}

export function UniverseCreationMenu({
  universeName,
  suggestedCategory,
  onSelectCategory,
  onViewAll,
}: UniverseCreationMenuProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const categories = suggestedCategory
    ? [suggestedCategory, ...QUICK_CREATE_CATEGORIES.filter((item) => item !== suggestedCategory)]
    : QUICK_CREATE_CATEGORIES;

  return (
    <View>
      <Text style={[styles.intro, { color: palette.textSecondary }]}>
        Escolha o que deseja registrar em {universeName}. Você poderá completar os detalhes depois.
      </Text>

      <View style={[styles.grid, { gap: components.spacing.grid }]}>
        {categories.map((category) => {
          const Icon = UNIVERSE_CATEGORY_ICONS[category];
          const meta = UNIVERSE_CATEGORY_META[category];
          const suggested = category === suggestedCategory;
          const label = QUICK_CREATE_LABELS[category] ?? meta.singular;

          return (
            <SurfaceCard
              key={category}
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={() => onSelectCategory(category)}
              accessibilityLabel={`Criar ${label}`}
              style={styles.option}
              contentStyle={styles.optionContent}
            >
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: suggested
                      ? opacity.iconCircle.lilacFill
                      : opacity.iconCircle.goldSubtle,
                    borderColor: suggested
                      ? opacity.iconCircle.lilacBorder
                      : opacity.iconCircle.goldBorder,
                  },
                ]}
              >
                <Icon
                  size={19}
                  color={suggested ? opacity.iconStroke.lilac : palette.accent}
                  strokeWidth={1.7}
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={[styles.optionTitle, { color: palette.textPrimary }]}>{label}</Text>
                <Text
                  style={[styles.optionDescription, { color: palette.textSecondary }]}
                  numberOfLines={2}
                >
                  {suggested ? 'Atalho selecionado' : meta.description}
                </Text>
              </View>
              <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
            </SurfaceCard>
          );
        })}
      </View>

      <SurfaceCard
        variant="interactive"
        radius="sm"
        padding="sm"
        shadow={false}
        onPress={onViewAll}
        accessibilityLabel="Ver todas as categorias"
        style={styles.allCategories}
        contentStyle={styles.allCategoriesContent}
      >
        <Library size={18} color={palette.accent} strokeWidth={1.7} />
        <Text style={[styles.allCategoriesLabel, { color: palette.textPrimary }]}>
          Ver todas as categorias
        </Text>
        <ChevronRight size={16} color={palette.textSecondary} strokeWidth={1.5} />
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typeRoles.bodySm,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexBasis: '46%',
    flexGrow: 1,
    minWidth: 190,
  },
  optionContent: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCopy: {
    flex: 1,
    minWidth: 0,
  },
  optionTitle: {
    ...typeRoles.label,
  },
  optionDescription: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  allCategories: {
    marginTop: 12,
  },
  allCategoriesContent: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  allCategoriesLabel: {
    ...typeRoles.buttonSm,
    flex: 1,
  },
});
