import { Dices } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { loginFonts } from '@/features/auth/constants/loginFonts';
import { loginTheme } from '@/features/auth/constants/loginTheme';

import { AuthText } from '../AuthText';

interface LoginFooterArtProps {
  onExplore?: () => void;
  exploreLoading?: boolean;
}

export function LoginFooterArt({ onExplore, exploreLoading }: LoginFooterArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.d20Row}>
        <View style={styles.line} />
        <Dices size={13} color={loginTheme.link} strokeWidth={1.5} />
        <View style={styles.line} />
      </View>

      {onExplore ? (
        <Pressable
          onPress={onExplore}
          disabled={exploreLoading}
          style={({ pressed }) => [styles.explorerBtn, pressed && styles.explorerPressed]}
        >
          <AuthText style={styles.explorerText}>
            {exploreLoading ? 'Abrindo…' : 'Continuar como explorador'}
          </AuthText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  d20Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  line: {
    width: 52,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(129, 140, 248, 0.2)',
  },
  explorerBtn: {
    paddingVertical: 4,
  },
  explorerPressed: {
    opacity: 0.7,
  },
  explorerText: {
    fontFamily: loginFonts.body,
    fontSize: 11,
    color: 'rgba(165, 180, 252, 0.45)',
  },
});
