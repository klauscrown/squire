import { Check, ChevronRight, Orbit, Plus } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import { useGetUniverses, useSelectActiveUniverse } from '../hooks';
import type { Universe } from '../types';

interface UniversePickerProps {
  activeUniverseId?: string;
  onSelected: (universe: Universe) => void;
  onCreate: () => void;
}

export function UniversePicker({ activeUniverseId, onSelected, onCreate }: UniversePickerProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const { data: universes = [], isLoading } = useGetUniverses();
  const { mutate: selectUniverse, isPending } = useSelectActiveUniverse();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        Escolha qual biblioteca deseja explorar. Cada universo mantém seu próprio conteúdo.
      </Text>

      <View style={[styles.list, { gap: components.spacing.grid }]}>
        {universes.map((universe) => {
          const active = universe.id === activeUniverseId;
          return (
            <SurfaceCard
              key={universe.id}
              variant="interactive"
              radius="sm"
              padding="sm"
              shadow={false}
              onPress={() => selectUniverse(universe.id, { onSuccess: onSelected })}
              disabled={isPending}
              accessibilityLabel={`${active ? 'Universo ativo' : 'Trocar para'} ${universe.name}`}
              accessibilityState={{ selected: active, disabled: isPending }}
              contentStyle={styles.cardContent}
            >
              <View
                style={[
                  styles.icon,
                  {
                    borderColor: active
                      ? opacity.iconCircle.lilacBorder
                      : opacity.iconCircle.goldBorder,
                    backgroundColor: active
                      ? opacity.iconCircle.lilacFill
                      : opacity.iconCircle.goldSubtle,
                  },
                ]}
              >
                <Orbit
                  size={20}
                  color={active ? opacity.iconStroke.lilac : palette.accent}
                  strokeWidth={1.7}
                />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.name, { color: palette.textPrimary }]}>{universe.name}</Text>
                <Text
                  style={[styles.description, { color: palette.textSecondary }]}
                  numberOfLines={2}
                >
                  {universe.description || 'Universo sem descrição.'}
                </Text>
                {active ? (
                  <Text style={[styles.activeLabel, { color: palette.accent }]}>Ativo agora</Text>
                ) : null}
              </View>
              {active ? (
                <Check size={19} color={palette.accent} strokeWidth={1.9} />
              ) : (
                <ChevronRight size={17} color={palette.textSecondary} strokeWidth={1.6} />
              )}
            </SurfaceCard>
          );
        })}
      </View>

      <SurfaceCard
        variant="interactive"
        radius="sm"
        padding="sm"
        shadow={false}
        onPress={onCreate}
        accessibilityLabel="Criar outro universo"
        style={styles.createCard}
        contentStyle={styles.createContent}
      >
        <Plus size={18} color={palette.accent} strokeWidth={1.8} />
        <Text style={[styles.createLabel, { color: palette.textPrimary }]}>
          Criar outro universo
        </Text>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...typeRoles.bodySm,
    marginBottom: 16,
  },
  loading: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {},
  cardContent: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...typeRoles.label,
  },
  description: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  activeLabel: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
    marginTop: 5,
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
