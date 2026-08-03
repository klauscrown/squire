import Svg, { Circle, Path } from 'react-native-svg';
import type { ReactNode } from 'react';

import { useActivePalette } from '@/store/useThemeStore';

export interface QuickActionIconProps {
  size?: number;
  stroke?: string;
  accentFill?: string;
}

const STROKE = 1.5;

function useIconColors(stroke?: string, accentFill?: string) {
  const palette = useActivePalette();
  return {
    stroke: stroke ?? palette.accent,
    accentFill: accentFill ?? palette.accentSoft,
  };
}

function IconBase({ size = 28, children }: QuickActionIconProps & { children: ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {children}
    </Svg>
  );
}

export function GenerateNamesIcon({ size = 28, stroke, accentFill }: QuickActionIconProps) {
  const colors = useIconColors(stroke, accentFill);

  return (
    <IconBase size={size}>
      <Path
        d="M7 6c0-1.5 1.2-2.5 3-2.5h8c1.8 0 3 1 3 2.5v16c0 1.2-.9 2-2.2 2H9.2C7.9 24 7 23.2 7 22V6z"
        stroke={colors.stroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 10h6M11 14h5M11 18h4"
        stroke={colors.stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.75}
      />
      <Path
        d="M19 8l.8 1.6L21.5 10l-1.7.4L19 12l-.8-1.6L16.5 10l1.7-.4L19 8z"
        fill={colors.accentFill}
        stroke={colors.stroke}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="8.5" r="1" fill={colors.stroke} opacity={0.65} />
    </IconBase>
  );
}

export function GenerateItemsIcon({ size = 28, stroke, accentFill }: QuickActionIconProps) {
  const colors = useIconColors(stroke, accentFill);

  return (
    <IconBase size={size}>
      <Path
        d="M6 13c0-3.5 2.8-6 6.5-6h3C19.2 7 22 9.5 22 13v7.5c0 1.2-1 2-2.2 2H8.2C7 22.5 6 21.5 6 20.5V13z"
        stroke={colors.stroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 13h16M14 7v15.5"
        stroke={colors.stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.7}
      />
      <Path
        d="M10 7c.5-1.5 1.8-2.5 4-2.5s3.5 1 4 2.5"
        stroke={colors.stroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <Path
        d="M12.5 16l1.5 1.8 3-3.6"
        stroke={colors.stroke}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function QuickNotesIcon({ size = 28, stroke, accentFill }: QuickActionIconProps) {
  const colors = useIconColors(stroke, accentFill);

  return (
    <IconBase size={size}>
      <Path
        d="M5 8c0-1.2 1-2 2.2-2h11.6c1.2 0 2.2.8 2.2 2v14c0 1.2-1 2-2.2 2H7.2C6 22 5 21.2 5 20V8z"
        stroke={colors.stroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11h8M9 15h6M9 19h4"
        stroke={colors.stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.7}
      />
      <Path
        d="M17 6c2 2.5 2.5 6 1 9.5M18 15.5l4.5 7.5"
        stroke={colors.stroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.5 21.5c-1.2.8-2.8.4-3.5-.8"
        stroke={colors.stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function GenerateEncounterIcon({ size = 28, stroke, accentFill }: QuickActionIconProps) {
  const colors = useIconColors(stroke, accentFill);

  return (
    <IconBase size={size}>
      <Path
        d="M14 4L24 10v8l-10 6L4 18v-8L14 4z"
        stroke={colors.stroke}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 4v20M4 10l10 6 10-6M4 18l10-6 10 6"
        stroke={colors.stroke}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.65}
      />
      <Path
        d="M11.5 12.5h5M13 15.5h2"
        stroke={colors.stroke}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <Circle
        cx="14"
        cy="12"
        r="1.2"
        fill={colors.accentFill}
        stroke={colors.stroke}
        strokeWidth={0.8}
      />
    </IconBase>
  );
}
