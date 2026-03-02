/**
 * Discovery tools: search_apps
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { storeApiRequest } from "../api/client.js";
import type { StoreSearchResponse } from "../types.js";

export function registerDiscoveryTools(server: McpServer): void {
  server.registerTool(
    "search_apps",
    {
      title: "Search Steam Apps",
      description:
        "Search the Steam store by game name. Returns matching apps with App IDs, prices, and Metascores.",
      inputSchema: {
        query: z.string().describe("Search term (game name or keyword)."),
        count: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .default(10)
          .describe("Max results to return (1-50). Default: 10."),
      },
    },
    async ({ query, count }) => {
      const maxResults = count ?? 10;

      const data = await storeApiRequest<StoreSearchResponse>("storesearch", {
        term: query,
        l: "english",
        cc: "US",
      });

      const items = (data.items ?? []).slice(0, maxResults);

      const result = {
        query,
        total_results: data.total,
        showing: items.length,
        apps: items.map((item) => ({
          app_id: item.id,
          name: item.name,
          price: item.price
            ? {
                final: `$${(item.price.final / 100).toFixed(2)}`,
                discount_percent: item.price.discount_percent,
              }
            : { final: "Free", discount_percent: 0 },
          metascore: item.metascore ?? null,
        })),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
