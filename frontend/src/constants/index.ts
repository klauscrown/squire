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
    profile: '/(app)/profile',
    settings: '/(app)/settings',
  },
} as const;
