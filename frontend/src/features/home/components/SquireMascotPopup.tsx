import { X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { grimoireImages } from '@/assets/grimoire';
import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';
import { GlowPulse, GrimoireImage } from '@/components/grimoire';
import { grimoire } from '@/theme/grimoire';
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
  const [tipIndex, setTipIndex] = useState(randomTipIndex);
  const bottom = CURVED_TAB_BAR_FOOTPRINT + Math.max(insets.bottom, 8) + 74;

  useEffect(() => {
    if (visible) setTipIndex(randomTipIndex());
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar popup">
        <Pressable
          style={[styles.popup, { bottom, left: grimoire.spacing.screen }]}
          onPress={(event) => event.stopPropagation()}
        >
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={18} color={grimoire.colors.ivoryDim} weight="bold" />
          </Pressable>

          <View style={styles.mascotWrap}>
            <GlowPulse color={`${grimoire.colors.gold}88`} size={56} style={styles.mascotGlow} />
            <GrimoireImage
              source={grimoireImages.mascot}
              style={styles.mascot}
              contentFit="contain"
            />
          </View>

          <Text style={styles.label}>Conselho do Escudeiro</Text>
          <Text style={styles.message}>{TIPS[tipIndex]}</Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            accessibilityRole="button"
          >
            <Text style={styles.actionLabel}>Entendi!</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  popup: {
    position: 'absolute',
    right: grimoire.spacing.screen,
    borderRadius: grimoire.radius.xl,
    backgroundColor: 'rgba(14, 12, 28, 0.98)',
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 16,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: grimoire.colors.gold,
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
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: grimoire.colors.glassBorder,
    backgroundColor: grimoire.colors.glass,
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
    color: grimoire.colors.gold,
  },
  message: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: `${grimoire.colors.ivory}D9`,
  },
  actionBtn: {
    marginTop: 4,
    borderRadius: grimoire.radius.lg,
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: 'rgba(201, 169, 98, 0.12)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 14,
    color: grimoire.colors.gold,
  },
});
