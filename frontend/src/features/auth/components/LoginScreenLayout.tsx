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

import { loginLayout } from '@/features/auth/constants/loginLayout';

import { LoginAtmosphere } from './login/LoginAtmosphere';

interface LoginScreenLayoutProps {
  children: ReactNode;
  contentStyle?: ViewStyle;
}

export function LoginScreenLayout({ children, contentStyle }: LoginScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <LoginAtmosphere>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : insets.top}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
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
    </LoginAtmosphere>
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
    paddingTop: loginLayout.screen.paddingTop,
    paddingBottom: loginLayout.screen.paddingBottom,
  },
  inner: {
    width: '100%',
    maxWidth: loginLayout.screen.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: loginLayout.screen.horizontal,
  },
});
