import { Trash2 } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

import { Text } from '@/components/ui';
import { CAMPAIGN_SPACING } from '@/features/campaign/constants/spacing';
import { useTheme } from '@/hooks/useTheme';

import { AnimatedPressable } from './AnimatedPressable';

interface CampaignDeleteButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export function CampaignDeleteButton({ onPress, loading }: CampaignDeleteButtonProps) {
  const theme = useTheme();

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={loading}
      style={{
        marginTop: CAMPAIGN_SPACING['2xl'],
        marginBottom: CAMPAIGN_SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: CAMPAIGN_SPACING.sm,
        paddingVertical: CAMPAIGN_SPACING.md,
        paddingHorizontal: CAMPAIGN_SPACING.lg,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.error,
        backgroundColor: 'transparent',
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.error} />
      ) : (
        <Trash2 size={18} color={theme.colors.error} strokeWidth={2} />
      )}
      <Text
        variant="label"
        style={{
          color: theme.colors.error,
          fontWeight: theme.typography.fontWeight.semibold,
        }}
      >
        Excluir campanha
      </Text>
    </AnimatedPressable>
  );
}
