import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

interface OptionPickerModalProps {
  visible: boolean;
  title: string;
  options: readonly string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function OptionPickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {options.map((option) => {
              const isSelected = option === selected;
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '58%',
    borderTopLeftRadius: premium.radius.lg,
    borderTopRightRadius: premium.radius.lg,
    backgroundColor: '#111827',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: premium.glass.border,
    paddingTop: 18,
    paddingBottom: 24,
  },
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 16,
    color: premium.text.primary,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 12,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: premium.radius.sm,
  },
  optionSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
  },
  optionLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: premium.text.secondary,
  },
  optionLabelSelected: {
    color: premium.accentSoft,
    fontFamily: fontFamily.inter.medium,
  },
});
