import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GrimoireAtmosphereShell } from '@/components/grimoire/GrimoireAtmosphere';
import { AppTabBar } from '@/components/layout/AppTabBar';
import { getTabNavigatorScreenOptions } from '@/components/layout/tabNavigatorOptions';
import { getTabScreenOptions } from '@/components/layout/tabScreenOptions';
import { WebSidebar } from '@/components/layout/WebSidebar';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function WebAppLayout() {
  const breakpoint = useBreakpoint();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const showSidebar = breakpoint === 'desktop';

  return (
    <GrimoireAtmosphereShell>
      <View style={styles.root}>
        {showSidebar ? <WebSidebar /> : null}

        <View style={styles.main}>
          <Tabs
            tabBar={showSidebar ? () => null : (props) => <AppTabBar {...props} />}
            screenOptions={getTabNavigatorScreenOptions(bottomInset)}
          >
            <Tabs.Screen name="home" options={getTabScreenOptions('Início')} />
            <Tabs.Screen name="campaigns" options={getTabScreenOptions('Campanhas')} />
            <Tabs.Screen name="profile" options={getTabScreenOptions('Perfil')} />
            <Tabs.Screen name="settings" options={getTabScreenOptions('Biblioteca')} />
          </Tabs>
        </View>
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
