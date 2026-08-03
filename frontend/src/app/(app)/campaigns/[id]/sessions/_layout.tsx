import { Stack } from 'expo-router';

import { useGrimoire } from '@/hooks/useTheme';

export default function SessionsLayout() {
  const grimoire = useGrimoire();

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
