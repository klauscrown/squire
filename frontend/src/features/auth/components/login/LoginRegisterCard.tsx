import { ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ROUTES } from '@/constants';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from '../AuthText';

export function LoginRegisterCard() {
  const palette = useActivePalette();

  return (
    <SurfaceCard variant="elevated" radius="md" padding="lg" style={styles.card} shadow>
      <View style={styles.wrap}>
        <AuthText style={[styles.title, { color: palette.textPrimary }]}>
          Seu mundo ainda não existe?
        </AuthText>
        <AuthText style={[styles.subtitle, { color: palette.textSecondary }]}>
          Crie sua conta e comece sua primeira aventura.
        </AuthText>

        <Link href={ROUTES.auth.register} asChild>
          <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <View style={styles.ctaRow}>
              <AuthText style={[styles.ctaText, { color: palette.accent }]}>Criar conta</AuthText>
              <ChevronRight size={14} color={palette.accent} strokeWidth={2.2} />
            </View>
          </Pressable>
        </Link>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: loginLayout.register.marginTop,
    width: '100%',
  },
  wrap: {
    alignItems: 'center',
    gap: loginLayout.register.gap,
  },
  title: {
    ...loginTypography.registerTitle,
  },
  subtitle: {
    ...loginTypography.registerSubtitle,
    maxWidth: loginLayout.register.maxSubtitleWidth,
  },
  cta: {
    marginTop: 4,
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
    ...loginTypography.linkEmphasized,
  },
});
