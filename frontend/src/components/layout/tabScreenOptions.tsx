import type { BottomTabNavigationOptions } from 'expo-router/build/react-navigation/bottom-tabs';

export function getTabScreenOptions(title: string): BottomTabNavigationOptions {
  return {
    title,
    tabBarLabel: title,
    headerShown: false,
  };
}
