import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Lock, Mail, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/constants';
import { LoginScreenLayout, PremiumPrimaryButton } from '@/features/auth/components';
import { AuthText } from '@/features/auth/components/AuthText';
import { LoginAuthField } from '@/features/auth/components/login/LoginAuthField';
import { GoogleIcon, DiscordIcon } from '@/features/auth/components/login/LoginBrandIcons';
import { LoginBrandHeader } from '@/features/auth/components/login/LoginBrandHeader';
import { LoginFooterArt } from '@/features/auth/components/login/LoginFooterArt';
import { LoginOrnamentDivider } from '@/features/auth/components/login/LoginOrnamentDivider';
import { LoginRegisterCard } from '@/features/auth/components/login/LoginRegisterCard';
import { LoginSocialButton } from '@/features/auth/components/login/LoginSocialButton';
import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginTheme } from '@/features/auth/constants/loginTheme';
import { loginSchema, type LoginInput } from '@/features/auth/types';
import { useAppStore } from '@/store/appStore';

export default function LoginScreen() {
  const router = useRouter();
  const { isFirebaseConfigured, isSupabaseConfigured, signInWithEmail, signInAnonymously } =
    useAuth();
  const setExplorerMode = useAppStore((state) => state.setExplorerMode);

  const [guestLoading, setGuestLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginInput) {
    setNotice(null);

    if (!isFirebaseConfigured) {
      setNotice('Firebase não configurado. Preencha as variáveis EXPO_PUBLIC_FIREBASE_* no .env.');
      return;
    }

    try {
      await signInWithEmail(data.email, data.password);
      setExplorerMode(false);
      router.replace(ROUTES.app.home);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Não foi possível entrar.');
    }
  }

  async function handleContinueAsGuest() {
    setGuestLoading(true);
    setNotice(null);

    try {
      if (isSupabaseConfigured) {
        try {
          await signInAnonymously();
          setExplorerMode(false);
        } catch {
          setExplorerMode(true);
          setNotice('Nuvem indisponível. Explorando localmente — os dados ficam neste dispositivo.');
        }
      } else {
        setExplorerMode(true);
      }

      router.replace(ROUTES.app.home);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Não foi possível continuar.');
    } finally {
      setGuestLoading(false);
    }
  }

  function handleForgotPassword() {
    Alert.alert('Em breve', 'A recuperação de senha estará disponível em uma próxima atualização.');
  }

  function handleSocialLogin(provider: 'Google' | 'Discord') {
    Alert.alert('Em breve', `Login com ${provider} estará disponível em uma próxima atualização.`);
  }

  return (
    <LoginScreenLayout>
      <LoginBrandHeader />

      {notice ? <AuthText style={styles.notice}>{notice}</AuthText> : null}

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <LoginAuthField
              icon={Mail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="Email"
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
            <LoginAuthField
              icon={Lock}
              secureToggle
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              placeholder="Senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
            />
          )}
        />

        <Pressable
          onPress={handleForgotPassword}
          style={({ pressed }) => [styles.forgotWrap, pressed && styles.forgotPressed]}
        >
          <AuthText style={styles.forgotText}>Esqueci minha senha</AuthText>
        </Pressable>

        <PremiumPrimaryButton
          title="Entrar no Grimório"
          icon={Sparkles}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={!isFirebaseConfigured}
        />
      </View>

      <LoginOrnamentDivider label="ou continue com" />

      <View style={styles.socialRow}>
        <LoginSocialButton
          label="Google"
          icon={<GoogleIcon size={18} />}
          onPress={() => handleSocialLogin('Google')}
        />
        <LoginSocialButton
          label="Discord"
          icon={<DiscordIcon size={18} />}
          onPress={() => handleSocialLogin('Discord')}
        />
      </View>

      <LoginRegisterCard />

      <LoginFooterArt onExplore={handleContinueAsGuest} exploreLoading={guestLoading} />
    </LoginScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  notice: {
    fontFamily: loginFonts.body,
    color: loginTheme.link,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 12,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 4,
    paddingVertical: 2,
  },
  forgotPressed: {
    opacity: 0.75,
  },
  forgotText: {
    fontFamily: loginFonts.body,
    fontSize: 12,
    color: loginTheme.link,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
