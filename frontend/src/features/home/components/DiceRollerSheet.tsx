import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { GrimoireOptionPills } from '@/components/grimoire';
import { FormSheet } from '@/components/ui';
import { GrimoireGoldButton } from '@/features/auth/components';
import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

type RollMode = 'normal' | 'advantage' | 'disadvantage';

interface DiceRollerSheetProps {
  visible: boolean;
  onClose: () => void;
}

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function rollWithMode(mode: RollMode): { primary: number; secondary?: number } {
  const first = rollD20();
  if (mode === 'normal') return { primary: first };

  const second = rollD20();
  if (mode === 'advantage') {
    return { primary: Math.max(first, second), secondary: Math.min(first, second) };
  }
  return { primary: Math.min(first, second), secondary: Math.max(first, second) };
}

const MODE_OPTIONS: RollMode[] = ['normal', 'advantage', 'disadvantage'];
const MODE_LABELS: Record<RollMode, string> = {
  normal: 'Normal',
  advantage: 'Vantagem',
  disadvantage: 'Desvantagem',
};

export function DiceRollerSheet({ visible, onClose }: DiceRollerSheetProps) {
  const grimoire = useGrimoire();
  const [mode, setMode] = useState<RollMode>('normal');
  const [result, setResult] = useState<{ primary: number; secondary?: number } | null>(null);

  function handleClose() {
    setResult(null);
    setMode('normal');
    onClose();
  }

  function handleRoll() {
    const rolled = rollWithMode(mode);
    setResult(rolled);

    if (Platform.OS !== 'web') {
      const isCrit = rolled.primary === 20;
      const isFail = rolled.primary === 1;
      if (isCrit || isFail) {
        Haptics.notificationAsync(
          isCrit
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Error,
        );
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }

  const isCrit = result?.primary === 20;
  const isFail = result?.primary === 1;

  return (
    <FormSheet visible={visible} title="Rolar d20" onClose={handleClose}>
      <GrimoireOptionPills
        label="Modo"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        getLabel={(option) => MODE_LABELS[option] ?? option}
      />

      <View style={styles.resultWrap}>
        {result ? (
          <>
            <Text
              style={[
                styles.resultValue,
                { color: grimoire.colors.gold },
                isCrit && {
                  color: grimoire.colors.success,
                  textShadowColor: `${grimoire.colors.success}66`,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 16,
                },
                isFail && { color: grimoire.colors.destructive },
              ]}
            >
              {result.primary}
            </Text>
            {result.secondary != null ? (
              <Text style={[styles.secondaryRoll, { color: grimoire.colors.ivoryDim }]}>
                outro dado: {result.secondary}
              </Text>
            ) : null}
            {isCrit ? (
              <Text style={[styles.flavor, { color: grimoire.colors.success }]}>Crítico!</Text>
            ) : null}
            {isFail ? (
              <Text style={[styles.flavor, { color: grimoire.colors.destructive }]}>
                Falha crítica
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={[styles.placeholder, { color: grimoire.colors.ivoryDim }]}>
            Toque abaixo para lançar o dado
          </Text>
        )}
      </View>

      <GrimoireGoldButton title={result ? 'Rolar de novo' : 'Rolar d20'} onPress={handleRoll} />
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  resultWrap: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingVertical: 16,
  },
  resultValue: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 72,
    lineHeight: 80,
  },
  secondaryRoll: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 13,
    marginTop: 8,
  },
  flavor: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  placeholder: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
