import { type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandGradient } from '@/components/ui/BrandGradient';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';

interface AuthScreenLayoutProps {
  children: ReactNode;
  cardStyle?: ViewStyle;
  useCard?: boolean;
}

export function AuthScreenLayout({
  children,
  cardStyle,
  useCard = true,
}: AuthScreenLayoutProps) {
  const theme = useTheme();

  const content = useCard ? (
    <Card elevated style={[{ width: '100%', maxWidth: 420, padding: theme.spacing.xl }, cardStyle]}>
      {children}
    </Card>
  ) : (
    children
  );

  return (
    <BrandGradient>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.md,
          }}
        >
          {content}
        </View>
      </SafeAreaView>
    </BrandGradient>
  );
}
