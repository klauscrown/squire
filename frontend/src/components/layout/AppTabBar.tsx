import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Home, Plus, ScrollText, User } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ROUTES } from '@/constants';
import { premium } from '@/theme/premium';
import { fontFamily } from '@/theme/typography';

type SideTab = 'home' | 'campaigns' | 'settings' | 'profile';

const LEFT_TABS: SideTab[] = ['home', 'campaigns'];
const RIGHT_TABS: SideTab[] = ['settings', 'profile'];

const TAB_META: Record<SideTab, { label: string; icon: typeof Home }> = {
  home: { label: 'Início', icon: Home },
  campaigns: { label: 'Campanhas', icon: ScrollText },
  settings: { label: 'Biblioteca', icon: BookOpen },
  profile: { label: 'Perfil', icon: User },
};

const BAR_H = 64;
const FAB = 50;
const FAB_RING = 4;
const SPRING = { damping: 18, stiffness: 220, mass: 0.8 };

export const CURVED_TAB_BAR_FOOTPRINT = 96;

function navigate(
  navigation: BottomTabBarProps['navigation'],
  route: BottomTabBarProps['state']['routes'][number],
  focused: boolean,
) {
  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
  if (!focused && !event.defaultPrevented) {
    navigation.navigate(route.name, route.params);
  }
}

export function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const router = useRouter();
  const bottom = Math.max(insets.bottom, 8);
  const fabScale = useSharedValue(1);
  const fabAnim = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  function renderTab(routeName: SideTab) {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return null;

    const idx = state.routes.findIndex((r) => r.key === route.key);
    const meta = TAB_META[routeName];
    const focused = state.index === idx;
    const Icon = meta.icon;
    const descriptor = descriptors[route.key];
    if (!descriptor) return null;

    const { options } = descriptor;
    const label =
      typeof options.tabBarLabel === 'string' ? options.tabBarLabel : (options.title ?? meta.label);

    return (
      <Pressable
        key={route.key}
        style={styles.tab}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={label}
        onPress={() => navigate(navigation, route, focused)}
        onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
      >
        <View style={[styles.iconSlot, focused && styles.iconSlotActive]}>
          <Icon
            size={22}
            color={focused ? premium.accentSoft : 'rgba(255,255,255,0.58)'}
            strokeWidth={focused ? 2 : 1.6}
          />
        </View>
        <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.root, { height: CURVED_TAB_BAR_FOOTPRINT + bottom }]}>
      <View style={[styles.shell, { bottom }]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={premium.glass.blurStrong} tint="dark" style={StyleSheet.absoluteFill} />
        ) : Platform.OS !== 'web' ? (
          <View style={styles.androidBar} />
        ) : null}
        <View style={styles.tint} />
      </View>

      <View style={[styles.barRow, { bottom }]}>
        <View style={styles.sideGroup}>{LEFT_TABS.map(renderTab)}</View>

        <View style={styles.fabSlot}>
          <Animated.View style={[styles.fabWrap, fabAnim]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nova campanha"
              onPressIn={() => {
                fabScale.value = withSpring(0.94, SPRING);
              }}
              onPressOut={() => {
                fabScale.value = withSpring(1, SPRING);
              }}
              onPress={() => router.push(ROUTES.app.campaignCreate)}
              style={({ pressed }) => [styles.fabPressable, pressed && styles.fabPressed]}
            >
              <View style={styles.fabRing}>
                <LinearGradient
                  colors={['#3B82F6', '#6366F1', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.fab}
                >
                  <Plus size={24} color="#FFFFFF" strokeWidth={2.4} />
                </LinearGradient>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.sideGroup}>{RIGHT_TABS.map(renderTab)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  shell: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: BAR_H,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: premium.glass.borderStrong,
  },
  androidBar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 12, 28, 0.92)',
  },
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor:
      Platform.OS === 'web'
        ? premium.glass.fillWeb
        : Platform.OS === 'ios'
          ? premium.glass.fill
          : 'rgba(99, 102, 241, 0.05)',
  },
  barRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    height: BAR_H,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  sideGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 6,
  },
  fabSlot: {
    width: FAB + FAB_RING * 2 + 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -(FAB / 2 + 6),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: 4,
  },
  iconSlot: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconSlotActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  label: {
    fontFamily: fontFamily.inter.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.58)',
  },
  labelActive: {
    color: premium.accentSoft,
  },
  fabWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: {
    opacity: 0.92,
  },
  fabRing: {
    padding: FAB_RING,
    borderRadius: (FAB + FAB_RING * 2) / 2,
    backgroundColor: 'rgba(10, 12, 28, 0.96)',
    borderWidth: 1,
    borderColor: premium.glass.borderStrong,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {},
      default: {},
    }),
  },
  fab: {
    width: FAB,
    height: FAB,
    borderRadius: FAB / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
