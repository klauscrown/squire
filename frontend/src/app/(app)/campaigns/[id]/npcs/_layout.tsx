import { Stack } from 'expo-router';

import { useGrimoire } from '@/hooks/useTheme';

export default function NpcsLayout() {
  const grimoire = useGrimoire();

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
        name="[npcId]"
        options={{
          headerTitle: '',
          headerBackTitle: 'NPCs',
        }}
      />
    </Stack>
  );
}
