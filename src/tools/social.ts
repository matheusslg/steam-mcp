/**
 * Social tools: get_friends_list
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { steamApiRequest } from "../api/client.js";
import { ENDPOINTS } from "../api/endpoints.js";
import { resolveSteamId } from "../config.js";
import type { GetFriendListResponse, GetUserGroupsResponse } from "../types.js";

export function registerSocialTools(server: McpServer): void {
  server.registerTool(
    "get_friends_list",
    {
      title: "Get Friends List",
      description:
        "Get a player's Steam friends list with friendship dates. Requires public profile.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe("64-bit Steam ID. Falls back to STEAM_ID env var."),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      let data: GetFriendListResponse;
      try {
        data = await steamApiRequest<GetFriendListResponse>(
          ENDPOINTS.GET_FRIEND_LIST,
          { steamid: id, relationship: "friend" }
        );
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: `Could not fetch friends list. The profile may be private.`,
                details: err instanceof Error ? err.message : String(err),
              }),
            },
          ],
        };
      }

      const friends = data.friendslist.friends ?? [];

      const result = {
        steam_id: id,
        total_friends: friends.length,
        friends: friends.map((f) => ({
          steam_id: f.steamid,
          friend_since: new Date(f.friend_since * 1000).toISOString(),
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_user_groups",
    {
      title: "Get User Groups",
      description:
        "Get a list of Steam group IDs a player belongs to. Requires public profile.",
      inputSchema: {
        steam_id: z
          .string()
          .optional()
          .describe("64-bit Steam ID. Falls back to STEAM_ID env var."),
      },
    },
    async ({ steam_id }) => {
      const id = resolveSteamId(steam_id);

      let data: GetUserGroupsResponse;
      try {
        data = await steamApiRequest<GetUserGroupsResponse>(
          ENDPOINTS.GET_USER_GROUPS,
          { steamid: id }
        );
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "Could not fetch groups. The profile may be private.",
                details: err instanceof Error ? err.message : String(err),
              }),
            },
          ],
        };
      }

      const groups = data.response.groups ?? [];

      const result = {
        steam_id: id,
        total_groups: groups.length,
        groups: groups.map((g) => ({ group_id: g.gid })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
