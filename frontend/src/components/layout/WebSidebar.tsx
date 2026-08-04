import { Link, usePathname } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppLogo, Text } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

const NAV_ITEMS = [
  { label: 'Início', href: ROUTES.app.home },
  { label: 'Campanhas', href: ROUTES.app.campaigns },
  { label: 'Perfil', href: ROUTES.app.profile },
  { label: 'Ajustes', href: ROUTES.app.settings },
] as const;

function isActiveRoute(pathname: string, href: string): boolean {
  const route = href.replace('/(app)', '');

  if (route === '/home') {
    return pathname === '/home' || pathname === '/';
  }

  if (route === '/campaigns') {
    return pathname === '/campaigns' || pathname.startsWith('/campaigns/');
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

export function WebSidebar() {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <View
      style={{
        width: 260,
        borderRightWidth: 1,
        borderRightColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl,
          paddingHorizontal: theme.spacing.sm,
        }}
      >
        <AppLogo size="sm" />
        <Text variant="h3" style={{ color: theme.colors.accent }}>
          Squire
        </Text>
      </View>

      {NAV_ITEMS.map((item) => {
        const active = isActiveRoute(pathname, item.href);

        return (
          <Link key={item.href} href={item.href} asChild>
            <Pressable
              style={({ pressed }) => ({
                paddingVertical: theme.spacing.sm + 2,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.radius.lg,
                marginBottom: theme.spacing.xs,
                backgroundColor: active ? `${theme.colors.accent}18` : 'transparent',
                borderWidth: active ? 1 : 0,
                borderColor: active ? `${theme.colors.accent}40` : 'transparent',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                variant="body"
                style={{
                  fontWeight: active
                    ? theme.typography.fontWeight.semibold
                    : theme.typography.fontWeight.regular,
                  color: active ? theme.colors.accent : theme.colors.foreground,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}
