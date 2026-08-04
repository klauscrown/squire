import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { type ReactNode, useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemeProvider } from './ThemeProvider';
import { SplashController } from './SplashController';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.suppressGlobalError === true) return;

            Toast.show({
              type: 'error',
              text1: 'Não foi possível concluir a ação',
              text2: error instanceof Error ? error.message : 'Tente novamente.',
            });
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 2,
          },
        },
      }),
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <SplashController>{children}</SplashController>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08061A',
  },
});
