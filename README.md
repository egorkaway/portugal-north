# VeryStays

Travel hubs across the Iberian peninsula — train stations and airports in **Portugal** and **Spain**, with line info, budget stays nearby, live departures, and community ratings.

**Live:** [verystays.com](https://www.verystays.com)

The repo contains the **web app** (Vite + React, deployed on Vercel) and a **native mobile app** in [`mobile/`](mobile/) (Expo SDK 57, iOS-first with widgets and Live Activities).

---

## What it does

### Station directory

**426 hubs** (378 in Portugal, 48 in Spain): name, railway lines, colour-coded service types, coordinates, editorial summaries, and photos.

Each station page includes:

- **Service type badges** — Alfa Pendular, Intercidades, Regional, Urban, Metro, Airport, etc.
- **Live departures** — up to three upcoming trains via CP (Portugal), where a CP station code exists
- **On-time reliability** — score from CP departure statistics (baked into the site; see Rankings)
- **Budget stays nearby** — curated hotels within ~2 km, with Booking.com links
- **Map & booking shortcuts** — Apple Maps, OpenStreetMap, and a pre-filtered Booking search (≤ 2 km, sorted by price)

### Home & filters

- Search by station or line name
- Filter by train type, your vote (up / down / not voted), and visited status
- Sort by distance when location is enabled
- Country scope: Portugal, Spain, or all (`/pt`, `/es`, `/all`)

### Trip tracking

Pick **Take** on a live departure to track your train on the **Trip** tab: countdown, delay updates, downstream stops (via `/api/train-journey`), and trip history. Works on web (PWA) and in the native app (with widget + Live Activity on iOS).

### Rankings

- **Reliability leaderboards** from CP on-time statistics
- **Community votes** — aggregated up/down counts synced to Vercel Blob

### Other pages

| Route | Purpose |
|-------|---------|
| `/map` | Interactive map with reliability-coloured markers |
| `/rankings` | Reliability + community vote leaderboards |
| `/tickets` | How to buy train and metro tickets (PT & ES) |
| `/trip` | Active trip countdown and history |
| `/privacy` | Privacy policy |

The site is a **PWA** (installable, offline-friendly shell) with a mobile bottom nav. UI copy is available in **EN, PT, ES, GL, and CA**.

---

## Native mobile app

Fully native **VeryStays** app — no WebView. See [`mobile/README.md`](mobile/README.md) for setup, Xcode builds, and TestFlight.

| Tab | What it does |
|-----|----------------|
| **Home** | Station list, compact filters, votes, distance sort |
| **Map** | Native map with reliability-coloured markers |
| **Trip** | Active train countdown; syncs to home-screen widget & Live Activity |
| **Rankings** | Reliability (offline) + community votes (online) |
| **Tickets** | Ticket-buying guide with external links |

**Bundle ID:** `com.iberian.travel` · **iOS build:** local via Xcode (no EAS)

```bash
cd mobile
npm install
npm run sync:data
npm run ios:pods
npm run ios:release          # simulator
npm run ios:archive          # TestFlight / App Store
```

---

## Tech stack

### Web

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix) |
| Routing | React Router v6 |
| Data | Static TS/JSON in `src/data/` |
| State | React + cookies/localStorage; TanStack Query for API reads |
| Maps | Leaflet (web) |
| Testing | Vitest + Playwright |
| Hosting | Vercel (serverless API routes + Blob storage) |

### Mobile

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 57 + React Native |
| Routing | Expo Router (tabs + stack) |
| Maps | react-native-maps |
| Widgets | expo-widgets (iOS widget + Live Activity) |
| Data | Bundled JSON synced from `src/data/` via `mobile/scripts/sync-data.mjs` |

---

## Project structure

```
src/
  data/                 # Stations, hotels, images, CP codes, summaries (PT + ES)
  components/           # UI: StationCard, filters, departures board, map, rankings
  pages/                # Index, Station, Map, Trip, Rankings, Tickets, Privacy
  hooks/                # Votes, visited, location, departures, trip
  i18n/                 # EN / PT / ES / GL / CA messages
  lib/                  # Ranking, search, slugs, API helpers
api/
  departures.ts         # CP live departures proxy
  train-journey.ts      # Downstream stops for an active train
  votes.ts              # Community vote sync + global ratings (Vercel Blob)
  mcp.ts                # MCP transport stub
mobile/
  app/                  # Expo Router screens (tabs + station detail)
  components/           # Native StationCard, filters, departures, widgets
  data/                 # Synced bundle (stations, hotels, reliability, …)
  widgets/              # iOS home-screen widget + Live Activity
scripts/                # Build, sitemap, images, CP mapping, departure stats
public/                 # Static assets, sitemap, robots.txt, agent discovery
```

---

## Running locally

### Web

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server serves `/api/departures` locally; use `vercel dev` if you also need Blob vote sync:

```bash
vercel env pull .env.local
vercel dev
```

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright
npm run build         # Production build (prerender, sitemap, markdown export)
```

Set `VITE_SITE_URL` to `https://www.verystays.com` in Vercel (build default).

### Mobile

See [`mobile/README.md`](mobile/README.md).

---

## APIs & storage

| Endpoint | Purpose |
|----------|---------|
| `GET /api/departures` | Live CP departures (credentials fetched server-side from cp.pt) |
| `GET /api/train-journey` | Stops along a train service for trip tracking |
| `GET/POST /api/votes` | Per-browser vote sync; global up/down totals in Vercel Blob |

Votes are stored locally (cookie on web, AsyncStorage on mobile) and optionally synced to Blob. No user accounts.

**Vercel setup:** connect a **Blob** store so `BLOB_READ_WRITE_TOKEN` is available in Production. Without it, only local votes work.

---

## Data

Station and hotel data live in `src/data/` as TypeScript files. CP station codes are in `src/data/cpStationCodes.ts` (regenerate with `node scripts/map-cp-stations.mjs`). Reliability scores are collected offline (`npm run stats:departures`) and published to `public/data/reliability-scores.json`.

After changing web data, refresh the mobile bundle:

```bash
cd mobile && npm run sync:data
```

### Station photos

```bash
node scripts/fetch-station-images.mjs          # missing stations only
node scripts/diversify-station-images.mjs      # fix duplicate Pexels URLs
```

On each Vercel deploy, `refresh-station-images-from-votes.mjs` can replace photos that received enough “not representative” community votes (requires `PEXELS_API_KEY` + Blob). Preview locally with `npm run images:refresh-from-votes:dry`.

---

## Agent & machine-readable surfaces

- **Markdown for agents** — `Accept: text/markdown` returns prerendered markdown (`scripts/prerender-markdown.mjs`)
- **`/.well-known/agent-skills/`** — Agent Skills Discovery index
- **`/.well-known/mcp/server-card.json`** — MCP server card (transport stub at `/api/mcp`)
- **`/.well-known/api-catalog`** — RFC 9727 API catalog
- **`/api/openapi.json`** — OpenAPI 3 description
- **`public/robots.txt`** — Content Signals (`search=yes`, `ai-train=no`, `ai-input=no`)

---

## SEO & prerender

`scripts/prerender-pages.mjs` writes static `index.html` per route under `dist/` (home scopes, rankings, every `/stations/:slug`) so crawlers and link previews get correct titles and Open Graph tags. Runtime navigation uses the same copy via `PageHead` + `react-helmet-async`.
