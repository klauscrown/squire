import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ROUTES } from '@/constants';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

export function LoginSettingsButton() {
  const router = useRouter();
  const palette = useActivePalette();
  const elevated = useComponents().surfaceCard.variants.elevated;

  return (
    <Pressable
      onPress={() => router.push(ROUTES.app.settings)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: elevated.background,
          borderColor: elevated.border,
        },
        pressed && styles.pressed,
      ]}
      accessibilityLabel="Configurações"
      hitSlop={8}
    >
      <Ionicons name="settings-outline" size={18} color={palette.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
