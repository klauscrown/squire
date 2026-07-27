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
import { ROUTES } from '@/constants';
import { useDataMode } from '@/hooks/useAuthUserId';
import { useAppStore } from '@/store/appStore';
import type { ThemeMode } from '@/types';
import { grimoire } from '@/theme/grimoire';
import { fontFamily } from '@/theme/typography';

const THEME_OPTIONS: ThemeMode[] = ['dark', 'light'];
const THEME_LABELS: Record<ThemeMode, string> = {
  dark: 'Grimório escuro',
  light: 'Claro (legado)',
};

export default function SettingsScreen() {
  const router = useRouter();
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
          <View style={styles.card}>
            <GrimoireOptionPills
              variant="softGlass"
              label="Tema"
              options={THEME_OPTIONS}
              value={themeMode}
              onChange={setThemeMode}
              getLabel={(mode) => THEME_LABELS[mode]}
            />
            <Text style={styles.hint}>
              O visual grimório usa o tema escuro. O modo claro afeta telas legadas.
            </Text>
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={160}>
        <View style={styles.section}>
          <SectionLabel variant="softGlass" title="Armazenamento" />
          <View style={styles.card}>
            <Text style={styles.body}>
              {dataMode === 'cloud'
                ? 'Campanhas, sessões, NPCs, notas e imagens ficam no Supabase. Rebuilds do app não apagam esses dados enquanto a sessão for mantida.'
                : 'Modo local: tudo fica só na memória do app. Ao fechar, reinstalar ou fazer build limpo, os dados podem ser perdidos.'}
            </Text>
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>{modeBadgeLabel}</Text>
            </View>
          </View>
        </View>
      </GrimoireFadeIn>

      <GrimoireFadeIn delay={240}>
        <View style={styles.section}>
          <SectionLabel variant="softGlass" title="Conta" />
          <View style={styles.card}>
            <Text style={styles.body}>
              {hasEmailAccount
                ? `Conectado como ${email ?? displayName ?? 'sua conta'}.`
                : session
                  ? 'Sessão anônima na nuvem. Crie uma conta com e-mail para recuperar o acesso neste dispositivo.'
                  : 'Sem conta. Entre com e-mail ou continue como explorador.'}
            </Text>
            <Pressable
              onPress={handleSignOut}
              style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutPressed]}
            >
              <Text style={styles.signOutText}>Encerrar sessão</Text>
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

const soft = grimoire.softGlass;

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
  },
  card: {
    borderRadius: soft.settingsCard.borderRadius,
    backgroundColor: soft.settingsCard.backgroundColor,
    borderWidth: 1,
    borderColor: soft.settingsCard.borderColor,
    padding: soft.settingsCard.padding,
    marginBottom: 16,
  },
  hint: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    lineHeight: 18,
    color: soft.muted,
    marginTop: -8,
  },
  body: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.78)',
  },
  modeBadge: {
    alignSelf: 'flex-start',
    borderRadius: soft.localModeBadge.borderRadius,
    backgroundColor: soft.localModeBadge.backgroundColor,
    borderWidth: 1,
    borderColor: soft.localModeBadge.borderColor,
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
    color: soft.gold,
  },
  signOutBtn: {
    alignSelf: 'flex-start',
    marginTop: 16,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: soft.signOutPill.backgroundColor,
    borderWidth: 1,
    borderColor: soft.signOutPill.borderColor,
  },
  signOutPressed: {
    opacity: 0.78,
  },
  signOutText: {
    fontFamily: fontFamily.inter.semibold,
    fontSize: 13,
    fontWeight: '600',
    color: soft.signOutPill.color,
  },
  hintWrap: {
    marginTop: 12,
  },
});
