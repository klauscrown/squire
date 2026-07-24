import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ROUTES } from '@/constants';

import { loginTheme } from '../constants/loginTheme';

export function LoginSettingsButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(ROUTES.app.settings)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityLabel="Configurações"
      hitSlop={8}
    >
      <Ionicons name="settings-outline" size={18} color={loginTheme.text.subtitle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: loginTheme.settings.background,
  },
  pressed: {
    opacity: 0.75,
  },
});
