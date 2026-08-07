import { Link2, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { typeRoles } from '@/theme/typography';

import type { UniverseConnectionView } from '../types';
import { UniverseConnectionList } from './UniverseConnectionList';

interface UniverseConnectionsSectionProps {
  connections: readonly UniverseConnectionView[];
  onAddConnection: () => void;
  onOpenElement?: (elementId: string) => void;
}

export function UniverseConnectionsSection({
  connections,
  onAddConnection,
  onOpenElement,
}: UniverseConnectionsSectionProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();

  return (
    <View style={{ marginTop: components.spacing.section }}>
      <Text style={[styles.title, { color: palette.textPrimary }]}>Conexões</Text>
      <Text style={[styles.description, { color: palette.textSecondary }]}>
        Relacione este conteúdo a personagens, locais, itens, histórias ou campanhas.
      </Text>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        Você poderá fazer isso depois.
      </Text>

      <UniverseConnectionList connections={connections} onOpenElement={onOpenElement} />

      <Pressable
        onPress={onAddConnection}
        accessibilityRole="button"
        accessibilityLabel="Adicionar conexão"
        style={({ pressed }) => [
          styles.addButton,
          {
            borderColor: opacity.border.goldSubtle,
            backgroundColor: opacity.card.subtle,
          },
          pressed && { opacity: opacity.level.pressed },
        ]}
      >
        <Plus size={17} color={palette.accent} strokeWidth={1.8} />
        <Text style={[styles.addLabel, { color: palette.accent }]}>Adicionar conexão</Text>
        <Link2 size={16} color={palette.textSecondary} strokeWidth={1.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typeRoles.titleSm,
  },
  description: {
    ...typeRoles.bodySm,
    marginTop: 4,
  },
  helper: {
    ...typeRoles.caption,
    marginTop: 3,
  },
  addButton: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
  },
  addLabel: {
    ...typeRoles.buttonSm,
  },
});
