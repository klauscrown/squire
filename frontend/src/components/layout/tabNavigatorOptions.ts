import type { BottomTabNavigationOptions } from 'expo-router/build/react-navigation/bottom-tabs';

import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';

export function getTabNavigatorScreenOptions(
  bottomInset = 0,
): BottomTabNavigationOptions {
  return {
    headerShown: false,
    sceneStyle: { backgroundColor: 'transparent' },
    tabBarHideOnKeyboard: true,
    tabBarBackground: () => null,
    tabBarStyle: {
      position: 'absolute',
      height: CURVED_TAB_BAR_FOOTPRINT + bottomInset,
      backgroundColor: 'transparent',
      borderTopWidth: 0,
      borderTopColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: 'transparent',
    },
  };
}
