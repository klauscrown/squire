import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { useAuth } from '@/components/providers/AuthProvider';
import { GrimoireInput } from '@/components/grimoire';
import { Text } from '@/components/ui';
import { ROUTES } from '@/constants';
import {
  AuthText,
  ExplorerNoticeCard,
  GrimoireGoldButton,
  LoginHero,
  LoginScreenLayout,
} from '@/features/auth/components';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { registerSchema, type RegisterInput } from '@/features/auth/types';
import { useAppStore } from '@/store/appStore';
import { useActivePalette } from '@/store/useThemeStore';

export default function RegisterScreen() {
  const router = useRouter();
  const palette = useActivePalette();
  const { isSupabaseConfigured, signUpWithEmail } = useAuth();
  const setExplorerMode = useAppStore((state) => state.setExplorerMode);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(data: RegisterInput) {
    setNotice(null);

    if (!isSupabaseConfigured) {
      setNotice(
        'Supabase não configurado. Preencha EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env.',
      );
      return;
    }

    try {
      await signUpWithEmail(data.email, data.password);
      setExplorerMode(false);
      router.replace(ROUTES.app.home);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    }
  }

  return (
    <LoginScreenLayout>
      <LoginHero
        eyebrow="Novo grimório"
        title="Forje seu legado."
        subtitle="Registre-se para guardar crônicas, NPCs e sessões na nuvem com segurança."
        compact
      />

      <ExplorerNoticeCard isSupabaseMode={isSupabaseConfigured} />

      {notice ? (
        <Text variant="caption" style={[styles.notice, { color: palette.accent }]}>
          {notice}
        </Text>
      ) : null}

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <GrimoireInput
              label="Runa de Acesso"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="mestre@reino.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <GrimoireInput
              label="Selo Secreto"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Mínimo 6 caracteres"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <GrimoireInput
              label="Confirmar selo"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              placeholder="Repita o selo"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <GrimoireGoldButton
          title="Forjar grimório"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={!isSupabaseConfigured}
        />
      </View>

      <Link href={ROUTES.auth.login} asChild>
        <Pressable style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed]}>
          <AuthText style={[styles.secondaryText, { color: palette.accent }]}>
            Voltar ao login
          </AuthText>
        </Pressable>
      </Link>
    </LoginScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    marginBottom: 4,
  },
  notice: {
    marginBottom: 12,
    textAlign: 'center',
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryPressed: {
    opacity: 0.7,
  },
  secondaryText: loginTypography.link,
});
