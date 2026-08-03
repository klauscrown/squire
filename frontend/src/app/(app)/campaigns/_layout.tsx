import { Stack } from 'expo-router';

import { useGrimoire } from '@/hooks/useTheme';

export default function CampaignsLayout() {
  const grimoire = useGrimoire();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: grimoire.colors.background },
        headerTintColor: grimoire.colors.gold,
        headerTitleStyle: {
          color: grimoire.colors.gold,
          fontWeight: '600',
        },
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
