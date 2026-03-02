/**
 * Steam API response interfaces
 */

// --- Player ---

export interface PlayerSummary {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  lastlogoff?: number;
  timecreated?: number;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
  gameextrainfo?: string;
  gameid?: string;
  realname?: string;
}

export interface GetPlayerSummariesResponse {
  response: {
    players: PlayerSummary[];
  };
}

export interface GetSteamLevelResponse {
  response: {
    player_level: number;
  };
}

export interface ResolveVanityURLResponse {
  response: {
    steamid?: string;
    success: number;
    message?: string;
  };
}

// --- Library ---

export interface OwnedGame {
  appid: number;
  name?: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
  has_community_visible_stats?: boolean;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
  rtime_last_played?: number;
}

export interface GetOwnedGamesResponse {
  response: {
    game_count: number;
    games: OwnedGame[];
  };
}

export interface RecentlyPlayedGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
}

export interface GetRecentlyPlayedGamesResponse {
  response: {
    total_count: number;
    games: RecentlyPlayedGame[];
  };
}

// --- Game Info ---

export interface GameDetails {
  success: boolean;
  data?: {
    type: string;
    name: string;
    steam_appid: number;
    is_free: boolean;
    short_description: string;
    header_image: string;
    developers?: string[];
    publishers?: string[];
    price_overview?: {
      currency: string;
      initial: number;
      final: number;
      discount_percent: number;
      initial_formatted: string;
      final_formatted: string;
    };
    metacritic?: {
      score: number;
      url: string;
    };
    categories?: Array<{ id: number; description: string }>;
    genres?: Array<{ id: string; description: string }>;
    release_date?: {
      coming_soon: boolean;
      date: string;
    };
    recommendations?: {
      total: number;
    };
    platforms?: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
    };
  };
}

export interface NewsItem {
  gid: string;
  title: string;
  url: string;
  author: string;
  contents: string;
  feedlabel: string;
  date: number;
  feedname: string;
}

export interface GetNewsResponse {
  appnews: {
    appid: number;
    newsitems: NewsItem[];
  };
}

export interface GetPlayerCountResponse {
  response: {
    player_count: number;
    result: number;
  };
}

// --- Achievements ---

export interface PlayerAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
  name?: string;
  description?: string;
}

export interface GetPlayerAchievementsResponse {
  playerstats: {
    steamID: string;
    gameName: string;
    achievements: PlayerAchievement[];
    success: boolean;
  };
}

export interface GlobalAchievement {
  name: string;
  percent: number;
}

export interface GetGlobalAchievementPercentagesResponse {
  achievementpercentages: {
    achievements: GlobalAchievement[];
  };
}

// --- Social ---

export interface Friend {
  steamid: string;
  relationship: string;
  friend_since: number;
}

export interface GetFriendListResponse {
  friendslist: {
    friends: Friend[];
  };
}

// --- Discovery ---

export interface StoreSearchItem {
  id: number;
  name: string;
  tiny_image: string;
  price?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
  };
  metascore?: string;
}

export interface StoreSearchResponse {
  total: number;
  items: StoreSearchItem[];
}
