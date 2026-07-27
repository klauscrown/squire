import { StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

function Diamond() {
  return <View style={styles.diamond} />;
}

export function LoginBrandHeader() {
  return (
    <View style={styles.wrap}>
      <View style={styles.heroSpacer} />

      <AuthText style={styles.logo}>SQUIRE</AuthText>

      <View style={styles.taglineRow}>
        <View style={styles.taglineLine} />
        <Diamond />
        <AuthText style={styles.tagline}>O ESCUDEIRO DO MESTRE.</AuthText>
        <Diamond />
        <View style={styles.taglineLine} />
      </View>

      <AuthText style={styles.welcome}>Bem-vindo de volta, Mestre.</AuthText>
      <AuthText style={styles.subwelcome}>Prepare-se para escrever novas histórias.</AuthText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: loginLayout.header.sectionBottom,
  },
  heroSpacer: {
    height: loginLayout.header.topSpacer,
  },
  logo: {
    fontFamily: loginFonts.display,
    fontSize: loginLayout.header.logoSize,
    letterSpacing: loginLayout.header.logoTracking,
    color: loginTheme.brand.title,
    textShadowColor: loginTheme.brand.glow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    marginBottom: loginLayout.header.logoToTagline,
  },
  taglineRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: loginLayout.header.taglineToWelcome,
  },
  taglineLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(201, 169, 98, 0.18)',
  },
  diamond: {
    width: 5,
    height: 5,
    backgroundColor: loginTheme.gold,
    transform: [{ rotate: '45deg' }],
  },
  tagline: {
    fontFamily: loginFonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: loginTheme.brand.tagline,
  },
  welcome: {
    fontFamily: loginFonts.bodySemibold,
    fontSize: 18,
    lineHeight: 24,
    color: loginTheme.text.title,
    textAlign: 'center',
    marginBottom: loginLayout.header.welcomeToSub,
  },
  subwelcome: {
    fontFamily: loginFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: loginTheme.text.subtitle,
    textAlign: 'center',
  },
});
