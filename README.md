# Portugal by Train

A static reference guide to major train stations across Portugal, from the Minho to the Algarve, with recommended budget hotels within walking distance of key stops.

Live: **[verystays.com](https://www.verystays.com)**

Set `VITE_SITE_URL` to `https://www.verystays.com` in Vercel environment variables (this is also the build default).

---

## What it does

Each station card shows:

- **Station name & railway line(s):** Alfa Pendular, Intercidades, Regional, Urban, or historic/inactive
- **Service type badges:** colour-coded so you can tell at a glance what stops where
- **Map links:** one-click to Apple Maps and OpenStreetMap, pinned to the station's coordinates
- **Budget hotels nearby:** up to three recommended options within 2 km, with price-from and a direct Booking.com link
- **"More on Booking" shortcut:** opens a pre-filtered Booking.com search (≤ 2 km radius, sorted by price) for the selected station

### Filtering & search

The sticky toolbar lets you:

- **Search** by station name or line name
- **Filter by service type** (Alfa Pendular, Intercidades, Regional, Urban, Inactive / Historic)
- **Filter by your vote:** see only stations you've upvoted, downvoted, or haven't rated yet

### Private voting

Each station has a thumbs-up / thumbs-down toggle. Your choice is stored in a first-party cookie (`station_votes`) that lasts one year. No account is required. The vote filter in the toolbar lets you quickly pull up your favourites.

When you vote, the change is also sent to `/api/votes`, which updates aggregate up/down counts in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (no database, no per-user log). All community totals live in one `community-votes.json` blob; reads use `get()` only (not `list()`, which counts as an [Advanced Operation](https://vercel.com/docs/vercel-blob)). Use `useGlobalStationRatings()` or `useGlobalImageRatings()` to read community totals.

### Content Signals

`public/robots.txt` declares [Content Signals](https://contentsignals.org/) preferences: search indexing allowed (`search=yes`), AI training and AI input disallowed (`ai-train=no`, `ai-input=no`).

### Markdown for Agents

Requests with `Accept: text/markdown` receive a markdown representation of each prerendered page (`Content-Type: text/markdown`, `Vary: Accept`, `x-markdown-tokens`). HTML remains the default for browsers. Markdown files are generated at build time (`scripts/prerender-markdown.mjs`); `middleware.ts` serves them on Vercel.

### Agent discovery

`/.well-known/agent-skills/index.json` publishes an [Agent Skills Discovery](https://github.com/cloudflare/agent-skills-discovery-rfc) v0.2.0 index (`$schema`, `skills[]` with `name`, `type`, `description`, `url`, `digest`). Skill sources live in `api/agent-skills/`; run `node scripts/sync-discovery-public.mjs` to refresh `public/.well-known/`.

`/.well-known/mcp/server-card.json` publishes an [MCP Server Card](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127) (SEP-1649) with `serverInfo`, Streamable HTTP `transport` (`/api/mcp`), and `capabilities` (tools/resources/prompts surfaces declared, not yet implemented).

The homepage response includes [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) `Link` headers (via `vercel.json`) pointing to:

- `/.well-known/api-catalog` — [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) API catalog (`application/linkset+json`), built into `public/.well-known/api-catalog` at deploy time with `service-desc`, `service-doc`, and `status` links
- `/docs/api` — human-readable API notes (`rel="service-doc"`)
- `/api/openapi.json` — OpenAPI 3 description (`rel="describedby"`)

### Page titles & SEO

Each route has its own `<title>`, meta description, canonical URL, and Open Graph tags. At build time, `scripts/prerender-pages.mjs` writes a static `index.html` per URL under `dist/` (home, rankings, every `/stations/:slug` page) so crawlers, link previews, and “View Source” see the correct metadata—not only the homepage defaults. Runtime navigation uses the same copy via `PageHead` + `react-helmet-async`.

### Next departures

Station pages show up to three upcoming trains via **`GET /api/departures`**, a Vercel serverless route that proxies the CP travel API. Credentials are read from [cp.pt/fe-config.json](https://www.cp.pt/fe-config.json) on the server (cached ~45 minutes), so you do **not** need `VITE_CP_*` in production. Station → CP code mapping lives in `src/data/cpStationCodes.ts` (`node scripts/map-cp-stations.mjs` to regenerate). For local `npm run dev`, the Vite dev server serves the same `/api/departures` route; use `vercel dev` if you also need Blob vote sync.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v3 |
| Component primitives | Radix UI + shadcn/ui |
| Routing | React Router v6 |
| Data | Static TypeScript files in `src/data/` |
| State | React state + cookie-backed pub/sub for votes; global counts via Vercel Blob |
| Testing | Vitest (unit) + Playwright (e2e) |

---

## Project structure

```
src/
  data/
    stations.ts        # ~130 stations: name, lines, service types, lat/lng
    hotels.ts          # Budget hotel entries keyed by station name
    stationImages.ts   # Station photo URLs keyed by station name
  components/
    StationCard.tsx    # Card UI: image, badges, map links, hotel list, vote buttons
  hooks/
    useStationVote.ts           # Cookie-backed vote store with React useSyncExternalStore
    useGlobalStationRatings.ts  # Fetches aggregated up/down counts from /api/votes
  lib/
    votesApi.ts                 # Client helpers for vote sync and global ratings
  pages/
    Index.tsx          # Main page: hero, filter bar, station grid, footer
api/
  votes.ts                      # API route: POST sync, GET global ratings (Vercel Blob)
  departures.ts                 # API route: CP live departures proxy
  mcp.ts                        # API route: MCP transport stub (501)
server/lib/                     # Shared server code (not deployed as functions)
public/
  og-image.jpg         # Social preview image (1200×630)
  logo.png             # Square logo for structured data (512×512)
  sitemap.xml          # generated: home, /rankings, all /stations/* (vite build or npm run sitemap)
  robots.txt
  llms.txt             # AI crawler summary
```

---

## Running locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

For local testing of vote sync and global ratings, use [Vercel CLI](https://vercel.com/docs/cli) with Blob env vars in `.env.local`:

```bash
vercel env pull .env.local
vercel dev
```

```bash
npm test          # unit tests (Vitest)
npm run build     # production build
```

### Global vote storage on Vercel

1. Deploy to [Vercel](https://vercel.com).
2. Open **portugal-north** → **Storage** → create/connect a **Blob** store to this project.
3. Confirm **Production** has `BLOB_READ_WRITE_TOKEN`, then **redeploy**.

Without Blob configured, the site still works; only per-browser cookie votes are kept.

---

## Data

All station and hotel data lives in plain TypeScript files. No database, no API calls at runtime. To add a station, append an entry to `src/data/stations.ts`:

```ts
{ name: "Minha Estação", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.123, lng: -8.456 }
```

Hotel entries go in `src/data/hotels.ts`, keyed by the exact station name string.

### Station photos

Photos are filled from Wikimedia (preferred) and Pexels. Set `PEXELS_API_KEY` in `.env`, then:

```bash
node scripts/fetch-station-images.mjs          # missing stations only
node scripts/diversify-station-images.mjs      # fix duplicate Pexels URLs
```

The fetch logic uses region/line-specific train search terms first, then falls back to **location-only** queries (e.g. “Braga Portugal”, “Douro Portugal landscape”) when a unique station photo cannot be found.

#### Community-driven photo refresh (on deploy)

On each **Vercel deploy**, the build runs `refresh-station-images-from-votes.mjs --build` before Vite:

1. Reads photo vote totals and rejected-URL history from **Vercel Blob** (same store as community votes).
2. For any station with **≥ 3** “not representative” votes, fetches a new Wikimedia/Pexels image (never reusing rejected URLs).
3. Writes the new URLs into `src/data/stationImages.ts` (bundled into the site on that deploy).
4. Clears vote counters for those stations so users can rate the new photo.

**Vercel env vars** (Production + Preview): `PEXELS_API_KEY`, `BLOB_READ_WRITE_TOKEN` (already used for votes). If either is missing, the step is skipped and the build continues.

Optional: `IMAGE_REFRESH_MAX_PER_BUILD=5` (default) limits how many stations refresh per deploy to keep builds fast.

Local preview: `npm run images:refresh-from-votes:dry`
