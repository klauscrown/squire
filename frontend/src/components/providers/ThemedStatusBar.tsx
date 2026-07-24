import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';

import { useColorScheme } from '@/hooks/useTheme';

interface ThemedStatusBarProps {
  children: ReactNode;
}

export function ThemedStatusBar({ children }: ThemedStatusBarProps) {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </>
  );
}
