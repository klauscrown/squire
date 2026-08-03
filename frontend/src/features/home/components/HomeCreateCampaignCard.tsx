import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilledCard, SectionHeader } from '@/components/ui';
import { GrimoireCardIllustration } from '@/components/illustrations/GrimoireCardIllustration';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { fontFamily } from '@/theme/typography';

interface HomeCreateCampaignCardProps {
  onPress: () => void;
}

export function HomeCreateCampaignCard({ onPress }: HomeCreateCampaignCardProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const cta = components.cta;

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View style={{ marginTop: components.home.sectionGap }}>
      <SectionHeader title="Campanhas" />
      <FilledCard
        illustration={
          <GrimoireCardIllustration
            width={components.filledCard.illustration.defaultWidth}
            height={components.filledCard.illustration.defaultHeight}
          />
        }
      >
        <Text style={[styles.title, { color: palette.textPrimary }]}>
          Comece sua primeira crônica
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Crie uma campanha e organize sessões, NPCs e notas em um só lugar.
        </Text>
        <View
          style={[
            styles.ctaShadow,
            {
              borderRadius: cta.radius,
              ...Platform.select({
                ios: {
                  shadowColor: palette.buttonPrimary,
                  shadowOffset: { width: 0, height: cta.shadow.offsetY },
                  shadowOpacity: 0.4,
                  shadowRadius: cta.shadow.radius + 2,
                },
                android: {
                  elevation: cta.shadow.elevation + 2,
                },
                default: {},
              }),
            },
          ]}
        >
          {/* Glow atrás do CTA — reforça hierarquia no card escuro */}
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: cta.radius,
                backgroundColor: palette.buttonPrimaryShadow,
                transform: [{ scale: 1.04 }],
              },
            ]}
          />
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              { borderRadius: cta.radius, overflow: 'hidden' },
              pressed && { opacity: cta.pressedOpacity },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Criar campanha"
          >
            <LinearGradient
              colors={[palette.buttonPrimary, palette.primaryLight]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: cta.paddingVertical,
                paddingHorizontal: cta.paddingHorizontal,
              }}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={[styles.ctaLabel, { fontSize: cta.label.fontSize }]}>
                Nova campanha
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </FilledCard>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 18,
  },
  subtitle: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  ctaShadow: {
    marginTop: 8,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  ctaLabel: {
    fontFamily: fontFamily.inter.semibold,
    color: '#FFFFFF',
  },
});
