import { ChevronRight, Pencil, Plus, Repeat2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import type { Universe } from '../types';

interface UniverseOptionsMenuProps {
  universe: Universe;
  onEdit: () => void;
  onSwitch: () => void;
  onCreate: () => void;
}

const OPTIONS = [
  {
    id: 'edit',
    title: 'Editar universo',
    description: 'Atualize nome e descrição sem perder conteúdo.',
    icon: Pencil,
  },
  {
    id: 'switch',
    title: 'Trocar universo',
    description: 'Abra outra biblioteca permanente.',
    icon: Repeat2,
  },
  {
    id: 'create',
    title: 'Criar outro universo',
    description: 'Comece um novo cenário independente.',
    icon: Plus,
  },
] as const;

export function UniverseOptionsMenu({
  universe,
  onEdit,
  onSwitch,
  onCreate,
}: UniverseOptionsMenuProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const actions = { edit: onEdit, switch: onSwitch, create: onCreate };

  return (
    <View>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        Gerencie {universe.name} ou siga para outra biblioteca.
      </Text>
      <View style={[styles.list, { gap: components.spacing.grid }]}>
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <SurfaceCard
              key={option.id}
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={actions[option.id]}
              accessibilityLabel={option.title}
              contentStyle={styles.cardContent}
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
                <Icon size={19} color={palette.accent} strokeWidth={1.7} />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.title, { color: palette.textPrimary }]}>{option.title}</Text>
                <Text style={[styles.description, { color: palette.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              <ChevronRight size={17} color={palette.textSecondary} strokeWidth={1.6} />
            </SurfaceCard>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...typeRoles.bodySm,
    marginBottom: 16,
  },
  list: {},
  cardContent: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
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
  description: {
    ...typeRoles.caption,
    marginTop: 2,
  },
});
