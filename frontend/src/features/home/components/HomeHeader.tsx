import * as Haptics from 'expo-haptics';
import { Bell } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { grimoireImages } from '@/assets/grimoire';
import { useAuth } from '@/components/providers/AuthProvider';
import { GrimoireImage } from '@/components/grimoire/GrimoireImage';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

interface HomeHeaderProps {
  subtitle: string;
}

function resolveMasterName(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const fromProfile = displayName?.trim();
  if (fromProfile) return fromProfile;
  if (email?.includes('@')) return email.split('@')[0] ?? 'Mestre';
  return 'Mestre';
}

export function HomeHeader({ subtitle }: HomeHeaderProps) {
  const { firebaseUser, email } = useAuth();
  const masterName = resolveMasterName(firebaseUser?.displayName, email ?? firebaseUser?.email);

  return (
    <View style={styles.root}>
      <View style={styles.mascotWrap}>
        <GrimoireImage source={grimoireImages.mascot} style={styles.mascot} contentFit="cover" />
      </View>

      <View style={styles.copy}>
        <Text style={styles.greeting} numberOfLines={2}>
          Bem-vindo de volta, {masterName}! ✨
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      <Pressable
        onPress={() => Platform.OS !== 'web' && Haptics.selectionAsync()}
        style={({ pressed }) => [styles.bell, pressed && styles.bellPressed]}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        hitSlop={8}
      >
        <Bell size={20} color={premium.text.secondary} strokeWidth={1.6} />
        <View style={styles.bellDot} />
      </Pressable>
    </View>
  );
}

const MASCOT = 56;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: premium.spacing.stack,
  },
  mascotWrap: {
    width: MASCOT,
    height: MASCOT,
    borderRadius: premium.radius.sm,
    overflow: 'hidden',
  },
  mascot: {
    width: MASCOT,
    height: MASCOT,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.surface.cardBorder,
    backgroundColor: premium.surface.icon,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
    gap: 4,
  },
  greeting: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.3,
    color: premium.text.primary,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 20,
    color: premium.text.secondary,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: premium.surface.cardBorder,
    backgroundColor: premium.surface.card,
  },
  bellPressed: {
    opacity: 0.75,
    backgroundColor: premium.surface.icon,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: premium.accent,
    borderWidth: 1.5,
    borderColor: premium.glass.fillStrong,
  },
});
