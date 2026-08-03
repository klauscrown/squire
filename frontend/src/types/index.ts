export type ThemeMode = 'light' | 'dark';

export type { ThemeName as VisualThemeId, ThemeName } from '@/theme/palettes';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiError {
  code: string;
  message: string;
}

export type Nullable<T> = T | null;
