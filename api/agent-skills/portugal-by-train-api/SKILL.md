---
name: portugal-by-train-api
description: Use the Sustainable Iberian Travel HTTP API for CP live departures, community station/hotel votes, and discovery metadata. Use when integrating agents with verystays.com station data.
---

# Sustainable Iberian Travel API

## Discovery

- API catalog (RFC 9727): `/.well-known/api-catalog`
- OpenAPI: `/api/openapi.json`
- Human docs: `/docs/api`
- MCP server card: `/.well-known/mcp/server-card.json`

Base URL: `https://www.verystays.com/api`

## GET /api/departures

Returns upcoming train departures for a CP station.

| Query | Required | Description |
|-------|----------|-------------|
| `code` | yes | CP travel-api station code (e.g. `94-1008` for Porto São Bento) |
| `limit` | no | Max rows 1–10 (default 3) |

Example: `/api/departures?code=94-1008&limit=3`

## GET /api/votes

Returns aggregated community ratings (stations, hotels, station photos) and hotel closed reports.

Use `?ping=1` for a storage health check without loading vote payloads.

## POST /api/votes

Apply one vote or closed-hotel report per request. Send JSON with exactly one target:

- `station` — station name with `previous` / `next` (`"up"`, `"down"`, or `null`)
- `stationImage` — station name for photo feedback
- `hotelKey` — `"{station}::{hotel name}"`
- `hotelClosed` — same key; `previous` / `next` are booleans

## Station pages

Public HTML station guides live under `/stations/{slug}` (257 CP stops). Slugs are lowercase ASCII derived from station names.

## WebMCP (browser)

When loaded in a [WebMCP](https://webmachinelearning.github.io/webmcp/)-capable browser, the site registers tools via `navigator.modelContext.registerTool()`:

- `search_stations` — find stations by name or line
- `get_station` — station metadata by slug or name
- `get_departures` — live CP departures
- `get_community_rankings` — top voted stations
- `navigate_to_station` — open `/stations/{slug}` in the tab
