import { StyleSheet, View } from 'react-native';

import { AppLogo } from '@/components/ui/AppLogo';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

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
  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.logoFrame}>
        <AppLogo size="lg" style={styles.logo} imageStyle={styles.logoImage} />
      </View>

      <AuthText style={styles.eyebrow}>{eyebrow}</AuthText>
      <AuthText style={styles.title}>{title}</AuthText>
      <AuthText style={[styles.subtitle, compact && styles.subtitleCompact]}>
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
    borderWidth: 1,
    borderColor: grimoire.colors.glassGoldBorder,
    backgroundColor: 'rgba(0,0,0,0.4)',
    shadowColor: grimoire.colors.gold,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  logoImage: {
    borderRadius: 18,
  },
  eyebrow: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: grimoire.colors.goldMuted,
    marginBottom: 12,
  },
  title: {
    fontFamily: fontFamily.cormorant.medium,
    fontSize: 42,
    lineHeight: 44,
    color: grimoire.colors.ivory,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    color: `${grimoire.colors.ivory}99`,
    textAlign: 'center',
    maxWidth: 320,
  },
  subtitleCompact: {
    marginTop: 6,
  },
});
