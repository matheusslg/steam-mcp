/**
 * Achievement tools: get_player_achievements, get_global_achievement_percentages
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { steamApiRequest } from "../api/client.js";
import { ENDPOINTS } from "../api/endpoints.js";
import { resolveSteamId } from "../config.js";
import type {
  GetPlayerAchievementsResponse,
  GetGlobalAchievementPercentagesResponse,
} from "../types.js";

export function registerAchievementTools(server: McpServer): void {
  server.registerTool(
    "get_player_achievements",
    {
      title: "Get Player Achievements",
      description:
        "Get a player's achievement progress for a specific game, including which achievements are unlocked and when.",
      inputSchema: {
        app_id: z.number().int().describe("Steam App ID of the game."),
        steam_id: z
          .string()
          .optional()
          .describe("64-bit Steam ID. Falls back to STEAM_ID env var."),
      },
    },
    async ({ app_id, steam_id }) => {
      const id = resolveSteamId(steam_id);

      let data: GetPlayerAchievementsResponse;
      try {
        data = await steamApiRequest<GetPlayerAchievementsResponse>(
          ENDPOINTS.GET_PLAYER_ACHIEVEMENTS,
          { appid: app_id, steamid: id, l: "english" }
        );
      } catch (err) {
        // Steam returns 400 for games with no achievements or private profiles
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: `Could not fetch achievements for app ${app_id}. The game may have no achievements, or the profile may be private.`,
                details: err instanceof Error ? err.message : String(err),
              }),
            },
          ],
        };
      }

      const stats = data.playerstats;
      const achievements = stats.achievements ?? [];
      const unlocked = achievements.filter((a) => a.achieved === 1);

      const result = {
        steam_id: id,
        game: stats.gameName,
        total_achievements: achievements.length,
        unlocked: unlocked.length,
        completion_percent:
          achievements.length > 0
            ? Math.round((unlocked.length / achievements.length) * 100)
            : 0,
        achievements: achievements.map((a) => ({
          name: a.name ?? a.apiname,
          api_name: a.apiname,
          description: a.description ?? null,
          unlocked: a.achieved === 1,
          unlock_time: a.unlocktime
            ? new Date(a.unlocktime * 1000).toISOString()
            : null,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_global_achievement_percentages",
    {
      title: "Get Global Achievement Percentages",
      description:
        "Get the global unlock percentage for each achievement in a game — how rare each achievement is across all players.",
      inputSchema: {
        app_id: z.number().int().describe("Steam App ID of the game."),
      },
    },
    async ({ app_id }) => {
      const data =
        await steamApiRequest<GetGlobalAchievementPercentagesResponse>(
          ENDPOINTS.GET_GLOBAL_ACHIEVEMENT_PERCENTAGES,
          { gameid: app_id }
        );

      const achievements = data.achievementpercentages.achievements ?? [];

      // Sort by rarest first
      achievements.sort((a, b) => a.percent - b.percent);

      const result = {
        app_id,
        total_achievements: achievements.length,
        achievements: achievements.map((a) => ({
          name: a.name,
          global_percent: Math.round(a.percent * 100) / 100,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
