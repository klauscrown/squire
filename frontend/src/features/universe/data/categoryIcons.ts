import {
  BookOpen,
  Castle,
  FileArchive,
  Library,
  Map,
  Package,
  Scroll,
  Shield,
  Skull,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

import type { UniverseElementCategory, UniverseHomeCategory } from '../types';

export const UNIVERSE_CATEGORY_ICONS: Record<UniverseElementCategory, LucideIcon> = {
  character: Users,
  location: Castle,
  faction: Shield,
  culture: Users,
  deity: Sparkles,
  creature: Skull,
  item: Package,
  history: Scroll,
  knowledge: BookOpen,
  world_rule: Shield,
  file: Map,
  fragment: Sparkles,
};

export const UNIVERSE_HOME_CATEGORY_ICONS: Record<UniverseHomeCategory, LucideIcon> = {
  ...UNIVERSE_CATEGORY_ICONS,
  archive: Library,
};

export const UNIVERSE_FALLBACK_ICON = FileArchive;
