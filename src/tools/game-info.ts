/**
 * Game info tools: get_game_details, get_game_news, get_player_count
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { steamApiRequest, storeApiRequest } from "../api/client.js";
import { ENDPOINTS } from "../api/endpoints.js";
import type {
  GameDetails,
  GetNewsResponse,
  GetPlayerCountResponse,
} from "../types.js";

export function registerGameInfoTools(server: McpServer): void {
  server.registerTool(
    "get_game_details",
    {
      title: "Get Game Details",
      description:
        "Get detailed info about a Steam game: price, description, genres, Metacritic score, platforms, release date, and more.",
      inputSchema: {
        app_id: z.number().int().describe("Steam App ID of the game."),
        country_code: z
          .string()
          .length(2)
          .optional()
          .default("US")
          .describe("Two-letter country code for pricing (e.g., 'US', 'BR'). Default: US."),
      },
    },
    async ({ app_id, country_code }) => {
      const cc = country_code ?? "US";

      const data = await storeApiRequest<Record<string, GameDetails>>(
        "appdetails",
        { appids: app_id, cc }
      );

      const entry = data[String(app_id)];
      if (!entry?.success || !entry.data) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: `No data found for App ID ${app_id}` }),
            },
          ],
        };
      }

      const d = entry.data;
      const result = {
        app_id: d.steam_appid,
        name: d.name,
        type: d.type,
        is_free: d.is_free,
        short_description: d.short_description,
        developers: d.developers ?? [],
        publishers: d.publishers ?? [],
        price: d.price_overview
          ? {
              currency: d.price_overview.currency,
              final: d.price_overview.final_formatted,
              initial: d.price_overview.initial_formatted,
              discount_percent: d.price_overview.discount_percent,
            }
          : d.is_free
            ? { currency: cc, final: "Free", initial: "Free", discount_percent: 0 }
            : null,
        metacritic: d.metacritic ?? null,
        genres: d.genres?.map((g) => g.description) ?? [],
        categories: d.categories?.map((c) => c.description) ?? [],
        platforms: d.platforms ?? null,
        release_date: d.release_date ?? null,
        recommendations: d.recommendations?.total ?? null,
        header_image: d.header_image,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.registerTool(
    "get_game_news",
    {
      title: "Get Game News",
      description: "Get recent news articles for a Steam game.",
      inputSchema: {
        app_id: z.number().int().describe("Steam App ID of the game."),
        count: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .default(5)
          .describe("Number of news items to return (1-20). Default: 5."),
        max_length: z
          .number()
          .int()
          .optional()
          .default(500)
          .describe("Max character length for each news body. Default: 500."),
      },
    },
    async ({ app_id, count, max_length }) => {
      const newsCount = count ?? 5;
      const maxLen = max_length ?? 500;

      const data = await steamApiRequest<GetNewsResponse>(
        ENDPOINTS.GET_NEWS_FOR_APP,
        { appid: app_id, count: newsCount, maxlength: maxLen }
      );

      const articles = data.appnews.newsitems.map((item) => ({
        title: item.title,
        url: item.url,
        author: item.author,
        date: new Date(item.date * 1000).toISOString(),
        feed: item.feedlabel,
        contents: item.contents,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ app_id, articles }, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get_player_count",
    {
      title: "Get Current Player Count",
      description:
        "Get the number of players currently online for a specific Steam game.",
      inputSchema: {
        app_id: z.number().int().describe("Steam App ID of the game."),
      },
    },
    async ({ app_id }) => {
      const data = await steamApiRequest<GetPlayerCountResponse>(
        ENDPOINTS.GET_CURRENT_PLAYERS,
        { appid: app_id }
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                app_id,
                current_players: data.response.player_count,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
