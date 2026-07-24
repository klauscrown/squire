import { type ReactNode } from 'react';
import { Platform, ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useTheme } from '@/hooks/useTheme';
import { CONTENT_MAX_WIDTH } from '@/theme/breakpoints';
import { grimoire } from '@/theme/grimoire';
import { cn } from '@/utils/cn';

interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
  wide?: boolean;
  className?: string;
  contentClassName?: string;
  /** Fundo do container. Use 'transparent' para overlays/atmosferas. */
  backgroundColor?: string;
}

export function ScreenWrapper({
  children,
  scrollable = false,
  wide = false,
  className,
  contentClassName,
  backgroundColor = grimoire.colors.background,
}: ScreenWrapperProps) {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const isWeb = Platform.OS === 'web';
  const constrainWidth = isWeb && breakpoint !== 'mobile';

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
  };

  const contentMaxWidth = wide ? CONTENT_MAX_WIDTH.wide : CONTENT_MAX_WIDTH.default;

  const innerContent = (
    <View
      style={
        constrainWidth
          ? {
              width: '100%',
              maxWidth: contentMaxWidth,
              alignSelf: 'center',
              flex: 1,
            }
          : { flex: 1 }
      }
    >
      {scrollable ? (
        <ScrollView
          className={cn('flex-1', contentClassName)}
          contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn('flex-1', contentClassName)} style={{ padding: theme.spacing.md }}>
          {children}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className={cn('flex-1', className)} style={containerStyle}>
      {innerContent}
    </SafeAreaView>
  );
}
