import { ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ROUTES } from '@/constants';
import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

export function LoginRegisterCard() {
  return (
    <View style={styles.wrap}>
      <AuthText style={styles.title}>Seu mundo ainda não existe?</AuthText>
      <AuthText style={styles.subtitle}>
        Crie sua conta e comece sua primeira aventura.
      </AuthText>

      <Link href={ROUTES.auth.register} asChild>
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
          <View style={styles.ctaRow}>
            <AuthText style={styles.ctaText}>Criar conta</AuthText>
            <ChevronRight size={14} color={loginTheme.link} strokeWidth={2.2} />
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: loginLayout.register.gap,
    marginTop: loginLayout.register.marginTop,
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: loginFonts.bodySemibold,
    fontSize: loginLayout.register.titleSize,
    lineHeight: 18,
    color: loginTheme.text.title,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: loginFonts.body,
    fontSize: loginLayout.register.subtitleSize,
    lineHeight: 17,
    color: loginTheme.text.subtitle,
    textAlign: 'center',
    maxWidth: loginLayout.register.maxSubtitleWidth,
  },
  cta: {
    marginTop: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  ctaPressed: {
    opacity: 0.75,
  },
  ctaText: {
    fontFamily: loginFonts.bodyMedium,
    fontSize: loginLayout.register.ctaSize,
    lineHeight: 18,
    color: loginTheme.link,
  },
});
