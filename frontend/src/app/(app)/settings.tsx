import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/components/providers/AuthProvider';
import {
  GrimoireFadeIn,
  GrimoireHeader,
  GrimoireOptionPills,
  GrimoireScreen,
  SectionLabel,
  SquireHint,
} from '@/components/grimoire';
import { ThemePickerCards } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useDataMode } from '@/hooks/useAuthUserId';
import { useGrimoire } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import type { ThemeMode } from '@/types';
import { fontFamily } from '@/theme/typography';

const THEME_OPTIONS: ThemeMode[] = ['dark', 'light'];
const THEME_LABELS: Record<ThemeMode, string> = {
  dark: 'Grimório escuro',
  light: 'Claro (legado)',
};

export default function SettingsScreen() {
  const router = useRouter();
  const grimoire = useGrimoire();
  const soft = grimoire.softGlass;
  const { session, hasEmailAccount, email, displayName, signOut } = useAuth();
  const dataMode = useDataMode();
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const setExplorerMode = useAppStore((state) => state.setExplorerMode);

  async function handleSignOut() {
    Alert.alert('Sair', 'Deseja voltar para a tela de login?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          setExplorerMode(false);
          router.replace(ROUTES.auth.login);
        },
      },
    ]);
  }

  const modeBadgeLabel = dataMode === 'cloud' ? 'MODO NUVEM ATIVO' : 'MODO LOCAL ATIVO';

  return (
    <GrimoireScreen glow="none">
      <GrimoireFadeIn>
        <GrimoireHeader
          variant="softGlass"
          eyebrow="Ajustes"
          title="Selos & Runas"
          subtitle="Configure sua experiência de mestre."
        />
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={80}>
        <View style={styles.section}>
          <SectionLabel variant="softGlass" title="Aparência" />
          <View
            style={[
              styles.card,
              {
                borderRadius: soft.settingsCard.borderRadius,
                backgroundColor: soft.settingsCard.backgroundColor,
                borderColor: soft.settingsCard.borderColor,
                padding: soft.settingsCard.padding,
              },
            ]}
          >
            <Text
              style={[
                styles.pickerLabel,
                {
                  fontSize: grimoire.typography.label.fontSize,
                  letterSpacing: grimoire.typography.label.letterSpacing,
                  color: soft.muted,
                },
              ]}
            >
              Paleta visual
            </Text>
            <ThemePickerCards />

            <View style={styles.modeBlock}>
              <GrimoireOptionPills
                variant="softGlass"
                label="Modo"
                options={THEME_OPTIONS}
                value={themeMode}
                onChange={setThemeMode}
                getLabel={(mode) => THEME_LABELS[mode] ?? mode}
              />
              <Text style={[styles.hint, { color: soft.muted }]}>
                O visual grimório usa o tema escuro. O modo claro afeta telas legadas.
              </Text>
            </View>
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={160}>
        <View style={styles.section}>
          <SectionLabel variant="softGlass" title="Armazenamento" />
          <View
            style={[
              styles.card,
              {
                borderRadius: soft.settingsCard.borderRadius,
                backgroundColor: soft.settingsCard.backgroundColor,
                borderColor: soft.settingsCard.borderColor,
                padding: soft.settingsCard.padding,
              },
            ]}
          >
            <Text style={styles.body}>
              {dataMode === 'cloud'
                ? 'Campanhas, sessões, NPCs, notas e imagens ficam no Supabase. Rebuilds do app não apagam esses dados enquanto a sessão for mantida.'
                : 'Modo local: tudo fica só na memória do app. Ao fechar, reinstalar ou fazer build limpo, os dados podem ser perdidos.'}
            </Text>
            <View
              style={[
                styles.modeBadge,
                {
                  borderRadius: soft.localModeBadge.borderRadius,
                  backgroundColor: soft.localModeBadge.backgroundColor,
                  borderColor: soft.localModeBadge.borderColor,
                },
              ]}
            >
              <Text style={[styles.modeBadgeText, { color: soft.gold }]}>{modeBadgeLabel}</Text>
            </View>
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={240}>
        <View style={styles.section}>
          <SectionLabel variant="softGlass" title="Conta" />
          <View
            style={[
              styles.card,
              {
                borderRadius: soft.settingsCard.borderRadius,
                backgroundColor: soft.settingsCard.backgroundColor,
                borderColor: soft.settingsCard.borderColor,
                padding: soft.settingsCard.padding,
              },
            ]}
          >
            <Text style={styles.body}>
              {hasEmailAccount
                ? `Conectado como ${email ?? displayName ?? 'sua conta'}.`
                : session
                  ? 'Sessão anônima na nuvem. Crie uma conta com e-mail para recuperar o acesso neste dispositivo.'
                  : 'Sem conta. Entre com e-mail ou continue como explorador.'}
            </Text>
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [
                styles.signOutBtn,
                {
                  backgroundColor: soft.signOutPill.backgroundColor,
                  borderColor: soft.signOutPill.borderColor,
                },
                pressed && styles.signOutPressed,
              ]}
            >
              <Text style={[styles.signOutText, { color: soft.signOutPill.color }]}>
                Encerrar sessão
              </Text>
            </Pressable>
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={320}>
        <View style={styles.hintWrap}>
          <SquireHint
            variant="softGlass"
            message="O ferreiro está afiando as opções. Volte em breve para forjar seus próprios ajustes."
          />
        </View>
      </GrimoireFadeIn>
    </GrimoireScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
  },
  card: {
    borderWidth: 1,
    marginBottom: 16,
  },
  pickerLabel: {
    fontFamily: fontFamily.inter.semibold,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  modeBlock: {
    marginTop: 18,
  },
  hint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -8,
    marginBottom: 8,
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.78)',
  },
  modeBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 16,
  },
  modeBadgeText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  signOutBtn: {
    alignSelf: 'flex-start',
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
  },
  signOutPressed: {
    opacity: 0.78,
  },
  signOutText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 13,
    fontWeight: '600',
  },
  hintWrap: {
    marginTop: 12,
  },
});
