# Steam MCP Server

MCP Server for the Steam Web API — access player profiles, game libraries, achievements, news, friend lists, and store search through Claude.

## Overview

This [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server connects Claude to the Steam Web API, providing **12 tools** across 6 modules:

- **Player** — profiles, levels, vanity URL resolution
- **Library** — owned games, recently played
- **Game Info** — store details, news, live player counts
- **Achievements** — player progress, global unlock percentages
- **Social** — friends list
- **Discovery** — Steam store search

## Requirements

- **Node.js** 20+
- **Steam Web API Key** — get one at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)

## Quick Start

```bash
# Clone
git clone https://github.com/matheusslg/steam-mcp.git
cd steam-mcp

# Install & build
npm install
npm run build

# Add to Claude Code
claude mcp add steam -e STEAM_API_KEY=your_key_here -- node /absolute/path/to/steam-mcp/dist/index.js
```

Or add it manually to your MCP config:

```json
{
  "mcpServers": {
    "steam": {
      "command": "node",
      "args": ["/absolute/path/to/steam-mcp/dist/index.js"],
      "env": {
        "STEAM_API_KEY": "your_key_here",
        "STEAM_ID": "76561198000000000"
      }
    }
  }
}
```

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `STEAM_API_KEY` | Yes | Your Steam Web API key |
| `STEAM_ID` | No | Default 64-bit Steam ID (used when `steam_id` parameter is omitted) |

## Available Tools

### Player

| Tool | Description |
|------|-------------|
| `get_player_summary` | Profile info — display name, avatar, online status, current game, account age |
| `get_steam_level` | Account level for a player |
| `resolve_vanity_url` | Convert a custom profile URL to a 64-bit Steam ID |

### Library

| Tool | Description |
|------|-------------|
| `get_owned_games` | Full game library with playtime — sortable by playtime, name, or recent |
| `get_recently_played_games` | Games played in the last two weeks with playtime breakdown |

### Game Info

| Tool | Description |
|------|-------------|
| `get_game_details` | Store page data — price, genres, Metacritic, platforms, release date |
| `get_game_news` | Recent news articles for a game |
| `get_player_count` | Current number of online players for a game |

### Achievements

| Tool | Description |
|------|-------------|
| `get_player_achievements` | A player's achievement progress for a specific game |
| `get_global_achievement_percentages` | Global unlock rates — how rare each achievement is |

### Social

| Tool | Description |
|------|-------------|
| `get_friends_list` | A player's friends list with friendship dates |

### Discovery

| Tool | Description |
|------|-------------|
| `search_apps` | Search the Steam store by name — returns App IDs, prices, and Metascores |

## Usage Examples

```
"What's my Steam profile info?"
"Show me my top 10 most played games"
"What games have I played this week?"
"How many people are playing Counter-Strike 2 right now?"
"Look up the game details for Elden Ring"
"What are the rarest achievements in Hades?"
"Show me my achievement progress in Hollow Knight"
"Get the latest news for Dota 2"
"Search Steam for games called Celeste"
"Who's on my friends list?"
"What's the Steam ID for gabelogannewell?"
```

## Project Structure

```
steam-mcp/
├── src/
│   ├── index.ts              # Server entry point
│   ├── config.ts             # Environment config & Steam ID resolution
│   ├── types.ts              # Steam API response interfaces
│   ├── api/
│   │   ├── client.ts         # HTTP client with retry logic
│   │   └── endpoints.ts      # Steam API endpoint constants
│   └── tools/
│       ├── player.ts         # get_player_summary, get_steam_level, resolve_vanity_url
│       ├── library.ts        # get_owned_games, get_recently_played_games
│       ├── game-info.ts      # get_game_details, get_game_news, get_player_count
│       ├── achievements.ts   # get_player_achievements, get_global_achievement_percentages
│       ├── social.ts         # get_friends_list
│       └── discovery.ts      # search_apps
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## Development

```bash
npm run build       # Compile TypeScript
npm run dev         # Watch mode
npm run start       # Run the server
npm run clean       # Remove dist/
```

## License

MIT
