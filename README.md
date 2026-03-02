# Steam MCP Server

MCP Server for the Steam Web API — access player profiles, game libraries, achievements, news, friend lists, and store search through Claude.

## Overview

This [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server connects Claude to the Steam Web API, providing **20 tools** across 6 modules:

- **Player** — profiles, levels, vanity URL resolution, bans, badges
- **Library** — owned games, recently played, wishlist
- **Game Info** — store details, news, live player counts, reviews
- **Achievements** — player progress, global unlock percentages, game schema, per-game stats
- **Social** — friends list, group memberships
- **Discovery** — Steam store search, featured games & sales

## Requirements

- **Node.js** 20+
- **Steam Web API Key** — get one at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)

## Installation

Just ask Claude to install this MCP server using the repo URL:

```
Install the MCP server from https://github.com/matheusslg/steam-mcp
```

Claude will handle cloning, building, and configuring it for you.

## Quick Start (Manual)

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
        "STEAM_ID": "your_steam_id_here"
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
| `get_player_bans` | Check VAC ban, game ban, community ban, and trade ban status |
| `get_badges` | Badge collection with XP breakdown, player level, and XP to next level |

### Library

| Tool | Description |
|------|-------------|
| `get_owned_games` | Full game library with playtime — sortable by playtime, name, or recent |
| `get_recently_played_games` | Games played in the last two weeks with playtime breakdown |
| `get_wishlist` | A player's Steam wishlist (depends on privacy settings) |

### Game Info

| Tool | Description |
|------|-------------|
| `get_game_details` | Store page data — price, genres, Metacritic, platforms, release date |
| `get_game_news` | Recent news articles for a game |
| `get_player_count` | Current number of online players for a game |
| `get_game_reviews` | Reviews with sentiment summary (score, positive/negative) and review text |

### Achievements

| Tool | Description |
|------|-------------|
| `get_player_achievements` | A player's achievement progress for a specific game |
| `get_global_achievement_percentages` | Global unlock rates — how rare each achievement is |
| `get_game_schema` | Full list of stats and achievements with display names, descriptions, icons |
| `get_user_stats_for_game` | A player's per-game stats (kills, wins, etc.) — varies per game |

### Social

| Tool | Description |
|------|-------------|
| `get_friends_list` | A player's friends list with friendship dates |
| `get_user_groups` | Steam group IDs a player belongs to |

### Discovery

| Tool | Description |
|------|-------------|
| `search_apps` | Search the Steam store by name — returns App IDs, prices, and Metascores |
| `get_featured_games` | Featured store categories: sales, top sellers, new releases, coming soon |

## Usage Examples

Just ask Claude naturally — it will combine tools as needed.

### Game Library Analysis

```
"How much is my Steam library worth?"
"Show me my shame list — games I own but have 0 hours played"
"What am I actually playing? Show me my last two weeks"
```

### Achievement Hunting

```
"What are my rarest achievements? Find ones less than 5% of players have"
"Which games am I closest to 100% completion on?"
"Give me an achievement difficulty report for Elden Ring"
```

### Social / Friends

```
"What are my friends playing right now?"
"Compare my game library with my friend's — what do we both own?"
"Rank my friends by Steam level"
"Who's the OG? Rank my friends by account creation date"
```

### Game Intel

```
"Is Battlefield 2042 alive? Check the player count"
"Get me a news digest for the games I've played recently"
"Look up Celeste on Steam — price, reviews, the works"
```

### Bans & Trust

```
"Is this player legit? Check their VAC ban history"
"How many bans does player X have?"
```

### Wishlist & Reviews

```
"What's on my Steam wishlist?"
"Show me the reviews for Elden Ring — what are people saying?"
"What's the review score for Cyberpunk 2077?"
```

### Store & Sales

```
"What's on sale on Steam right now?"
"Show me the top sellers and new releases on Steam"
```

### Game Stats

```
"Show me my Counter-Strike stats — kills, deaths, wins"
"What are all the possible achievements for Hades?"
```

### Fun Stats

```
"Roast my Steam profile — age, level, games owned vs played, hours wasted"
"What games define my friend group? Most commonly owned games across all my friends"
"Give me my Counter-Strike addiction report"
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
│       ├── player.ts         # get_player_summary, get_steam_level, resolve_vanity_url, get_player_bans, get_badges
│       ├── library.ts        # get_owned_games, get_recently_played_games, get_wishlist
│       ├── game-info.ts      # get_game_details, get_game_news, get_player_count, get_game_reviews
│       ├── achievements.ts   # get_player_achievements, get_global_achievement_percentages, get_game_schema, get_user_stats_for_game
│       ├── social.ts         # get_friends_list, get_user_groups
│       └── discovery.ts      # search_apps, get_featured_games
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
