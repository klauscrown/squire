import * as Haptics from 'expo-haptics';

import { Dice6, NotebookPen, Package, Sparkles } from 'lucide-react-native';

import { MotiView } from 'moti';

import { useState } from 'react';

import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { LucideIcon } from 'lucide-react-native';

import { premium } from '@/theme/premium';

import { fontFamily } from '@/theme/typography';

import { DiceRollerSheet } from './DiceRollerSheet';

const SHORTCUTS = [
  {
    id: 'names',
    icon: Sparkles,
    label: 'Gerar nomes',
    color: '#A78BFA',
    bg: 'rgba(139, 92, 246, 0.16)',
  },

  {
    id: 'items',
    icon: Package,
    label: 'Gerar itens',
    color: '#60A5FA',
    bg: 'rgba(59, 130, 246, 0.16)',
  },

  {
    id: 'notes',
    icon: NotebookPen,
    label: 'Notas Rápidas',
    color: '#818CF8',
    bg: 'rgba(99, 102, 241, 0.16)',
  },

  {
    id: 'encounter',
    icon: Dice6,
    label: 'Gerar Encontro',
    color: '#C084FC',
    bg: 'rgba(168, 85, 247, 0.16)',
  },
] as const;

function comingSoon(label: string) {
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  Alert.alert('Em breve', `${label} estará disponível em breve.`);
}

interface ShortcutTileProps {
  icon: LucideIcon;

  label: string;

  color: string;

  bg: string;

  index: number;

  onPress: () => void;
}

function ShortcutTile({ icon: Icon, label, color, bg, index, onPress }: ShortcutTileProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96 }}

      animate={{ opacity: 1, scale: 1 }}

      transition={{ type: 'timing', duration: 260, delay: 60 + index * 35 }}

      style={styles.tileSlot}
    >
      <Pressable
        onPress={onPress}

        onPressIn={() => setPressed(true)}

        onPressOut={() => setPressed(false)}

        style={[styles.tile, pressed && styles.tilePressed]}

        accessibilityRole="button"

        accessibilityLabel={label}
      >
        <View style={[styles.iconWrap, { backgroundColor: bg }]}>
          <Icon size={26} color={color} strokeWidth={1.5} />
        </View>

        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </Pressable>
    </MotiView>
  );
}

export function MasterShortcutsSection() {
  const [showDice, setShowDice] = useState(false);

  function handlePress(id: (typeof SHORTCUTS)[number]['id'], label: string) {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (id === 'encounter') {
      setShowDice(true);

      return;
    }

    comingSoon(label);
  }

  return (
    <>
      <View style={styles.section}>
        <View style={styles.row}>
          {SHORTCUTS.map((item, index) => (
            <ShortcutTile
              key={item.id}

              index={index}

              icon={item.icon}

              label={item.label}

              color={item.color}

              bg={item.bg}

              onPress={() => handlePress(item.id, item.label)}
            />
          ))}
        </View>
      </View>

      <DiceRollerSheet visible={showDice} onClose={() => setShowDice(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: premium.spacing.section,
  },

  row: {
    flexDirection: 'row',

    gap: 10,
  },

  tileSlot: {
    flex: 1,

    minWidth: 0,
  },

  tile: {
    borderRadius: premium.radius.md,

    backgroundColor: premium.surface.card,

    borderWidth: 1,

    borderColor: premium.surface.cardBorder,

    paddingVertical: 14,

    paddingHorizontal: 6,

    alignItems: 'center',

    justifyContent: 'center',

    gap: 10,

    minHeight: 112,
  },

  tilePressed: {
    opacity: 0.88,

    transform: [{ scale: 0.97 }],

    borderColor: premium.glass.borderStrong,
  },

  iconWrap: {
    width: 48,

    height: 48,

    borderRadius: premium.radius.sm,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: StyleSheet.hairlineWidth,

    borderColor: premium.surface.cardBorderSubtle,
  },

  label: {
    fontFamily: fontFamily.inter.medium,

    fontSize: 10,

    lineHeight: 13,

    textAlign: 'center',

    color: premium.text.primary,
  },
});
