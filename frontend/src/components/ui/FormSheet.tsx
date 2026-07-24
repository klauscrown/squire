import { X } from 'phosphor-react-native';
import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

interface FormSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function FormSheet({ visible, onClose, children, title }: FormSheetProps) {
  const isWeb = Platform.OS === 'web';

  const header = (
    <View style={styles.header}>
      <View style={styles.titleWrap}>
        <Text style={styles.eyebrow}>Grimório</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
        <X size={20} color={grimoire.colors.ivoryDim} weight="bold" />
      </Pressable>
    </View>
  );

  const body = (
    <ScrollView
      style={{ flex: isWeb ? undefined : 1 }}
      contentContainerStyle={styles.bodyContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );

  if (isWeb) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.webBackdrop} onPress={onClose}>
          <Pressable style={styles.webSheet} onPress={(e) => e.stopPropagation()}>
            {header}
            {body}
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.nativeRoot}
      >
        <View style={styles.handleWrap}>
          <View style={styles.handle} />
        </View>
        {header}
        {body}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  nativeRoot: {
    flex: 1,
    backgroundColor: grimoire.colors.background,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: grimoire.radius.full,
    backgroundColor: grimoire.colors.glassGoldBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: grimoire.spacing.screen,
    paddingBottom: grimoire.spacing.sm,
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: grimoire.typography.eyebrow.fontSize,
    letterSpacing: grimoire.typography.eyebrow.letterSpacing,
    textTransform: 'uppercase',
    color: grimoire.colors.goldMuted,
    marginBottom: 4,
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 28,
    lineHeight: 32,
    color: grimoire.colors.ivory,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: grimoire.colors.glassBorder,
    backgroundColor: grimoire.colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContent: {
    paddingHorizontal: grimoire.spacing.screen,
    paddingBottom: grimoire.spacing.lg,
  },
  webBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: grimoire.spacing.screen,
  },
  webSheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh' as unknown as number,
    backgroundColor: grimoire.colors.background,
    borderRadius: grimoire.radius.xl,
    borderWidth: 1,
    borderColor: grimoire.colors.glassBorder,
    overflow: 'hidden',
    paddingTop: grimoire.spacing.md,
  },
});
