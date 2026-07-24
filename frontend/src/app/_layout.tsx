import '../../global.css';

import { Stack, ThemeProvider } from 'expo-router';

import { AppProviders } from '@/components/providers/AppProviders';
import { ThemedStatusBar } from '@/components/providers/ThemedStatusBar';
import { squireNavigationTheme } from '@/theme/navigationTheme';

export default function RootLayout() {
  return (
    <AppProviders>
      <ThemeProvider value={squireNavigationTheme}>
        <ThemedStatusBar>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1, backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </ThemedStatusBar>
      </ThemeProvider>
    </AppProviders>
  );
}
