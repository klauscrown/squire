import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { useState, type ComponentType } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/ui';
import type { QuickActionIconProps } from '@/components/illustrations/QuickActionIcons';
import {
  GenerateEncounterIcon,
  GenerateItemsIcon,
  GenerateNamesIcon,
  QuickNotesIcon,
} from '@/components/illustrations/QuickActionIcons';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import {
  ICON_VARIANT_KEYS,
  iconVariantBorder,
  iconVariantSoft,
  type IconVariantKey,
} from '@/theme/palettes';
import { spacing } from '@/theme/spacing';
import { fontFamily } from '@/theme/typography';

import { DiceRollerSheet } from './DiceRollerSheet';

type QuickActionId = 'names' | 'items' | 'notes' | 'encounter';

/** Mesmo mapeamento em ambos os temas — só os hex em `iconVariants` mudam. */
const ACTION_ICON_VARIANT: Record<QuickActionId, IconVariantKey> = {
  names: 'a',
  items: 'b',
  notes: 'c',
  encounter: 'd',
};

const QUICK_ACTIONS: {
  id: QuickActionId;
  label: string;
  Icon: ComponentType<QuickActionIconProps>;
}[] = [
  { id: 'names', label: 'Gerar nomes', Icon: GenerateNamesIcon },
  { id: 'items', label: 'Gerar itens', Icon: GenerateItemsIcon },
  { id: 'notes', label: 'Notas Rápidas', Icon: QuickNotesIcon },
  { id: 'encounter', label: 'Gerar Encontro', Icon: GenerateEncounterIcon },
];

function comingSoon(label: string) {
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  Alert.alert('Em breve', `${label} estará disponível em breve.`);
}

interface ShortcutTileProps {
  label: string;
  iconVariant: IconVariantKey;
  Icon: ComponentType<QuickActionIconProps>;
  index: number;
  onPress: () => void;
}

function ShortcutTile({ label, iconVariant, Icon, index, onPress }: ShortcutTileProps) {
  const [pressed, setPressed] = useState(false);
  const palette = useActivePalette();
  const components = useComponents();
  const tile = components.shortcutTile;

  const stroke = palette.iconVariants[iconVariant];
  const circleFill = iconVariantSoft(stroke);
  const circleBorder = iconVariantBorder(stroke);

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
        style={[
          styles.tile,
          {
            borderRadius: tile.radius,
            borderColor: pressed ? stroke : palette.surfaceBorder,
            backgroundColor: palette.surface,
            minHeight: tile.minHeight,
            opacity: pressed ? tile.pressedOpacity : 1,
            transform: pressed ? [{ scale: 0.97 }] : undefined,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View
          style={[
            styles.iconWrap,
            {
              width: tile.iconSize,
              height: tile.iconSize,
              borderRadius: tile.iconRadius,
              backgroundColor: circleFill,
              borderColor: circleBorder,
            },
          ]}
        >
          <Icon stroke={stroke} accentFill={circleFill} />
        </View>
        <Text
          style={[
            styles.label,
            {
              fontSize: tile.label.fontSize,
              lineHeight: tile.label.lineHeight,
              color: palette.textPrimary,
            },
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
      </Pressable>
    </MotiView>
  );
}

export function QuickActionsGrid() {
  const [showDice, setShowDice] = useState(false);
  const components = useComponents();

  function handlePress(id: QuickActionId, label: string) {
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
      <View style={{ marginTop: components.home.sectionGap }}>
        <SectionHeader title="Atalhos do Mestre" />
        <View style={[styles.row, { gap: components.spacing.grid }]}>
          {QUICK_ACTIONS.map((item, index) => (
            <ShortcutTile
              key={item.id}
              index={index}
              label={item.label}
              iconVariant={
                ACTION_ICON_VARIANT[item.id] ??
                ICON_VARIANT_KEYS[index % ICON_VARIANT_KEYS.length]!
              }
              Icon={item.Icon}
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
  row: {
    flexDirection: 'row',
  },
  tileSlot: {
    flex: 1,
    minWidth: 0,
  },
  tile: {
    borderWidth: 1,
    padding: spacing.smMd,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    textAlign: 'center',
  },
});
