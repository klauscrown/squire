import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ROUTES } from '@/constants';
import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';
import { PortalIcon } from './LoginBrandIcons';

export function LoginRegisterCard() {
  return (
    <View style={styles.card}>
      <View style={styles.portalWrap}>
        <LinearGradient
          colors={['rgba(77, 136, 255, 0.35)', 'rgba(99, 102, 241, 0.15)']}
          style={styles.portalGlow}
        >
          <PortalIcon size={28} />
        </LinearGradient>
      </View>

      <View style={styles.body}>
        <View style={styles.copy}>
          <AuthText style={styles.title} numberOfLines={2}>
            Seu mundo ainda não existe?
          </AuthText>
          <AuthText style={styles.subtitle} numberOfLines={2}>
            Crie sua conta e comece sua primeira aventura.
          </AuthText>
        </View>

        <Link href={ROUTES.auth.register} asChild>
          <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <AuthText style={styles.ctaText}>Criar conta</AuthText>
            <ChevronRight size={14} color={loginTheme.link} strokeWidth={2.2} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 6,
    borderRadius: loginTheme.card.radius,
    borderWidth: 1,
    borderColor: loginTheme.card.border,
    backgroundColor: loginTheme.card.background,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  portalWrap: {
    flexShrink: 0,
  },
  portalGlow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  copy: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontFamily: loginFonts.bodySemibold,
    fontSize: 12,
    lineHeight: 16,
    color: loginTheme.text.title,
  },
  subtitle: {
    fontFamily: loginFonts.body,
    fontSize: 10,
    lineHeight: 14,
    color: loginTheme.text.subtitle,
  },
  cta: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    paddingLeft: 4,
  },
  ctaPressed: {
    opacity: 0.75,
  },
  ctaText: {
    fontFamily: loginFonts.bodyMedium,
    fontSize: 12,
    color: loginTheme.link,
  },
});
