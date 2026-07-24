export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;

export const CONTENT_MAX_WIDTH = {
  default: 960,
  wide: 1200,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
