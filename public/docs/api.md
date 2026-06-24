# Sustainable Iberian Travel — HTTP API

Machine-readable description: [OpenAPI 3](/api/openapi.json). API catalog (RFC 9727): [/.well-known/api-catalog](/.well-known/api-catalog).

Base URL: `https://www.verystays.com/api`

## GET /api/departures

Returns up to three upcoming train departures for a CP station.

| Query | Required | Description |
|-------|----------|-------------|
| `code` | yes | CP travel-api station code (see `src/data/cpStationCodes.ts`) |
| `limit` | no | Max rows (1–10, default 3) |

Example: `/api/departures?code=94-1008&limit=3`

## GET /api/votes

Returns aggregated community vote totals (stations, hotels, station photos) and hotel closed reports.

Optional `?ping=1` returns storage configuration status without reading vote data.

## POST /api/votes

Applies a single vote or closed-hotel report change. Send JSON with exactly one target field:

- `station` — station name + `previous` / `next` (`"up"`, `"down"`, or `null`)
- `stationImage` — station name for photo feedback
- `hotelKey` — `"{station}::{hotel name}"`
- `hotelClosed` — same key format; `previous` / `next` are booleans

Requires `BLOB_READ_WRITE_TOKEN` on the deployment for persistence.
