import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { loginSpacing, loginTheme } from '@/features/auth/constants/loginTheme';

interface LoginScreenLayoutProps {
  children: ReactNode;
  contentStyle?: ViewStyle;
}

function CastleSilhouette() {
  return (
    <Svg width="100%" height={72} viewBox="0 0 360 72" preserveAspectRatio="xMidYMax meet">
      <Path
        d="M0 72 L0 48 L16 48 L16 36 L26 36 L26 44 L34 44 L34 28 L42 28 L42 38 L50 38 L50 22 L58 22 L58 32 L66 32 L66 18 L74 18 L74 28 L82 28 L82 14 L90 14 L90 24 L98 24 L98 10 L106 10 L106 20 L114 20 L114 8 L122 8 L122 16 L130 16 L130 6 L138 6 L138 14 L146 14 L146 4 L154 4 L154 12 L162 12 L162 0 L170 0 L170 10 L178 10 L178 2 L186 2 L186 12 L194 12 L194 4 L202 4 L202 14 L210 14 L210 6 L218 6 L218 16 L226 16 L226 8 L234 8 L234 18 L242 18 L242 10 L250 10 L250 20 L258 20 L258 12 L266 12 L266 22 L274 22 L274 14 L282 14 L282 24 L290 24 L290 16 L298 16 L298 26 L306 26 L306 18 L314 18 L314 28 L322 28 L322 20 L330 20 L330 30 L338 30 L338 22 L346 22 L346 32 L360 32 L360 72 Z"
        fill="rgba(99, 102, 241, 0.14)"
      />
    </Svg>
  );
}

export function LoginScreenLayout({ children, contentStyle }: LoginScreenLayoutProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[
          loginTheme.background.top,
          loginTheme.background.mid,
          loginTheme.background.bottom,
        ]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(77, 136, 255, 0.22)', 'rgba(99, 102, 241, 0.08)', 'transparent']}
        style={styles.spotlight}
        pointerEvents="none"
      />

      <View style={styles.castleWrap} pointerEvents="none">
        <CastleSilhouette />
      </View>

      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: loginTheme.background.base,
  },
  flex: {
    flex: 1,
  },
  spotlight: {
    position: 'absolute',
    top: 0,
    left: '8%',
    right: '8%',
    height: 320,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  castleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
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
    paddingTop: 48,
    paddingBottom: 88,
  },
  inner: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: loginSpacing.horizontal,
  },
});
