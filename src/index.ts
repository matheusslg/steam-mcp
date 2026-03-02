#!/usr/bin/env node
/**
 * Steam MCP Server
 *
 * MCP Server for Steam Web API — player profiles, game library,
 * achievements, news, friend lists, and store search.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPlayerTools } from "./tools/player.js";
import { registerLibraryTools } from "./tools/library.js";
import { registerGameInfoTools } from "./tools/game-info.js";
import { registerAchievementTools } from "./tools/achievements.js";
import { registerSocialTools } from "./tools/social.js";
import { registerDiscoveryTools } from "./tools/discovery.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "steam",
    version: "1.0.0",
  });

  registerPlayerTools(server);
  registerLibraryTools(server);
  registerGameInfoTools(server);
  registerAchievementTools(server);
  registerSocialTools(server);
  registerDiscoveryTools(server);

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await server.close();
    process.exit(0);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    process.exit(1);
  });

  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start Steam MCP Server:", error);
  process.exit(1);
});
