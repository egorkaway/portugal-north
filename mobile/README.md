# VeryStays Mobile (Expo)

Fully **native** iOS/Android app for [VeryStays](https://www.verystays.com) — no WebView, no embedded website.

## Tabs (matches the mobile website)

| Tab | What it does |
|-----|----------------|
| **Home** | Searchable station list (all countries), filters, votes, distance sort |
| **Map** | Native map with reliability-coloured station markers (data baked in) |
| **Trip** | Active train countdown, widget + Live Activity sync |
| **Rankings** | Reliability leaderboards (baked) + community votes (API) |
| **Tickets** | Static ticket-buying guide with external links |

Station detail opens as a stack screen: photo, summary, live departures (**Take** → Trip tab), flight connections (airports), hotels, maps link.

First launch shows a short onboarding flow (welcome, location, notifications, widgets). After onboarding, the RevenueCat paywall is shown if Pro is not active. The Tickets tab also has a Pro button at the bottom.

## RevenueCat (subscriptions)

Packages: `react-native-purchases` + `react-native-purchases-ui` (installed via `npx expo install`).

| Constant | Value |
|----------|--------|
| Entitlement | `iberian.travel Pro` |
| Package | `monthly` (falls back to `$rc_monthly` / offering.monthly) |
| API key | Apple test key in [`constants/revenueCat.ts`](constants/revenueCat.ts) |

**Dashboard checklist**

1. Create entitlement **`iberian.travel Pro`**
2. Create App Store monthly product and attach it to that entitlement
3. Add package **`monthly`** on the **current** Offering
4. Design a Paywall on that Offering ([Paywalls](https://www.revenuecat.com/docs/tools/paywalls))
5. In Xcode: enable **In-App Purchase** on the VeryStays target (Signing & Capabilities)

**App wiring**

- [`PurchasesProvider`](components/PurchasesProvider.tsx) configures the SDK at launch and tracks `isPro`
- Onboarding finish → `presentPaywallIfNeeded` for `iberian.travel Pro`
- Tickets → **View Pro plans** / **Manage subscription** → `presentPaywall`

After installing or upgrading the native modules, run `npm run ios:pods` and rebuild (`ios:archive` / `ios:release`).

## What's offline vs online

| Baked into the app | Needs internet |
|--------------------|----------------|
| 426 stations (lines, types, coords, country) | Station photos (CDN URLs) |
| CP station codes | Live departures (`/api/departures`) |
| Reliability scores | Community votes (`/api/votes`) |
| Airport flight connections (destinations list + metadata) | Connection map images (CDN URLs) |
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

Run from `mobile/` when you only need to refresh bundled JSON without a full stats run (e.g. first-time setup). After `npm run stats:departures` at the repo root, mobile data is synced automatically.

```bash
npm run sync:data
npm run sync:icons   # from public/icon-source.png → iOS AppIcon + assets
```

This exports `stations-full.json`, images, hotels, summaries, reliability scores, airport connections, and CP codes into `mobile/data/`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Signing errors | Set Team in Xcode for **VeryStays** + **ExpoWidgetsTarget** |
| Widget not updating | Open the app once; confirm App Group `group.com.iberian.travel` |
| Map blank on simulator | Ensure `react-native-maps` pods installed (`npm run ios:pods`) |
| Release app asks for Metro | Rebuild with `npm run ios:release` |
