export type CampaignStatus = 'active' | 'paused' | 'completed';
export type SessionStatus = 'planned' | 'completed' | 'cancelled';
export type NpcDisposition = 'ally' | 'neutral' | 'enemy' | 'unknown';
export type NpcStatus = 'alive' | 'dead' | 'missing';

export interface CampaignRow {
  id: string;
  title: string;
  description: string | null;
  system: string | null;
  cover_image_url: string | null;
  status: CampaignStatus;
  players_count: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRow {
  id: string;
  campaign_id: string;
  title: string;
  session_number: number | null;
  played_at: string | null;
  summary: string;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface NpcRow {
  id: string;
  campaign_id: string;
  name: string;
  role: string | null;
  race: string | null;
  class_type: string | null;
  location: string | null;
  portrait_url: string | null;
  description: string;
  disposition: NpcDisposition;
  status: NpcStatus;
  created_at: string;
  updated_at: string;
}

export interface NoteRow {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: CampaignRow;
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          system?: string | null;
          cover_image_url?: string | null;
          status?: CampaignStatus;
          players_count?: number | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          system?: string | null;
          cover_image_url?: string | null;
          status?: CampaignStatus;
          players_count?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: SessionRow;
        Insert: {
          id?: string;
          campaign_id: string;
          title: string;
          session_number?: number | null;
          played_at?: string | null;
          summary?: string;
          status?: SessionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          session_number?: number | null;
          played_at?: string | null;
          summary?: string;
          status?: SessionStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      npcs: {
        Row: NpcRow;
        Insert: {
          id?: string;
          campaign_id: string;
          name: string;
          role?: string | null;
          race?: string | null;
          class_type?: string | null;
          location?: string | null;
          portrait_url?: string | null;
          description?: string;
          disposition?: NpcDisposition;
          status?: NpcStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          role?: string | null;
          race?: string | null;
          class_type?: string | null;
          location?: string | null;
          portrait_url?: string | null;
          description?: string;
          disposition?: NpcDisposition;
          status?: NpcStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: NoteRow;
        Insert: {
          id?: string;
          campaign_id: string;
          title: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_campaign_owner: {
        Args: { campaign_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
