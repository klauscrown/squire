import { Stack } from 'expo-router';

import { grimoire } from '@/theme/grimoire';

export default function NotesLayout() {
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
        name="[noteId]"
        options={{
          headerTitle: '',
          headerBackTitle: 'Anotações',
        }}
      />
    </Stack>
  );
}
