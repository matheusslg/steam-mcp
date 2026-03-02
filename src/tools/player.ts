/**
 * Player-related tools: get_player_summary, get_steam_level, resolve_vanity_url
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { steamApiRequest } from "../api/client.js";
import { ENDPOINTS } from "../api/endpoints.js";
import { resolveSteamId } from "../config.js";
import type {
  GetPlayerSummariesResponse,
  GetSteamLevelResponse,
  ResolveVanityURLResponse,
  GetPlayerBansResponse,
  GetBadgesResponse,
} from "../types.js";

const PERSONA_STATES: Record<number, string> = {
  0: "Offline",
  1: "Online",
  2: "Busy",
  3: "Away",
  4: "Snooze",
  5: "Looking to trade",
  6: "Looking to play",
};

export function registerPlayerTools(server: McpServer): void {
  server.registerTool(
    "get_player_summary",
    {
      title: "Get Player Summary",
      description:
        "Get a Steam player's profile info: display name, avatar, online status, currently playing game, account creation date, and more.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe(
            "64-bit Steam ID. Falls back to STEAM_ID env var if not provided."
          ),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      const data = await steamApiRequest<GetPlayerSummariesResponse>(
        ENDPOINTS.GET_PLAYER_SUMMARIES,
        { steamids: id }
      );

      const player = data.response.players[0];
      if (!player) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: `No player found for Steam ID: ${id}` }),
            },
          ],
        };
      }

      const result = {
        steam_id: player.steamid,
        name: player.personaname,
        real_name: player.realname ?? null,
        profile_url: player.profileurl,
        avatar: player.avatarfull,
        status: PERSONA_STATES[player.personastate] ?? "Unknown",
        currently_playing: player.gameextrainfo ?? null,
        current_game_id: player.gameid ?? null,
        last_logoff: player.lastlogoff
          ? new Date(player.lastlogoff * 1000).toISOString()
          : null,
        account_created: player.timecreated
          ? new Date(player.timecreated * 1000).toISOString()
          : null,
        country: player.loccountrycode ?? null,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_steam_level",
    {
      title: "Get Steam Level",
      description: "Get a player's Steam account level.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe(
            "64-bit Steam ID. Falls back to STEAM_ID env var if not provided."
          ),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      const data = await steamApiRequest<GetSteamLevelResponse>(
        ENDPOINTS.GET_STEAM_LEVEL,
        { steamid: id }
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { steam_id: id, level: data.response.player_level },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "resolve_vanity_url",
    {
      title: "Resolve Vanity URL",
      description:
        "Convert a Steam custom URL (vanity name) to a 64-bit Steam ID. For example, 'gabelogannewell' => '76561197960287930'.",
      inputSchema: {
        vanity_url: z
          .string()
          .describe(
            "The custom URL portion of a Steam profile (e.g., 'gabelogannewell' from steamcommunity.com/id/gabelogannewell)."
          ),
      },
    },
    async ({ vanity_url }) => {
      const data = await steamApiRequest<ResolveVanityURLResponse>(
        ENDPOINTS.RESOLVE_VANITY_URL,
        { vanityurl: vanity_url }
      );

      if (data.response.success !== 1) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: `Could not resolve vanity URL '${vanity_url}': ${data.response.message ?? "not found"}`,
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { vanity_url, steam_id: data.response.steamid },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get_player_bans",
    {
      title: "Get Player Bans",
      description:
        "Check a player's ban status — VAC bans, game bans, community ban, trade ban.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe(
            "64-bit Steam ID. Falls back to STEAM_ID env var if not provided."
          ),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      const data = await steamApiRequest<GetPlayerBansResponse>(
        ENDPOINTS.GET_PLAYER_BANS,
        { steamids: id }
      );

      const player = data.players[0];
      if (!player) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: `No ban data found for Steam ID: ${id}` }),
            },
          ],
        };
      }

      const result = {
        steam_id: player.SteamId,
        vac_banned: player.VACBanned,
        number_of_vac_bans: player.NumberOfVACBans,
        days_since_last_ban: player.DaysSinceLastBan,
        number_of_game_bans: player.NumberOfGameBans,
        community_banned: player.CommunityBanned,
        economy_ban: player.EconomyBan,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_badges",
    {
      title: "Get Badges",
      description:
        "Get a player's badge collection with XP breakdown, player level, and XP needed for next level.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe(
            "64-bit Steam ID. Falls back to STEAM_ID env var if not provided."
          ),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      const data = await steamApiRequest<GetBadgesResponse>(
        ENDPOINTS.GET_BADGES,
        { steamid: id }
      );

      const resp = data.response;
      const badges = resp.badges ?? [];

      const result = {
        steam_id: id,
        player_level: resp.player_level,
        player_xp: resp.player_xp,
        xp_needed_to_level_up: resp.player_xp_needed_to_level_up,
        total_badges: badges.length,
        badges: badges.map((b) => ({
          badge_id: b.badgeid,
          app_id: b.appid ?? null,
          level: b.level,
          xp: b.xp,
          completion_time: new Date(b.completion_time * 1000).toISOString(),
          scarcity: b.scarcity,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
