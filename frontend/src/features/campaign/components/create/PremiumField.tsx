import { ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

interface PremiumFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  counter?: string;
}

export function PremiumField({
  label,
  required,
  error,
  counter,
  style,
  multiline,
  ...props
}: PremiumFieldProps) {
  const palette = useActivePalette();
  const surface = useComponents().surfaceCard;
  const elevated = surface.variants.elevated;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: palette.textSecondary }]}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={styles.inputShell}>
        <TextInput
          placeholderTextColor={`${palette.textSecondary}6B`}
          style={[
            styles.input,
            {
              backgroundColor: elevated.background,
              borderColor: elevated.border,
              borderWidth: surface.borderWidth,
              color: palette.textPrimary,
            },
            multiline && styles.inputMultiline,
            counter && styles.inputWithCounter,
            style,
          ]}
          multiline={multiline}
          {...props}
        />
        {counter ? (
          <Text style={[styles.counter, { color: palette.textSecondary }]}>{counter}</Text>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

interface PremiumSelectProps {
  label: string;
  required?: boolean;
  placeholder: string;
  value?: string;
  error?: string;
  onPress: () => void;
}

export function PremiumSelect({
  label,
  required,
  placeholder,
  value,
  error,
  onPress,
}: PremiumSelectProps) {
  const palette = useActivePalette();
  const surface = useComponents().surfaceCard;
  const elevated = surface.variants.elevated;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: palette.textSecondary }]}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Pressable
        onPress={onPress}
        style={[
          styles.select,
          {
            backgroundColor: elevated.background,
            borderColor: elevated.border,
            borderWidth: surface.borderWidth,
          },
        ]}
      >
        <Text
          style={[
            styles.selectText,
            { color: value ? palette.textPrimary : `${palette.textSecondary}6B` },
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={16} color={palette.textSecondary} strokeWidth={2} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    ...typeRoles.label,
  },
  required: {
    color: '#F87171',
  },
  inputShell: {
    position: 'relative',
  },
  input: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typeRoles.body,
  },
  inputMultiline: {
    minHeight: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputWithCounter: {
    paddingBottom: 22,
    minHeight: 48,
  },
  counter: {
    position: 'absolute',
    right: 10,
    bottom: 6,
    ...typeRoles.caption,
    fontSize: 11,
  },
  select: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectText: {
    flex: 1,
    ...typeRoles.body,
  },
  error: {
    ...typeRoles.caption,
    color: '#F87171',
  },
});
