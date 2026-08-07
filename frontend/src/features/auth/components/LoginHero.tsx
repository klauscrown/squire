import { StyleSheet, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from './AuthText';

interface LoginHeroProps {
  compact?: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function LoginHero({
  compact = false,
  eyebrow = 'Squire',
  title = 'Seu mundo aguarda.',
  subtitle = 'O Escudeiro preparou os pergaminhos. O destino do reino está em suas mãos.',
}: LoginHeroProps) {
  const palette = useActivePalette();
  const surface = useComponents().surfaceCard;
  const elevated = surface.variants.elevated;

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View
        style={[
          styles.logoFrame,
          {
            borderColor: elevated.border,
            backgroundColor: elevated.background,
            borderWidth: surface.borderWidth,
          },
        ]}
      >
        <AppLogo size="lg" style={styles.logo} imageStyle={styles.logoImage} />
      </View>

      <AuthText style={[styles.eyebrow, { color: palette.accent }]}>{eyebrow}</AuthText>
      <AuthText style={[styles.title, { color: palette.textPrimary }]}>{title}</AuthText>
      <AuthText
        style={[styles.subtitle, compact && styles.subtitleCompact, { color: palette.textSecondary }]}
      >
        {subtitle}
      </AuthText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  wrapCompact: {
    marginBottom: 0,
  },
  logoFrame: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  logo: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  logoImage: {
    borderRadius: 18,
  },
  eyebrow: {
    ...loginTypography.brandTagline,
    marginBottom: 12,
  },
  title: {
    ...loginTypography.heading,
    marginBottom: 12,
  },
  subtitle: {
    ...loginTypography.welcomeSupport,
    maxWidth: 320,
  },
  subtitleCompact: {
    marginTop: 6,
  },
});
