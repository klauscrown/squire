import { Redirect, Tabs, useSegments } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GrimoireAtmosphereShell } from '@/components/grimoire/GrimoireAtmosphere';
import { AppTabBar } from '@/components/layout/AppTabBar';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/constants';
import { UniverseCreationHost } from '@/features/universe/components/UniverseCreationHost';
import { getTabNavigatorScreenOptions } from '@/components/layout/tabNavigatorOptions';
import { getTabScreenOptions } from '@/components/layout/tabScreenOptions';
import { WebSidebar } from '@/components/layout/WebSidebar';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAppStore } from '@/store/appStore';

export default function WebAppLayout() {
  const { isLoading, session } = useAuth();
  const isExplorerMode = useAppStore((state) => state.isExplorerMode);
  const breakpoint = useBreakpoint();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const showSidebar = breakpoint === 'desktop';
  const segments = useSegments();
  const hideTabBar = (segments as string[]).includes('create');

  if (!isLoading && !session && !isExplorerMode) {
    return <Redirect href={ROUTES.auth.login} />;
  }

  return (
    <GrimoireAtmosphereShell>
      <View style={styles.root}>
        {showSidebar ? <WebSidebar /> : null}

        <View style={styles.main}>
          <Tabs
            tabBar={showSidebar || hideTabBar ? () => null : (props) => <AppTabBar {...props} />}
            screenOptions={getTabNavigatorScreenOptions(bottomInset, { hideTabBar })}
          >
            <Tabs.Screen name="home" options={getTabScreenOptions('Início')} />
            <Tabs.Screen name="campaigns" options={getTabScreenOptions('Campanhas')} />
            <Tabs.Screen name="universe" options={getTabScreenOptions('Universo')} />
            <Tabs.Screen name="profile" options={getTabScreenOptions('Perfil')} />
            <Tabs.Screen
              name="settings"
              options={{ ...getTabScreenOptions('Ajustes'), href: null }}
            />
          </Tabs>
        </View>
        <UniverseCreationHost />
      </View>
    </GrimoireAtmosphereShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  main: {
    flex: 1,
  },
});
