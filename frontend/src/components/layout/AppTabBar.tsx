import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  TabCampaignsIcon,
  TabHomeIcon,
  TabProfileIcon,
  TabUniverseIcon,
} from '@/components/layout/TabBarIcons';
import { useUniverseCreationStore } from '@/features/universe/store/useUniverseCreationStore';
import { useComponents } from '@/hooks/useTheme';
import { useActivePalette } from '@/store/useThemeStore';
import { MIN_TOUCH_TARGET } from '@/theme/accessibility';
import { fontFamily } from '@/theme/typography';

type SideTab = 'home' | 'campaigns' | 'universe' | 'profile';

type TabIconComponent = typeof TabHomeIcon;

const LEFT_TABS: SideTab[] = ['home', 'campaigns'];
const RIGHT_TABS: SideTab[] = ['universe', 'profile'];

const TAB_META: Record<SideTab, { label: string; icon: TabIconComponent; activeWidth: number }> = {
  home: { label: 'Início', icon: TabHomeIcon, activeWidth: 82 },
  campaigns: { label: 'Campanhas', icon: TabCampaignsIcon, activeWidth: 108 },
  universe: { label: 'Universo', icon: TabUniverseIcon, activeWidth: 94 },
  profile: { label: 'Perfil', icon: TabProfileIcon, activeWidth: 82 },
};

const FAB = 50;
const FAB_RING = 4;
const FAB_SLOT_WIDTH = FAB + FAB_RING * 2 + 12;

/** Altura do contentor da tab + respiro do FAB elevado (não inclui safe area). */
export const CURVED_TAB_BAR_FOOTPRINT = 100;

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
  compact: boolean;
  Icon: TabIconComponent;
  onPress: () => void;
  onLongPress: () => void;
}

function TabBarItem({
  focused,
  label,
  activeWidth,
  compact,
  Icon,
  onPress,
  onLongPress,
}: TabBarItemProps) {
  const palette = useActivePalette();
  const components = useComponents();
  const pill = components.pill;
  const progress = useSharedValue(focused ? 1 : 0);
  const expandedWidth = compact ? pill.inactiveSize : activeWidth;

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, pill.spring);
  }, [focused, progress, pill.spring]);

  const pillStyle = useAnimatedStyle(() => ({
    width: interpolate(
      progress.value,
      [0, 1],
      [pill.inactiveSize, expandedWidth],
      Extrapolation.CLAMP,
    ),
    height: pill.height,
    borderRadius: pill.radius,
  }));

  const fillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: compact ? 0 : progress.value,
    maxWidth: compact
      ? 0
      : interpolate(progress.value, [0, 1], [0, activeWidth - 38], Extrapolation.CLAMP),
    marginLeft: compact ? 0 : interpolate(progress.value, [0, 1], [0, 6], Extrapolation.CLAMP),
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(
      progress.value,
      [0, 1],
      [0, pill.shadow.opacity * 0.6],
      Extrapolation.CLAMP,
    ),
    elevation: interpolate(
      progress.value,
      [0, 1],
      [0, pill.shadow.elevation * 0.5],
      Extrapolation.CLAMP,
    ),
  }));

  const pressScale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const iconColor = focused ? palette.textPrimary : palette.textSecondary;

  return (
    <Pressable
      style={styles.tabPressable}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        pressScale.value = withSpring(0.92, pill.spring);
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        pressScale.value = withSpring(1, pill.spring);
      }}
    >
      <Animated.View
        style={[
          styles.pill,
          pillStyle,
          shadowStyle,
          pressStyle,
          Platform.OS === 'ios' && {
            shadowColor: palette.primary,
            shadowOffset: { width: 0, height: pill.shadow.offsetY },
            shadowRadius: pill.shadow.radius,
          },
        ]}
      >
        {/* Ativo: tom primary suave, alinhado ao shell flutuante */}
        <Animated.View
          style={[StyleSheet.absoluteFill, fillStyle, { backgroundColor: palette.primary }]}
        />

        <Icon size={20} color={iconColor} />

        <Animated.Text
          style={[
            styles.pillLabel,
            { fontSize: pill.label.fontSize, color: palette.textPrimary },
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
  const { width } = useWindowDimensions();
  const palette = useActivePalette();
  const components = useComponents();
  const pill = components.pill;
  const tabBar = components.tabBar;
  const floatInset = tabBar.floatInset ?? 16;
  const sideGroupWidth = (width - floatInset * 2 - FAB_SLOT_WIDTH) / 2;
  const compact = sideGroupWidth < TAB_META.campaigns.activeWidth + MIN_TOUCH_TARGET;
  const bottom = Math.max(insets.bottom, 10);
  const fabScale = useSharedValue(1);
  const fabAnim = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));
  const openCreationMenu = useUniverseCreationStore((store) => store.openMenu);

  const shellShadow = Platform.select({
    ios: {
      shadowColor: tabBar.shellShadow?.color ?? palette.gradientEnd,
      shadowOffset: { width: 0, height: tabBar.shellShadow?.offsetY ?? 10 },
      shadowOpacity: tabBar.shellShadow?.opacity ?? 0.4,
      shadowRadius: tabBar.shellShadow?.radius ?? 22,
    },
    android: {
      elevation: tabBar.shellShadow?.elevation ?? 14,
    },
    default: {},
  });

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
        compact={compact}
        Icon={meta.icon}
        onPress={() => navigate(navigation, route, focused)}
        onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
      />
    );
  }

  return (
    <View
      style={[styles.root, { height: CURVED_TAB_BAR_FOOTPRINT + bottom }]}
      pointerEvents="box-none"
    >
      {/* Shell flutuante — visual only; abas/FAB intactos */}
      <View
        style={[
          styles.shell,
          {
            left: floatInset,
            right: floatInset,
            bottom,
            height: tabBar.height,
            borderRadius: tabBar.shellRadius,
            borderColor: tabBar.shellBorder,
            backgroundColor: Platform.OS === 'android' ? tabBar.shellAndroid : tabBar.shellFill,
            ...shellShadow,
          },
        ]}
      />

      <View
        style={[
          styles.barRow,
          {
            left: floatInset,
            right: floatInset,
            bottom,
            height: tabBar.height,
          },
        ]}
      >
        <View style={styles.sideGroup}>{LEFT_TABS.map(renderTab)}</View>

        <View style={[styles.fabSlot, { width: FAB_SLOT_WIDTH, marginTop: -(FAB / 2 + 8) }]}>
          <Animated.View style={[styles.fabWrap, fabAnim]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Criar conteúdo"
              onPressIn={() => {
                // SharedValue do Reanimated é mutável por definição.
                // eslint-disable-next-line react-hooks/immutability
                fabScale.value = withSpring(0.92, pill.spring);
              }}
              onPressOut={() => {
                // eslint-disable-next-line react-hooks/immutability
                fabScale.value = withSpring(1, pill.spring);
              }}
              onPress={() => openCreationMenu()}
              style={styles.fabPressable}
            >
              <View
                pointerEvents="none"
                style={[
                  styles.fabGlow,
                  {
                    backgroundColor: palette.buttonPrimaryShadow,
                    width: FAB + FAB_RING * 2,
                    height: FAB + FAB_RING * 2,
                    borderRadius: (FAB + FAB_RING * 2) / 2,
                    opacity: 0.35,
                  },
                ]}
              />
              <View
                style={[
                  styles.fabRing,
                  {
                    backgroundColor: tabBar.fabRing,
                    borderColor: `${palette.accent}40`,
                    ...Platform.select({
                      ios: {
                        shadowColor: palette.buttonPrimary,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.18,
                        shadowRadius: 6,
                      },
                      android: {
                        elevation: 4,
                      },
                      default: {},
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={[palette.buttonPrimary, palette.accentSoft]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.fab}
                >
                  <Plus size={24} color={palette.gradientEnd} strokeWidth={2.4} />
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
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  barRow: {
    position: 'absolute',
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
