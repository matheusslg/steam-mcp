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

export interface PlayerBan {
  SteamId: string;
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
}

export interface GetPlayerBansResponse {
  players: PlayerBan[];
}

export interface Badge {
  badgeid: number;
  level: number;
  completion_time: number;
  xp: number;
  scarcity: number;
  appid?: number;
  communityitemid?: string;
  border_color?: number;
}

export interface GetBadgesResponse {
  response: {
    badges: Badge[];
    player_xp: number;
    player_level: number;
    player_xp_needed_to_level_up: number;
    player_xp_needed_current_level: number;
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

export interface WishlistItem {
  appid: number;
  priority: number;
  date_added: number;
}

export interface GetWishlistResponse {
  response: {
    items: WishlistItem[];
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

export interface ReviewAuthor {
  steamid: string;
  num_games_owned: number;
  num_reviews: number;
  playtime_forever: number;
  playtime_last_two_weeks: number;
  last_played: number;
}

export interface Review {
  recommendationid: string;
  author: ReviewAuthor;
  review: string;
  timestamp_created: number;
  timestamp_updated: number;
  voted_up: boolean;
  votes_up: number;
  votes_funny: number;
  weighted_vote_score: string;
  steam_purchase: boolean;
  received_for_free: boolean;
  written_during_early_access: boolean;
  playtime_at_review?: number;
}

export interface GetGameReviewsResponse {
  success: number;
  query_summary: {
    num_reviews: number;
    review_score: number;
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
  };
  reviews: Review[];
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

export interface GameSchemaAchievement {
  name: string;
  defaultvalue: number;
  displayName: string;
  hidden: number;
  description?: string;
  icon: string;
  icongray: string;
}

export interface GameSchemaStat {
  name: string;
  defaultvalue: number;
  displayName: string;
}

export interface GetGameSchemaResponse {
  game: {
    gameName: string;
    gameVersion: string;
    availableGameStats?: {
      achievements?: GameSchemaAchievement[];
      stats?: GameSchemaStat[];
    };
  };
}

export interface UserStat {
  name: string;
  value: number;
}

export interface UserAchievement {
  name: string;
  achieved: number;
}

export interface GetUserStatsForGameResponse {
  playerstats: {
    steamID: string;
    gameName: string;
    stats?: UserStat[];
    achievements?: UserAchievement[];
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

export interface GetUserGroupsResponse {
  response: {
    success: boolean;
    groups: Array<{ gid: string }>;
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

export interface FeaturedItem {
  id: number;
  name: string;
  discounted: boolean;
  discount_percent: number;
  original_price?: number;
  final_price: number;
  currency: string;
  large_capsule_image: string;
  small_capsule_image: string;
  header_image?: string;
}

export interface FeaturedCategory {
  id: string;
  name: string;
  items: FeaturedItem[];
}

export interface GetFeaturedCategoriesResponse {
  specials: FeaturedCategory;
  coming_soon: FeaturedCategory;
  top_sellers: FeaturedCategory;
  new_releases: FeaturedCategory;
  [key: string]: FeaturedCategory | number | string;
}
