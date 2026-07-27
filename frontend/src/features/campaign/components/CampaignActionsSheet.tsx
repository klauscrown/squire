import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { Archive, Copy, PencilSimple, Play, Trash } from 'phosphor-react-native';
import { useCallback, useMemo, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { fontFamily } from '@/theme/typography';

import type { Campaign } from '../types';

interface CampaignActionsSheetProps {
  campaign: Campaign | null;
  onDismiss: () => void;
  onContinue: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onArchive: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

interface ActionItem {
  key: string;
  label: string;
  icon: typeof Play;
  color?: string;
  destructive?: boolean;
  onPress: () => void;
}

export function CampaignActionsSheet({
  campaign,
  onDismiss,
  onContinue,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}: CampaignActionsSheetProps) {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['38%'], []);

  const handleAction = useCallback((action: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    bottomSheetRef.current?.close();
    setTimeout(action, 200);
  }, []);

  const actions: ActionItem[] = useMemo(() => {
    if (!campaign) return [];
    return [
      {
        key: 'continue',
        label: 'Continuar campanha',
        icon: Play,
        onPress: () => handleAction(() => onContinue(campaign)),
      },
      {
        key: 'edit',
        label: 'Editar',
        icon: PencilSimple,
        onPress: () => handleAction(() => onEdit(campaign)),
      },
      {
        key: 'duplicate',
        label: 'Duplicar',
        icon: Copy,
        onPress: () => handleAction(() => onDuplicate(campaign)),
      },
      {
        key: 'archive',
        label: 'Arquivar',
        icon: Archive,
        onPress: () => handleAction(() => onArchive(campaign)),
      },
      {
        key: 'delete',
        label: 'Excluir',
        icon: Trash,
        color: theme.colors.error,
        destructive: true,
        onPress: () => handleAction(() => onDelete(campaign)),
      },
    ];
  }, [campaign, handleAction, onContinue, onEdit, onDuplicate, onArchive, onDelete, theme]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  if (!campaign) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onClose={onDismiss}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.border,
        width: 36,
      }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fontFamily.cinzel.semibold,
            fontSize: 16,
            color: theme.colors.foreground,
            marginBottom: 16,
            letterSpacing: 0.3,
          }}
        >
          {campaign.title}
        </Text>

        <View style={{ gap: 4 }}>
          {actions.map((action) => (
            <Pressable
              key={action.key}
              onPress={action.onPress}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingVertical: 13,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: pressed ? `${theme.colors.hover}80` : 'transparent',
              })}
            >
              <action.icon
                size={20}
                color={action.color ?? theme.colors.foreground}
                weight="regular"
              />
              <Text
                style={{
                  fontFamily: fontFamily.manrope.medium,
                  fontSize: 15,
                  color: action.color ?? theme.colors.foreground,
                }}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
