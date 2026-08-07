import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

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
  const palette = useActivePalette();
  const surface = useComponents().surfaceCard;
  const elevated = surface.variants.elevated;
  const radius = useComponents().radius;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              backgroundColor: elevated.background,
              borderColor: elevated.border,
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={[styles.title, { color: palette.textPrimary }]}>{title}</Text>
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
                  style={[
                    styles.option,
                    {
                      borderRadius: radius.sm,
                      backgroundColor: isSelected ? `${palette.accent}22` : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected ? palette.accent : palette.textSecondary,
                        fontFamily: isSelected
                          ? typeRoles.label.fontFamily
                          : typeRoles.body.fontFamily,
                      },
                    ]}
                  >
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
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 18,
    paddingBottom: 24,
  },
  title: {
    ...typeRoles.titleSm,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 12,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  optionLabel: {
    ...typeRoles.body,
    fontSize: 15,
  },
});
