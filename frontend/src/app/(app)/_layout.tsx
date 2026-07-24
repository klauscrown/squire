import { Tabs, useSegments } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabBar } from '@/components/layout/AppTabBar';
import { getTabNavigatorScreenOptions } from '@/components/layout/tabNavigatorOptions';
import { getTabScreenOptions } from '@/components/layout/tabScreenOptions';

export default function AppLayout() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const hideTabBar = (segments as string[]).includes('create');

  return (
    <View style={styles.root}>
      <Tabs
        tabBar={(props) => (hideTabBar ? null : <AppTabBar {...props} />)}
        screenOptions={getTabNavigatorScreenOptions(bottomInset)}
      >
        <Tabs.Screen name="home" options={getTabScreenOptions('Início')} />
        <Tabs.Screen name="campaigns" options={getTabScreenOptions('Campanhas')} />
        <Tabs.Screen name="profile" options={getTabScreenOptions('Perfil')} />
        <Tabs.Screen name="settings" options={getTabScreenOptions('Biblioteca')} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
