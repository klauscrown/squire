import { Stack } from 'expo-router';

import { grimoire } from '@/theme/grimoire';

export default function SessionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: grimoire.colors.background },
        headerTintColor: grimoire.colors.gold,
        headerTitleStyle: {
          color: grimoire.colors.ivory,
          fontWeight: '600',
        },
        contentStyle: { backgroundColor: grimoire.colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[sessionId]"
        options={{
          headerTitle: '',
          headerBackTitle: 'Sessões',
        }}
      />
    </Stack>
  );
}
