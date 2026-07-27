import { Stack } from 'expo-router';

export default function CampaignDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="notes" options={{ headerShown: false }} />
      <Stack.Screen name="sessions" options={{ headerShown: false }} />
      <Stack.Screen name="npcs" options={{ headerShown: false }} />
      <Stack.Screen name="locations" options={{ headerShown: false }} />
    </Stack>
  );
}
