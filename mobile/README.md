# VeryStays Mobile (Expo)

Fully **native** iOS/Android app for [VeryStays](https://www.verystays.com) — no WebView, no embedded website.

## Tabs (matches the mobile website)

| Tab | What it does |
|-----|----------------|
| **Home** | Searchable station list (PT / ES / All), filters, votes, distance sort |
| **Map** | Native map with reliability-coloured station markers (data baked in) |
| **Trip** | Active train countdown, widget + Live Activity sync |
| **Rankings** | Reliability leaderboards (baked) + community votes (API) |
| **Tickets** | Static ticket-buying guide with external links |

Station detail opens as a stack screen: photo, summary, live departures (**Take** → Trip tab), hotels, maps link.

## What's offline vs online

| Baked into the app | Needs internet |
|--------------------|----------------|
| 426 stations (lines, types, coords, country) | Station photos (CDN URLs) |
| CP station codes | Live departures (`/api/departures`) |
| Reliability scores | Community votes (`/api/votes`) |
| Hotel lists + booking URLs | Vote sync (POST `/api/votes`) |
| Editorial summaries (EN) | Train journey stops (`/api/train-journey`) |

## Widget + Live Activity

- **Home-screen widget** — countdown to active trip; falls back to last train taken, then nearest station
- **Live Activity (iOS)** — Lock Screen + Dynamic Island countdown

Built with **Expo SDK 57** and **expo-widgets**. All builds are **local via Xcode** — no EAS, no dev client.

## Prerequisites

- Node **20.19.4+**
- **Xcode 16+** with iOS platform installed
- **CocoaPods**
- Apple Developer account signed into Xcode (device builds, widgets, Live Activities)

## First-time setup

```bash
cd mobile
npm install
npm run sync:data
npm run prebuild        # if ios/ is missing
npm run ios:pods
```

Set your **Team** in Xcode for **VeryStays** and **ExpoWidgetsTarget** (`npm run ios:open`).

## Release build (default)

Production-style build: **Release** configuration, JS bundle embedded in the app, **no Metro**, **no dev launcher**.

### Simulator

```bash
cd mobile
npm run ios:release
```

### Physical iPhone

```bash
cd mobile
npm run ios:release:device
```

### Archive for TestFlight / App Store

In Xcode: **Product → Archive** (Release scheme), then **Distribute App**.

```bash
npm run ios:archive
```

## Debug build (optional)

```bash
npm start              # Terminal 1
npm run ios:debug      # Terminal 2
```

## Rebuild native project

After changing `app.json` plugins, bundle ID, widget config, or adding native modules (e.g. maps):

```bash
npm run prebuild:clean
npm run ios:pods
npm run ios:release
```

## Regenerate bundled data from the web repo

Run from `mobile/` whenever `src/data/` or `public/data/reliability-scores.json` changes:

```bash
npm run sync:data
```

This exports `stations-full.json`, images, hotels, summaries, reliability scores, and CP codes into `mobile/data/`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Signing errors | Set Team in Xcode for **VeryStays** + **ExpoWidgetsTarget** |
| Widget not updating | Open the app once; confirm App Group `group.com.verystays.app` |
| Map blank on simulator | Ensure `react-native-maps` pods installed (`npm run ios:pods`) |
| Release app asks for Metro | Rebuild with `npm run ios:release` |
