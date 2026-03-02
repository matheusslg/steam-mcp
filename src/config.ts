/**
 * Environment configuration for Steam MCP Server
 */

export interface Config {
  apiKey: string;
  defaultSteamId?: string;
}

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    throw new Error(
      "STEAM_API_KEY environment variable is required. " +
        "Get one at https://steamcommunity.com/dev/apikey"
    );
  }

  cachedConfig = {
    apiKey,
    defaultSteamId: process.env.STEAM_ID,
  };

  return cachedConfig;
}

/**
 * Resolve a Steam ID from an optional parameter, falling back to the default.
 * Throws if neither is available.
 */
export function resolveSteamId(steamId?: string): string {
  const id = steamId || getConfig().defaultSteamId;
  if (!id) {
    throw new Error(
      "steam_id is required. Either pass it as a parameter or set the STEAM_ID environment variable."
    );
  }
  return id;
}
