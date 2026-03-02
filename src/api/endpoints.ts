/**
 * Steam API endpoint constants
 */

export const STEAM_API_BASE = "https://api.steampowered.com";
export const STEAM_STORE_BASE = "https://store.steampowered.com/api";

export interface SteamEndpoint {
  interface: string;
  method: string;
  version: number;
}

/**
 * Build a full URL from an endpoint tuple.
 * e.g. { interface: "ISteamUser", method: "GetPlayerSummaries", version: 2 }
 *   => "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/"
 */
export function buildEndpointUrl(endpoint: SteamEndpoint): string {
  return `${STEAM_API_BASE}/${endpoint.interface}/${endpoint.method}/v${endpoint.version}/`;
}

export const ENDPOINTS = {
  GET_PLAYER_SUMMARIES: {
    interface: "ISteamUser",
    method: "GetPlayerSummaries",
    version: 2,
  },
  GET_STEAM_LEVEL: {
    interface: "IPlayerService",
    method: "GetSteamLevel",
    version: 1,
  },
  RESOLVE_VANITY_URL: {
    interface: "ISteamUser",
    method: "ResolveVanityURL",
    version: 1,
  },
  GET_OWNED_GAMES: {
    interface: "IPlayerService",
    method: "GetOwnedGames",
    version: 1,
  },
  GET_RECENTLY_PLAYED_GAMES: {
    interface: "IPlayerService",
    method: "GetRecentlyPlayedGames",
    version: 1,
  },
  GET_NEWS_FOR_APP: {
    interface: "ISteamNews",
    method: "GetNewsForApp",
    version: 2,
  },
  GET_CURRENT_PLAYERS: {
    interface: "ISteamUserStats",
    method: "GetNumberOfCurrentPlayers",
    version: 1,
  },
  GET_PLAYER_ACHIEVEMENTS: {
    interface: "ISteamUserStats",
    method: "GetPlayerAchievements",
    version: 1,
  },
  GET_GLOBAL_ACHIEVEMENT_PERCENTAGES: {
    interface: "ISteamUserStats",
    method: "GetGlobalAchievementPercentagesForApp",
    version: 2,
  },
  GET_FRIEND_LIST: {
    interface: "ISteamUser",
    method: "GetFriendList",
    version: 1,
  },
  GET_PLAYER_BANS: {
    interface: "ISteamUser",
    method: "GetPlayerBans",
    version: 1,
  },
  GET_BADGES: {
    interface: "IPlayerService",
    method: "GetBadges",
    version: 1,
  },
  GET_WISHLIST: {
    interface: "IWishlistService",
    method: "GetWishlist",
    version: 1,
  },
  GET_SCHEMA_FOR_GAME: {
    interface: "ISteamUserStats",
    method: "GetSchemaForGame",
    version: 2,
  },
  GET_USER_STATS: {
    interface: "ISteamUserStats",
    method: "GetUserStatsForGame",
    version: 2,
  },
  GET_USER_GROUPS: {
    interface: "ISteamUser",
    method: "GetUserGroupList",
    version: 1,
  },
} as const;
