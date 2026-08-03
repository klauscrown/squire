import * as Haptics from 'expo-haptics';
import { Bell } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/components/providers/AuthProvider';
import { useActivePalette } from '@/store/useThemeStore';
import { useComponents } from '@/hooks/useTheme';
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
  const { displayName, email } = useAuth();
  const palette = useActivePalette();
  const components = useComponents();
  const masterName = resolveMasterName(displayName, email);

  return (
    <View style={[styles.root, { gap: components.spacing.stack }]}>
      <View style={styles.copy}>
        <Text style={[styles.greeting, { color: palette.textPrimary }]} numberOfLines={2}>
          Bem-vindo de volta,{' '}
          <Text style={{ color: palette.primaryLight }}>{masterName}</Text>
          ! ✨
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      <Pressable
        onPress={() => Platform.OS !== 'web' && Haptics.selectionAsync()}
        style={({ pressed }) => [
          styles.bell,
          {
            borderColor: palette.surfaceBorder,
            backgroundColor: palette.surface,
          },
          pressed && {
            opacity: 0.75,
            backgroundColor: palette.accentSoft,
            borderColor: palette.accent,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        hitSlop={8}
      >
        <Bell size={20} color={palette.textSecondary} strokeWidth={1.6} />
        <View
          style={[
            styles.bellDot,
            {
              backgroundColor: palette.primary,
              borderColor: palette.gradientEnd,
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  greeting: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
