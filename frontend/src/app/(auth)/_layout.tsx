import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/constants';
import { useAppStore } from '@/store/appStore';

export default function AuthLayout() {
  const { isLoading, session } = useAuth();
  const isExplorerMode = useAppStore((state) => state.isExplorerMode);

  if (!isLoading && (session || isExplorerMode)) {
    return <Redirect href={ROUTES.app.home} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
