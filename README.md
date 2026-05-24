# Portugal by Train

A static reference guide to train stations across Portugal — from the Minho to the Algarve — with maps and hand-picked budget hotels within walking distance of each stop.

Live: **[portugal-north.lovable.app](https://portugal-north.lovable.app)**

---

## What it does

Each station card shows:

- **Station name & railway line(s)** — Alfa Pendular, Intercidades, Regional, Urban, or historic/inactive
- **Service type badges** — colour-coded so you can tell at a glance what stops where
- **Map links** — one-click to Apple Maps and OpenStreetMap, pinned to the station's coordinates
- **Budget hotels nearby** — up to three hand-curated options within 2 km, with price-from and a direct Booking.com link
- **"More on Booking" shortcut** — opens a pre-filtered Booking.com search (≤ 2 km radius, sorted by price) for the selected station

### Filtering & search

The sticky toolbar lets you:

- **Search** by station name or line name
- **Filter by service type** (Alfa Pendular, Intercidades, Regional, Urban, Inactive / Historic)
- **Filter by your vote** — see only stations you've upvoted, downvoted, or haven't rated yet

### Private voting

Each station has a thumbs-up / thumbs-down toggle. Votes are stored in a first-party cookie (`station_votes`) that lasts one year — no account, no server, nothing shared. The vote filter in the toolbar lets you quickly pull up your favourites.

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
| State | React state + cookie-backed pub/sub for votes |
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
    useStationVote.ts  # Cookie-backed vote store with React useSyncExternalStore
  pages/
    Index.tsx          # Main page: hero, filter bar, station grid, footer
public/
  og-image.jpg         # Social preview image (1200×630)
  logo.png             # Square logo for structured data (512×512)
  sitemap.xml
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

```bash
npm test          # unit tests (Vitest)
npm run build     # production build
```

---

## Data

All station and hotel data lives in plain TypeScript files — no database, no API calls at runtime. To add a station, append an entry to `src/data/stations.ts`:

```ts
{ name: "Minha Estação", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.123, lng: -8.456 }
```

Hotel entries go in `src/data/hotels.ts`, keyed by the exact station name string.
