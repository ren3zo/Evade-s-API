export interface EvadeResponse {
  success: boolean;
  data: EvadeData;
}

export interface EvadeData {
  spotify?: SpotifyData;
  discord_user: DiscordUser;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  listening_to_spotify: boolean;
  kv: Record<string, any>;
  location?: string;
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  // Note: Lanyard doesn't include flags, bot, banner, accent_color, global_name, etc.
  // These are optional for compatibility
  flags?: number;
  bot?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  global_name?: string | null;
  avatar_decoration_data?: any;
  display_name?: string | null;
  display_name_global?: string | null;
  guild_tag?: string;
}

export interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

export interface Activity {
  type: number;
  state: string;
  name: string;
  id: string;
  created_at: number;
  timestamps?: {
    start: number;
    end?: number;
  };
  session_id?: string;
  details?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  party?: {
    id: string;
  };
  flags?: number;
  application_id?: string;
  sync_id?: string;
  // Optional fields for compatibility
  emoji?: {
    id: string;
    name: string;
    animated: boolean;
  };
  buttons?: string[];
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
} 