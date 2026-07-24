import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface CardProps extends ViewProps {
  elevated?: boolean;
  className?: string;
}

export function Card({ elevated = false, className, style, children, ...props }: CardProps) {
  const theme = useTheme();

  return (
    <View
      className={cn('rounded-lg p-4', className)}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.xl,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        elevated ? theme.elevation.md : theme.elevation.sm,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
