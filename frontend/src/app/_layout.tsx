import '../../global.css';

import { LinearGradient } from 'expo-linear-gradient';
import { Stack, ThemeProvider } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppProviders } from '@/components/providers/AppProviders';
import { ThemedStatusBar } from '@/components/providers/ThemedStatusBar';
import { squireNavigationTheme } from '@/theme/navigationTheme';

export default function RootLayout() {
  return (
    <AppProviders>
      <ThemeProvider value={squireNavigationTheme}>
        <ThemedStatusBar>
          <LinearGradient colors={['#131A2E', '#0B1120']} style={styles.root}>
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
          </LinearGradient>
        </ThemedStatusBar>
      </ThemeProvider>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
