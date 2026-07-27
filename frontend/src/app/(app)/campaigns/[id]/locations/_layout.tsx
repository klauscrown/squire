import { Stack } from 'expo-router';

import { grimoire } from '@/theme/grimoire';

export default function LocationsLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: grimoire.colors.background },
        headerStyle: { backgroundColor: grimoire.colors.background },
        headerTintColor: grimoire.colors.gold,
        headerTitleStyle: {
          color: grimoire.colors.gold,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[locationId]"
        options={{
          headerTitle: '',
          headerBackTitle: 'Locais',
        }}
      />
    </Stack>
  );
}
