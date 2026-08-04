import { X } from 'phosphor-react-native';
import { useMemo } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { grimoireImages } from '@/assets/grimoire';
import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { GlowPulse, GrimoireImage } from '@/components/grimoire';
import { useGrimoire } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

const TIPS = [
  'Precisa de inspiração? Crie uma campanha e deixe as histórias fluírem.',
  'Use os atalhos rápidos para gerar nomes, itens e encontros na mesa.',
  'Organize sessões e NPCs na aba Campanhas — tudo num só grimório.',
  'A Biblioteca guarda suas referências. Volte sempre que precisar consultar.',
  'Um bom Mestre prepara, mas improvisa com coragem. Eu estou aqui para ajudar!',
] as const;

function randomTipIndex() {
  return Math.floor(Math.random() * TIPS.length);
}

interface SquireMascotPopupProps {
  visible: boolean;
  onClose: () => void;
}

export function SquireMascotPopup({ visible, onClose }: SquireMascotPopupProps) {
  const insets = useSafeAreaInsets();
  const palette = useActivePalette();
  const grimoire = useGrimoire();
  /** Nova dica a cada abertura (visível true) sem setState em effect. */
  const tipIndex = useMemo(
    () => (visible ? randomTipIndex() : 0),
    // re-roll only when the popup opens
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
    [visible],
  );
  const bottom = CURVED_TAB_BAR_FOOTPRINT + Math.max(insets.bottom, 8) + 74;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: grimoire.colors.overlay }]}
        onPress={onClose}
        accessibilityLabel="Fechar popup"
      >
        <Pressable
          style={[
            styles.popup,
            {
              bottom,
              left: grimoire.spacing.screen,
              right: grimoire.spacing.screen,
              borderRadius: grimoire.radius.xl,
              backgroundColor: grimoire.colors.popupFill,
              borderColor: palette.surfaceBorder,
              ...Platform.select({
                ios: {
                  shadowColor: palette.accent,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.22,
                  shadowRadius: 20,
                },
                android: {
                  elevation: 12,
                },
                default: {},
              }),
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.popupAccent, { backgroundColor: palette.surfaceBorder }]} />
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [
              styles.closeBtn,
              {
                borderColor: grimoire.colors.glassBorder,
                backgroundColor: pressed ? palette.accentSoft : grimoire.colors.glass,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={18} color={palette.textSecondary} weight="bold" />
          </Pressable>

          <View style={styles.mascotWrap}>
            <GlowPulse color={palette.accentSoft} size={56} style={styles.mascotGlow} />
            <GrimoireImage
              source={grimoireImages.mascot}
              style={styles.mascot}
              contentFit="contain"
            />
          </View>

          <Text style={[styles.label, { color: palette.accent }]}>Conselho do Escudeiro</Text>
          <Text style={[styles.message, { color: palette.textPrimary }]}>{TIPS[tipIndex]}</Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                borderRadius: grimoire.radius.lg,
                borderColor: palette.surfaceBorder,
                backgroundColor: pressed ? palette.accentSoft : palette.surface,
              },
            ]}
            accessibilityRole="button"
          >
            <Text style={[styles.actionLabel, { color: palette.accent }]}>Entendi!</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  popup: {
    position: 'absolute',
    borderWidth: 1,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 10,
    overflow: 'hidden',
  },
  popupAccent: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  mascotWrap: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  mascotGlow: {
    position: 'absolute',
    borderRadius: 20,
  },
  mascot: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  label: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  message: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
  },
  actionBtn: {
    marginTop: 4,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
  },
});
