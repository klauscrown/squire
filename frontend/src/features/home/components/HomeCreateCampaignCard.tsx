import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FilledCard } from '@/components/ui';
import { GrimoireCardIllustration } from '@/components/illustrations/GrimoireCardIllustration';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { typeRoles } from '@/theme/typography';

interface HomeCreateCampaignCardProps {
  onPress: () => void;
}

/** Empty state no slot do hero — única ênfase quando não há campanha. */
export function HomeCreateCampaignCard({ onPress }: HomeCreateCampaignCardProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const cta = components.cta;
  const home = components.home;

  function handlePress() {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View style={{ marginTop: home.heroMarginTop }}>
      <Text style={[styles.sectionLabel, { color: palette.accent }]}>Campanha ativa</Text>
      <FilledCard
        style={{ minHeight: home.heroHeight - 24 }}
        illustration={
          <GrimoireCardIllustration
            width={components.filledCard.illustration.defaultWidth}
            height={components.filledCard.illustration.defaultHeight}
          />
        }
      >
        <Text style={[styles.title, { color: palette.textPrimary }]} numberOfLines={2}>
          Comece sua primeira crônica
        </Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]} numberOfLines={3}>
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
                  shadowOpacity: 0.38,
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
              colors={[...cta.gradient]}
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
              <Plus size={18} color={cta.foreground} strokeWidth={2.2} />
              <Text
                style={[styles.ctaLabel, { fontSize: cta.label.fontSize, color: cta.foreground }]}
              >
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
  sectionLabel: {
    ...typeRoles.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  title: {
    ...typeRoles.title,
  },
  subtitle: {
    ...typeRoles.editorialSm,
  },
  ctaShadow: {
    marginTop: 8,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  ctaLabel: {
    ...typeRoles.button,
  },
});
