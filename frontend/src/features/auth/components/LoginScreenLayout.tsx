import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { GrimoireAtmosphereShell } from '@/components/grimoire/GrimoireAtmosphere';
import { loginLayout } from '@/features/auth/constants/loginLayout';
import { useComponents } from '@/hooks/useTheme';

interface LoginScreenLayoutProps {
  children: ReactNode;
  contentStyle?: ViewStyle;
}

/**
 * Shell da auth = mesma atmosfera da Home (`AtmosphericBackground` + tokens).
 */
export function LoginScreenLayout({ children, contentStyle }: LoginScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const spacing = useComponents().spacing;

  return (
    <GrimoireAtmosphereShell>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : insets.top}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: Math.max(loginLayout.screen.paddingTop, spacing.stack),
                paddingBottom: Math.max(loginLayout.screen.paddingBottom, spacing.section),
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.inner, contentStyle]} collapsable={false}>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GrimoireAtmosphereShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: loginLayout.screen.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: loginLayout.screen.horizontal,
  },
});
