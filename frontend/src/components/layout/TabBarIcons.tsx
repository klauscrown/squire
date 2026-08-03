import Svg, { Circle, Path } from 'react-native-svg';
import type { ReactNode } from 'react';

interface TabBarIconProps {
  size?: number;
  color?: string;
}

const STROKE = 1.5;

function IconFrame({
  size = 22,
  children,
}: TabBarIconProps & { children: ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
    </Svg>
  );
}

/** Torre / lar — Início */
export function TabHomeIcon({ size = 22, color = '#F4F1EA' }: TabBarIconProps) {
  return (
    <IconFrame size={size} color={color}>
      <Path
        d="M12 4L5 10v9h5v-5h4v5h5v-9L12 4z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 19v-3.5M14.5 19v-3.5"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.7}
      />
      <Circle cx="12" cy="11.5" r="1.2" fill={color} opacity={0.8} />
    </IconFrame>
  );
}

/** Pergaminho — Campanhas */
export function TabCampaignsIcon({ size = 22, color = '#F4F1EA' }: TabBarIconProps) {
  return (
    <IconFrame size={size} color={color}>
      <Path
        d="M8 5c0-1.2 1-2 2.2-2h7.6c1.2 0 2.2.8 2.2 2v14c0 1.2-1 2-2.2 2H10.2C9 21 8 20.2 8 19V5z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 9h5M11 12.5h4M11 16h3"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.75}
      />
      <Path
        d="M8 7.5c-1.2.5-2 1.5-2 2.8"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.55}
      />
    </IconFrame>
  );
}

/** Livro aberto — Biblioteca */
export function TabLibraryIcon({ size = 22, color = '#F4F1EA' }: TabBarIconProps) {
  return (
    <IconFrame size={size} color={color}>
      <Path
        d="M5 7c0-1.2 1-2 2.2-2h4.3C13 5 14 6 14 7.2V19H7.2C6 19 5 18.2 5 17V7z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 7c0-1.2-1-2-2.2-2h-4.3C11 5 10 6 10 7.2V19h6.8c1.2 0 2.2-.8 2.2-2V7z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 7v12" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.65} />
      <Path
        d="M7.5 10h3M7.5 13h2.5M16.5 10H14M16.5 13h-2.5"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        opacity={0.6}
      />
    </IconFrame>
  );
}

/** Medallão de retrato — Perfil */
export function TabProfileIcon({ size = 22, color = '#F4F1EA' }: TabBarIconProps) {
  return (
    <IconFrame size={size} color={color}>
      <Circle cx="12" cy="11.5" r="7.5" stroke={color} strokeWidth={STROKE} />
      <Path
        d="M12 4.8 13.1 6.7h-2.2L12 4.8z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
        opacity={0.7}
      />
      <Circle cx="12" cy="10" r="2.2" stroke={color} strokeWidth={STROKE} />
      <Path
        d="M8.2 16.2c.65-2.1 2.1-3.2 3.8-3.2s3.15 1.1 3.8 3.2"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <Path
        d="M9.5 17.2h5M10.2 18.8h3.6"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        opacity={0.6}
      />
      <Path
        d="M5.2 11.5v1.2M18.8 11.5v1.2"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        opacity={0.5}
      />
    </IconFrame>
  );
}
