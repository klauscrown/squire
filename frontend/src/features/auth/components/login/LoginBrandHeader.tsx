import { StyleSheet, View } from 'react-native';

import { loginLayout } from '@/features/auth/constants/loginLayout';
import { loginTypography } from '@/features/auth/constants/loginTypography';
import { useActivePalette } from '@/store/useThemeStore';

import { AuthText } from '../AuthText';

function Diamond({ color }: { color: string }) {
  return <View style={[styles.diamond, { backgroundColor: color }]} />;
}

export function LoginBrandHeader() {
  const palette = useActivePalette();

  return (
    <View style={styles.wrap}>
      <View style={styles.heroSpacer} />

      <AuthText
        style={[
          styles.logo,
          {
            color: palette.textPrimary,
            textShadowColor: palette.buttonPrimaryShadow,
          },
        ]}
      >
        SQUIRE
      </AuthText>

      <View style={styles.taglineRow}>
        <View style={[styles.taglineLine, { backgroundColor: `${palette.accent}2E` }]} />
        <Diamond color={palette.accent} />
        <AuthText style={[styles.tagline, { color: palette.accent }]}>
          O ESCUDEIRO DO MESTRE.
        </AuthText>
        <Diamond color={palette.accent} />
        <View style={[styles.taglineLine, { backgroundColor: `${palette.accent}2E` }]} />
      </View>

      <AuthText style={[styles.subwelcome, { color: palette.textSecondary }]}>
        Prepare-se para escrever novas histórias.
      </AuthText>
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
    ...loginTypography.brand,
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
  },
  diamond: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
  },
  tagline: {
    ...loginTypography.brandTagline,
  },
  subwelcome: {
    ...loginTypography.welcomeSupport,
  },
});
