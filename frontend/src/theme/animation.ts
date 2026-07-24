export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
  },
} as const;

export type ThemeAnimation = typeof animation;
