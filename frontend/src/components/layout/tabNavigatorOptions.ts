import type { BottomTabNavigationOptions } from 'expo-router/build/react-navigation/bottom-tabs';

import { CURVED_TAB_BAR_FOOTPRINT } from '@/components/layout/AppTabBar';

export function getTabNavigatorScreenOptions(
  bottomInset = 0,
  options?: { hideTabBar?: boolean },
): BottomTabNavigationOptions {
  if (options?.hideTabBar) {
    return {
      headerShown: false,
      sceneStyle: { backgroundColor: 'transparent', flex: 1 },
      tabBarHideOnKeyboard: true,
      tabBarBackground: () => null,
      tabBarShowLabel: false,
      tabBarItemStyle: { display: 'none' },
      tabBarStyle: {
        display: 'none',
        height: 0,
        minHeight: 0,
        maxHeight: 0,
        opacity: 0,
        position: 'absolute',
        top: -9999,
        left: 0,
        right: 0,
        borderTopWidth: 0,
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      },
    };
  }

  return {
    headerShown: false,
    sceneStyle: { backgroundColor: 'transparent', flex: 1 },
    tabBarHideOnKeyboard: true,
    tabBarBackground: () => null,
    tabBarStyle: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
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
