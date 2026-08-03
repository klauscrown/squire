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

import { useGrimoire } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

interface FormSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function FormSheet({ visible, onClose, children, title }: FormSheetProps) {
  const grimoire = useGrimoire();
  const isWeb = Platform.OS === 'web';

  const header = (
    <View style={[styles.header, { paddingHorizontal: grimoire.spacing.screen, paddingBottom: grimoire.spacing.sm }]}>
      <View style={styles.titleWrap}>
        <Text
          style={[
            styles.eyebrow,
            {
              fontSize: grimoire.typography.eyebrow.fontSize,
              letterSpacing: grimoire.typography.eyebrow.letterSpacing,
              color: grimoire.colors.goldMuted,
            },
          ]}
        >
          Grimório
        </Text>
        <Text style={[styles.title, { color: grimoire.colors.ivory }]}>{title}</Text>
      </View>
      <Pressable
        onPress={onClose}
        hitSlop={8}
        style={[
          styles.closeBtn,
          {
            borderColor: grimoire.colors.glassBorder,
            backgroundColor: grimoire.colors.glass,
          },
        ]}
      >
        <X size={20} color={grimoire.colors.ivoryDim} weight="bold" />
      </Pressable>
    </View>
  );

  const body = (
    <ScrollView
      style={{ flex: isWeb ? undefined : 1 }}
      contentContainerStyle={{
        paddingHorizontal: grimoire.spacing.screen,
        paddingBottom: grimoire.spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );

  if (isWeb) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable
          style={[styles.webBackdrop, { padding: grimoire.spacing.screen }]}
          onPress={onClose}
        >
          <Pressable
            style={[
              styles.webSheet,
              {
                backgroundColor: grimoire.colors.background,
                borderRadius: grimoire.radius.xl,
                borderColor: grimoire.colors.glassBorder,
                paddingTop: grimoire.spacing.md,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
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
        style={[styles.nativeRoot, { backgroundColor: grimoire.colors.background }]}
      >
        <View style={styles.handleWrap}>
          <View
            style={[
              styles.handle,
              {
                borderRadius: grimoire.radius.full,
                backgroundColor: grimoire.colors.glassGoldBorder,
              },
            ]}
          />
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
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fontFamily.inter.semibold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 28,
    lineHeight: 32,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webSheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh' as unknown as number,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
