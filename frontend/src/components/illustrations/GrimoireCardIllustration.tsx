import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { useComponents } from '@/hooks/useTheme';

interface GrimoireCardIllustrationProps {
  width?: number;
  height?: number;
}

/** Placeholder decorativo — livro aberto, pergaminho, pena e brasão. */
export function GrimoireCardIllustration({
  width = 160,
  height = 180,
}: GrimoireCardIllustrationProps) {
  const c = useComponents().illustration;

  return (
    <Svg width={width} height={height} viewBox="0 6 160 174" fill="none">
      <Circle cx="118" cy="92" r="62" fill={c.glow} />

      <Path
        d="M108 28c14 0 22 8 22 20v88c0 8-6 14-14 14H88c-6 0-10-4-10-10V38c0-6 4-10 10-10h20z"
        fill={c.scrollFill}
        stroke={c.scrollStroke}
        strokeWidth="1.2"
      />
      <Path
        d="M98 42h24M98 56h18M98 70h20"
        stroke={c.scrollStroke}
        strokeWidth="1"
        strokeLinecap="round"
        opacity={0.55}
      />

      <Path
        d="M128 118l-10-6v-14c0-8 4-14 10-16s10 8 10 16v14l-10 6z"
        fill={c.shieldFill}
        stroke={c.shieldStroke}
        strokeWidth="1.2"
      />
      <Path
        d="M128 104v8M123 108h10"
        stroke={c.scrollStroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <Path
        d="M24 118c0-36 18-54 44-54s44 18 44 54v36H24v-36z"
        fill={c.bookFill}
        stroke={c.bookStroke}
        strokeWidth="1.4"
      />
      <Path d="M68 64v90" stroke={c.bookStroke} strokeWidth="1.6" opacity={0.7} />
      <Rect x="32" y="78" width="28" height="4" rx="1" fill={c.bookPage} />
      <Rect x="32" y="90" width="24" height="3" rx="1" fill={c.bookPage} opacity={0.7} />
      <Rect x="76" y="78" width="28" height="4" rx="1" fill={c.bookPage} />
      <Rect x="76" y="90" width="22" height="3" rx="1" fill={c.bookPage} opacity={0.7} />

      <Path
        d="M48 42c8-10 18-8 22 0 2 4 0 10-4 14l-10 8-4-6c-4-6-6-10-4-16z"
        fill={c.scrollFill}
        stroke={c.quillStroke}
        strokeWidth="1.1"
      />
      <Path
        d="M54 58l8 14"
        stroke={c.quillStroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Ellipse cx="52" cy="40" rx="3" ry="4" fill={c.quillStroke} opacity={0.55} />
    </Svg>
  );
}
