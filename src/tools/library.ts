/**
 * Library tools: get_owned_games, get_recently_played_games
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { steamApiRequest } from "../api/client.js";
import { ENDPOINTS } from "../api/endpoints.js";
import { resolveSteamId } from "../config.js";
import type {
  GetOwnedGamesResponse,
  GetRecentlyPlayedGamesResponse,
} from "../types.js";

function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function registerLibraryTools(server: McpServer): void {
  server.registerTool(
    "get_owned_games",
    {
      title: "Get Owned Games",
      description:
        "Get a player's full Steam game library with playtime stats. Can sort by playtime or recently played.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe("64-bit Steam ID. Falls back to STEAM_ID env var."),
        sort_by: z
          .enum(["playtime", "name", "recent"])
          .optional()
          .default("playtime")
          .describe("Sort order: 'playtime' (most played), 'name' (A-Z), or 'recent' (last played). Default: playtime."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(500)
          .optional()
          .default(50)
          .describe("Max games to return (1-500). Default: 50."),
      },
    },
    async ({ steam_id, sort_by, limit }) => {
      const id = resolveSteamId(steam_id);
      const maxResults = limit ?? 50;
      const sortOrder = sort_by ?? "playtime";

      const data = await steamApiRequest<GetOwnedGamesResponse>(
        ENDPOINTS.GET_OWNED_GAMES,
        {
          steamid: id,
          include_appinfo: true,
          include_played_free_games: true,
        }
      );

      let games = data.response.games ?? [];

      if (sortOrder === "playtime") {
        games.sort((a, b) => b.playtime_forever - a.playtime_forever);
      } else if (sortOrder === "name") {
        games.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      } else if (sortOrder === "recent") {
        games.sort((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0));
      }

      games = games.slice(0, maxResults);

      const result = {
        steam_id: id,
        total_games: data.response.game_count,
        showing: games.length,
        games: games.map((g) => ({
          appid: g.appid,
          name: g.name ?? `App ${g.appid}`,
          playtime_total: formatPlaytime(g.playtime_forever),
          playtime_2weeks: g.playtime_2weeks
            ? formatPlaytime(g.playtime_2weeks)
            : null,
          last_played: g.rtime_last_played
            ? new Date(g.rtime_last_played * 1000).toISOString()
            : null,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_recently_played_games",
    {
      title: "Get Recently Played Games",
      description:
        "Get games a player has played in the last two weeks, with playtime breakdown.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe("64-bit Steam ID. Falls back to STEAM_ID env var."),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      const data = await steamApiRequest<GetRecentlyPlayedGamesResponse>(
        ENDPOINTS.GET_RECENTLY_PLAYED_GAMES,
        { steamid: id }
      );

      const games = data.response.games ?? [];

      const result = {
        steam_id: id,
        total_count: data.response.total_count,
        games: games.map((g) => ({
          appid: g.appid,
          name: g.name,
          playtime_2weeks: formatPlaytime(g.playtime_2weeks),
          playtime_total: formatPlaytime(g.playtime_forever),
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
