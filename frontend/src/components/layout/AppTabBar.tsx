import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ROUTES } from '@/constants';
import {
  TabCampaignsIcon,
  TabHomeIcon,
  TabProfileIcon,
  TabSettingsIcon,
} from '@/components/layout/TabBarIcons';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { fontFamily } from '@/theme/typography';

type SideTab = 'home' | 'campaigns' | 'settings' | 'profile';

type TabIconComponent = typeof TabHomeIcon;

const LEFT_TABS: SideTab[] = ['home', 'campaigns'];
const RIGHT_TABS: SideTab[] = ['settings', 'profile'];

const TAB_META: Record<SideTab, { label: string; icon: TabIconComponent; activeWidth: number }> = {
  home: { label: 'Início', icon: TabHomeIcon, activeWidth: 82 },
  campaigns: { label: 'Campanhas', icon: TabCampaignsIcon, activeWidth: 108 },
  settings: { label: 'Ajustes', icon: TabSettingsIcon, activeWidth: 88 },
  profile: { label: 'Perfil', icon: TabProfileIcon, activeWidth: 82 },
};

const FAB = 50;
const FAB_RING = 4;

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

interface TabBarItemProps {
  focused: boolean;
  label: string;
  activeWidth: number;
  Icon: TabIconComponent;
  onPress: () => void;
  onLongPress: () => void;
}

function TabBarItem({ focused, label, activeWidth, Icon, onPress, onLongPress }: TabBarItemProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const pill = components.pill;
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, pill.spring);
  }, [focused, progress, pill.spring]);

  const pillStyle = useAnimatedStyle(() => ({
    width: interpolate(
      progress.value,
      [0, 1],
      [pill.inactiveSize, activeWidth],
      Extrapolation.CLAMP,
    ),
    height: pill.height,
    borderRadius: pill.radius,
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxWidth: interpolate(progress.value, [0, 1], [0, activeWidth - 38], Extrapolation.CLAMP),
    marginLeft: interpolate(progress.value, [0, 1], [0, 6], Extrapolation.CLAMP),
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      progress.value,
      [0, 1],
      [0, pill.shadow.opacity],
      Extrapolation.CLAMP,
    ),
    elevation: interpolate(progress.value, [0, 1], [0, pill.shadow.elevation], Extrapolation.CLAMP),
  }));

  const iconColor = focused ? pill.activeIcon : palette.textSecondary;

  return (
    <Pressable
      style={styles.tabPressable}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View
        style={[
          styles.pill,
          pillStyle,
          shadowStyle,
          Platform.OS === 'ios' && {
            shadowColor: palette.primary,
            shadowOffset: { width: 0, height: pill.shadow.offsetY },
            shadowRadius: pill.shadow.radius,
          },
        ]}
      >
        {/* Fundo sólido do tab ativo — sem gradiente azul→ouro */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            gradientStyle,
            { backgroundColor: palette.primary },
          ]}
        />

        <Icon size={20} color={iconColor} />

        <Animated.Text
          style={[
            styles.pillLabel,
            { fontSize: pill.label.fontSize, color: pill.activeLabel },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const router = useRouter();
  const palette = useActivePalette();
  const components = useComponents();
  const pill = components.pill;
  const tabBar = components.tabBar;
  const bottom = Math.max(insets.bottom, 8);
  const fabScale = useSharedValue(1);
  const fabAnim = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  function renderTab(routeName: SideTab) {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return null;

    const idx = state.routes.findIndex((r) => r.key === route.key);
    const meta = TAB_META[routeName];
    const focused = state.index === idx;
    const descriptor = descriptors[route.key];
    if (!descriptor) return null;

    const { options } = descriptor;
    const label =
      typeof options.tabBarLabel === 'string' ? options.tabBarLabel : (options.title ?? meta.label);

    return (
      <TabBarItem
        key={route.key}
        focused={focused}
        label={label}
        activeWidth={meta.activeWidth}
        Icon={meta.icon}
        onPress={() => navigate(navigation, route, focused)}
        onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
      />
    );
  }

  return (
    <View style={[styles.root, { height: CURVED_TAB_BAR_FOOTPRINT + bottom }]}>
      <View
        style={[
          styles.shell,
          {
            bottom,
            height: tabBar.height,
            borderRadius: tabBar.shellRadius,
            borderColor: tabBar.shellBorder,
            backgroundColor: tabBar.shellFill,
          },
        ]}
      />

      <View style={[styles.barRow, { bottom, height: tabBar.height }]}>
        <View style={styles.sideGroup}>{LEFT_TABS.map(renderTab)}</View>

        <View
          style={[styles.fabSlot, { width: FAB + FAB_RING * 2 + 12, marginTop: -(FAB / 2 + 6) }]}
        >
          <Animated.View style={[styles.fabWrap, fabAnim]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nova campanha"
              onPressIn={() => {
                // SharedValue do Reanimated é mutável por definição.
                // eslint-disable-next-line react-hooks/immutability
                fabScale.value = withSpring(0.94, pill.spring);
              }}
              onPressOut={() => {
                // eslint-disable-next-line react-hooks/immutability
                fabScale.value = withSpring(1, pill.spring);
              }}
              onPress={() => router.push(ROUTES.app.campaignCreate)}
              style={({ pressed }) => [styles.fabPressable, pressed && styles.fabPressed]}
            >
              <View
                pointerEvents="none"
                style={[
                  styles.fabGlow,
                  {
                    backgroundColor: palette.fabShadow,
                    width: FAB + FAB_RING * 2 + 6,
                    height: FAB + FAB_RING * 2 + 6,
                    borderRadius: (FAB + FAB_RING * 2 + 6) / 2,
                  },
                ]}
              />
              <View
                style={[
                  styles.fabRing,
                  {
                    backgroundColor: palette.gradientEnd,
                    borderColor: palette.surfaceBorder,
                    ...Platform.select({
                      ios: {
                        shadowColor: palette.buttonPrimary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.22,
                        shadowRadius: 8,
                      },
                      android: {
                        elevation: 6,
                      },
                      default: {},
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={[palette.buttonPrimary, palette.primaryLight]}
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
    overflow: 'hidden',
    borderWidth: 1,
  },
  barRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  sideGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 2,
  },
  fabSlot: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabPressable: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  pillLabel: {
    fontFamily: fontFamily.inter.semibold,
    overflow: 'hidden',
  },
  fabWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressable: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGlow: {
    position: 'absolute',
  },
  fabPressed: {
    opacity: 0.92,
  },
  fabRing: {
    padding: FAB_RING,
    borderRadius: (FAB + FAB_RING * 2) / 2,
    borderWidth: 1,
  },
  fab: {
    width: FAB,
    height: FAB,
    borderRadius: FAB / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
