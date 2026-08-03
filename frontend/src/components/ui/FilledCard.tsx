import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { GlassSurface } from '@/components/ui/GlassSurface';
import { useComponents } from '@/hooks/useTheme';

interface FilledCardProps {
  children: ReactNode;
  illustration?: ReactNode;
  radius?: number;
  shadow?: boolean;
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
}

/** Card com ilustração lateral, scrim de legibilidade e linha accent. */
export function FilledCard({
  children,
  illustration,
  radius,
  shadow = true,
  style,
  bodyStyle,
}: FilledCardProps) {
  const components = useComponents();
  const card = components.filledCard;
  const illust = card.illustration;
  const resolvedRadius = radius ?? card.radius;

  return (
    <GlassSurface radius={resolvedRadius} shadow={shadow} style={style}>
      <View style={[styles.inner, { minHeight: card.minHeight }]}>
        {illustration ? (
          <View
            style={[
              styles.illustrationWrap,
              {
                right: illust.bleedRight,
                bottom: illust.bleedBottom,
                width: illust.width,
                justifyContent: illust.align === 'bottom' ? 'flex-end' : 'center',
                opacity: illust.opacity,
              },
            ]}
            pointerEvents="none"
          >
            {illustration}
          </View>
        ) : null}

        <LinearGradient
          colors={[card.scrim.start, card.scrim.mid, card.scrim.soft, card.scrim.end]}
          locations={[...card.scrim.locations]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.scrimHorizontal}
          pointerEvents="none"
        />

        {illustration ? (
          <LinearGradient
            colors={[card.scrim.start, 'transparent']}
            locations={[0, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.35, y: 0 }}
            style={styles.scrimVertical}
            pointerEvents="none"
          />
        ) : null}

        <View
          style={[
            styles.accentLine,
            {
              left: card.padding,
              right: card.padding,
              backgroundColor: card.accentLine,
            },
          ]}
          pointerEvents="none"
        />

        <View
          style={[
            styles.body,
            { padding: card.padding, maxWidth: card.bodyMaxWidth },
            bodyStyle,
          ]}
        >
          {children}
        </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  inner: {
    overflow: 'hidden',
  },
  illustrationWrap: {
    position: 'absolute',
    alignItems: 'flex-end',
    zIndex: 0,
  },
  scrimHorizontal: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  scrimVertical: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    height: 1,
    zIndex: 2,
  },
  body: {
    gap: 10,
    zIndex: 3,
  },
});
