export const APP_NAME = 'Squire' as const;

export const QUERY_KEYS = {
  campaigns: 'campaigns',
  sessions: 'sessions',
  npcs: 'npcs',
  locations: 'locations',
  factions: 'factions',
  items: 'items',
  quests: 'quests',
  notes: 'notes',
  universes: 'universes',
  universeElements: 'universe-elements',
  universeConnections: 'universe-connections',
  campaignUniverseLinks: 'campaign-universe-links',
} as const;

export const ROUTES = {
  auth: {
    login: '/(auth)/login',
    register: '/(auth)/register',
  },
  app: {
    home: '/(app)/home',
    campaigns: '/(app)/campaigns',
    campaignCreate: '/(app)/campaigns/create',
    universe: '/(app)/universe',
    profile: '/(app)/profile',
    settings: '/(app)/settings',
  },
} as const;
