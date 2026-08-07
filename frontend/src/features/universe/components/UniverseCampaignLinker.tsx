import { Check, Link2, Plus, Unlink } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/ui';
import { useGetCampaigns } from '@/features/campaign/hooks';
import { STATUS_LABELS } from '@/features/campaign/types';
import { useComponents, useOpacity } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

import {
  useGetCampaignUniverseLinks,
  useLinkCampaignToUniverse,
  useUnlinkCampaignFromUniverse,
} from '../hooks';

interface UniverseCampaignLinkerProps {
  universeId: string;
  universeName: string;
  onCreateCampaign: () => void;
}

export function UniverseCampaignLinker({
  universeId,
  universeName,
  onCreateCampaign,
}: UniverseCampaignLinkerProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const opacity = useOpacity();
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useGetCampaigns();
  const { data: links = [], isLoading: isLoadingLinks } = useGetCampaignUniverseLinks(universeId);
  const { mutate: linkCampaign, isPending: isLinking } = useLinkCampaignToUniverse(universeId);
  const { mutate: unlinkCampaign, isPending: isUnlinking } =
    useUnlinkCampaignFromUniverse(universeId);
  const linkedIds = new Set(links.map((link) => link.campaignId));
  const isBusy = isLinking || isUnlinking;

  if (isLoadingCampaigns || isLoadingLinks) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.helper, { color: palette.textSecondary }]}>
        Campanhas apenas referenciam {universeName}; o conteúdo continua guardado em um único lugar.
      </Text>

      {campaigns.length ? (
        <View style={[styles.list, { gap: components.spacing.grid }]}>
          {campaigns.map((campaign) => {
            const linked = linkedIds.has(campaign.id);
            return (
              <SurfaceCard
                key={campaign.id}
                variant="interactive"
                radius="sm"
                padding="sm"
                shadow={false}
                onPress={() => (linked ? unlinkCampaign(campaign.id) : linkCampaign(campaign.id))}
                disabled={isBusy}
                accessibilityLabel={`${linked ? 'Desvincular' : 'Vincular'} campanha ${campaign.title}`}
                accessibilityState={{ selected: linked, disabled: isBusy }}
                contentStyle={styles.cardContent}
              >
                <View
                  style={[
                    styles.icon,
                    {
                      borderColor: linked
                        ? opacity.iconCircle.lilacBorder
                        : opacity.iconCircle.blueBorder,
                      backgroundColor: linked
                        ? opacity.iconCircle.lilacFill
                        : opacity.iconCircle.blueFill,
                    },
                  ]}
                >
                  {linked ? (
                    <Check size={19} color={opacity.iconStroke.lilac} strokeWidth={1.9} />
                  ) : (
                    <Link2 size={19} color={opacity.iconStroke.blue} strokeWidth={1.7} />
                  )}
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.title, { color: palette.textPrimary }]}>
                    {campaign.title}
                  </Text>
                  <Text style={[styles.meta, { color: palette.textSecondary }]}>
                    {campaign.system || 'Sistema não informado'} · {STATUS_LABELS[campaign.status]}
                  </Text>
                  <Text
                    style={[
                      styles.linkState,
                      { color: linked ? palette.accent : palette.textSecondary },
                    ]}
                  >
                    {linked ? 'Vinculada a este universo' : 'Toque para vincular'}
                  </Text>
                </View>
                {linked ? (
                  <Unlink size={17} color={palette.textSecondary} strokeWidth={1.6} />
                ) : null}
              </SurfaceCard>
            );
          })}
        </View>
      ) : (
        <SurfaceCard variant="subtle" radius="md" padding="lg" shadow={false}>
          <View style={styles.empty}>
            <Link2 size={27} color={palette.textSecondary} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: palette.textPrimary }]}>
              Nenhuma campanha disponível
            </Text>
            <Text style={[styles.emptyBody, { color: palette.textSecondary }]}>
              Crie uma campanha e depois retorne para vinculá-la ao universo.
            </Text>
          </View>
        </SurfaceCard>
      )}

      <SurfaceCard
        variant="interactive"
        radius="sm"
        padding="sm"
        shadow={false}
        onPress={onCreateCampaign}
        accessibilityLabel="Criar nova campanha"
        style={styles.createCard}
        contentStyle={styles.createContent}
      >
        <Plus size={18} color={palette.accent} strokeWidth={1.8} />
        <Text style={[styles.createLabel, { color: palette.textPrimary }]}>
          Criar nova campanha
        </Text>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...typeRoles.bodySm,
    marginBottom: 16,
  },
  loading: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {},
  cardContent: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...typeRoles.label,
  },
  meta: {
    ...typeRoles.caption,
    marginTop: 2,
  },
  linkState: {
    ...typeRoles.badge,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  empty: {
    alignItems: 'center',
    gap: 7,
  },
  emptyTitle: {
    ...typeRoles.titleSm,
    textAlign: 'center',
  },
  emptyBody: {
    ...typeRoles.bodySm,
    textAlign: 'center',
  },
  createCard: {
    marginTop: 14,
  },
  createContent: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createLabel: {
    ...typeRoles.buttonSm,
  },
});
