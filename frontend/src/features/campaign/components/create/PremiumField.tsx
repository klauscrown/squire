import { ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

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
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={styles.inputShell}>
        <TextInput
          placeholderTextColor="rgba(148, 163, 184, 0.42)"
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            counter && styles.inputWithCounter,
            style,
          ]}
          multiline={multiline}
          {...props}
        />
        {counter ? <Text style={styles.counter}>{counter}</Text> : null}
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
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Pressable onPress={onPress} style={styles.select}>
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <ChevronDown size={16} color="rgba(148, 163, 184, 0.55)" strokeWidth={2} />
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
    fontFamily: fontFamily.inter.medium,
    fontSize: 13,
    color: 'rgba(203, 213, 225, 0.72)',
  },
  required: {
    color: '#F87171',
  },
  inputShell: {
    position: 'relative',
  },
  input: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: premium.text.primary,
  },
  inputMultiline: {
    minHeight: 112,
    paddingTop: 13,
    textAlignVertical: 'top',
  },
  inputWithCounter: {
    paddingBottom: 28,
  },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: 'rgba(148, 163, 184, 0.45)',
  },
  select: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectText: {
    flex: 1,
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: premium.text.primary,
  },
  selectPlaceholder: {
    color: 'rgba(148, 163, 184, 0.42)',
  },
  error: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: '#F87171',
  },
});
