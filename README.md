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

When you vote, the change is also sent to `/api/votes`, which updates aggregate up/down counts in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (no database, no per-user log). Station votes use `station-votes.json`; photo feedback (“Does this photo represent…?”) uses `station-image-votes.json`. Use `useGlobalStationRatings()` or `useGlobalImageRatings()` to read community totals.

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
api/
  votes.ts                      # API route: POST sync, GET global ratings (Vercel Blob)
  pages/
    Index.tsx          # Main page: hero, filter bar, station grid, footer
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
