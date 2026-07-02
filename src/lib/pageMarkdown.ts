import type { Hotel } from "@/data/hotels";
import { stations, type Station, getAppleMapsUrl, getBookingSearchUrl, getOSMUrl } from "@/data/stations";
import { allStations } from "@/data/stationRegistry";
import {
  RANKINGS_PAGE_META,
  buildStationPageMeta,
  getHomePageMeta,
  type PageMeta,
  getTicketsPageMeta,
  getTripPageMeta,
} from "@/lib/pageMeta";
import { parseHomeCanonicalPath, buildHomePath } from "@/lib/homeRoute";
import { formatLineList, formatServiceTypes } from "@/lib/stationMeta";
import { getStationBySlug, getStationPath, stationToSlug } from "@/lib/stationSlug";
import type { PrerenderRoute } from "@/lib/prerenderRoutes";
import { buildHomeStructuredData, buildStationStructuredData } from "@/lib/structuredData";
import { getHotelsForStation } from "@/lib/stationHotels";
import { getStationShareImageUrl } from "@/lib/stationImage";
import { formatDistance } from "@/lib/geo";
import {
  getLongDistanceTypes,
  getNearestLongDistanceStations,
  shouldShowNearestLongDistance,
} from "@/lib/nearestLongDistanceStations";
import { getStationSummary } from "@/lib/stationSummary";

/** Rough token estimate (~4 chars per token for English prose). */
export function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}

function yamlFrontmatter(fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  if (lines.length === 0) return "";
  return `---\n${lines.join("\n")}\n---\n\n`;
}

function appendJsonLdBlock(markdown: string, data: unknown): string {
  return `${markdown}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;
}

export function buildHomeMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const body = `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image: meta.ogImagePath ? `${base}${meta.ogImagePath}` : undefined,
  })}# ${meta.title}

${meta.description}

- **${allStations.length}** train stations and airports across Portugal and Spain
- Line and service-type filters (Alfa Pendular, Intercidades, Regional, Urban)
- Budget hotel suggestions within walking distance of major stops
- Community upvote/downvote totals for stations and hotels

## Explore

- [All stations (Portugal & Spain)](${base}/all)
- [All stations (Portugal)](${base}/pt)
- [All stations (Spain)](${base}/es)
- [Community rankings](${base}/rankings)
- [API documentation](${base}/docs/api)

## Discovery for agents

- [API catalog](${base}/.well-known/api-catalog) (RFC 9727)
- [OpenAPI](${base}/api/openapi.json)
- [Agent skills index](${base}/.well-known/agent-skills/index.json)
`;

  return appendJsonLdBlock(body, buildHomeStructuredData());
}

export function buildRankingsMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const body = `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image: meta.ogImagePath ? `${base}${meta.ogImagePath}` : undefined,
  })}# ${meta.title}

${meta.description}

Vote on station and hotel listings across the site; rankings aggregate community up and down counts.

- [Return to all stations](${base}/all)
- [API: global vote totals](${base}/api/votes)
`;

  return body;
}

export function buildTicketsMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image: meta.ogImagePath ? `${base}${meta.ogImagePath}` : undefined,
  })}# ${meta.title}

${meta.description}

## Quick links

- [All stations (Portugal & Spain)](${base}/all)
- [All stations (Portugal)](${base}/pt)
- [All stations (Spain)](${base}/es)
- [Community rankings](${base}/rankings)

## Overview

This guide explains common ways to buy CP train tickets in Portugal (online, app, station) and what tends to affect prices (service type, route length, availability, and how early you book).

## Metro & local transit

City metros are separate from CP. Both Porto and Lisbon use **zone-based** fares.

### Porto: [Andante](https://www.andante.pt/)

Covers [Metro do Porto](https://www.metrodoporto.pt/) and STCP buses. Buy a rechargeable card, load trips or passes, and validate at gates. Fares depend on zones (Z1–Z8); airport and seaside termini often cross more zones. See [Metro do Porto fares](https://www.metrodoporto.pt/pt/viajar/tarifarios).

### Lisbon: [navegante®](https://www.navegante.pt/)

Shared by [Metropolitano de Lisboa](https://www.metrolisboa.pt/) and Carris/Fertagus. Titles are sold by zone rings (city core vs wider metropolitan). See [current fares](https://www.metrolisboa.pt/pt/comprar/tarifario).

A CP ticket does not include metro rides unless CP sells an explicit combined product for your journey.
`;
}

export function buildTripMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image: meta.ogImagePath ? `${base}${meta.ogImagePath}` : undefined,
  })}# ${meta.title}

${meta.description}

## How to start tracking

1. Open any station page with live CP departures.
2. Tap **Take** on the train you plan to board.
3. Open the **Trip** tab in the mobile navigation for countdowns and upcoming stops.
`;
}

export function buildStationMarkdown(
  station: Station,
  meta: PageMeta,
  hotels: Hotel[],
  siteUrl: string,
): string {
  const base = siteUrl.replace(/\/$/, "");
  const image = meta.ogImagePath?.startsWith("http")
    ? meta.ogImagePath
    : meta.ogImagePath
      ? `${base}${meta.ogImagePath}`
      : undefined;

  const hotelLines =
    hotels.length === 0
      ? "_No curated budget stays listed yet — use the Booking search link below._"
      : hotels
          .map(
            (h) =>
              `- **${h.name}** — from €${h.priceFrom}/night, ~${h.walkMinutes} min walk${h.bookingUrl ? ` — [Booking](${h.bookingUrl})` : ""}`,
          )
          .join("\n");

  const longDistanceLines = shouldShowNearestLongDistance(station)
    ? getNearestLongDistanceStations(station)
        .map(({ station: candidate, distanceKm }) => {
          const types = getLongDistanceTypes(candidate).join(", ");
          return `- [${candidate.name}](${base}${getStationPath(candidate)}) — ${formatDistance(distanceKm)} away (${types})`;
        })
        .join("\n")
    : "";

  const longDistanceSection =
    longDistanceLines.length > 0
      ? `## Nearest long-distance stops

This stop has regional or urban service only. For Alfa Pendular or Intercidades trains, try these nearby stations:

${longDistanceLines}

`
      : "";

  const summaryText =
    getStationSummary(station.name) ??
    `${formatServiceTypes(station.types, "en")} at **${station.name}** on ${formatLineList(station.lines, "en")}.`;

  const body = `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image,
  })}# ${station.name}

${meta.description}

## Lines

${station.lines.map((line) => `- ${line}`).join("\n")}

## Service types

${station.types.map((type) => `- ${type}`).join("\n")}

## Location

- Coordinates: ${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}
- [Apple Maps](${getAppleMapsUrl(station)})
- [OpenStreetMap](${getOSMUrl(station)})

## Budget stays nearby

${hotelLines}

${longDistanceSection}## Links

- [Search hotels on Booking](${getBookingSearchUrl(station)})
- [All stations (Portugal & Spain)](${base}/all)
- [All stations (Portugal)](${base}/pt)
- [All stations (Spain)](${base}/es)
- [Live departures API](${base}/api/departures) (requires CP station code)

## Summary

${summaryText}
`;

  const structured = buildStationStructuredData({
    station,
    slug: stationToSlug(station.name),
    hotels,
    imageUrl: getStationShareImageUrl(station.name),
  });

  return appendJsonLdBlock(body, structured);
}

export function buildNotFoundMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
  })}# ${meta.title}

${meta.description}

[Back to homepage](${base}/all)
`;
}

export function buildMarkdownForRoute(route: PrerenderRoute, siteUrl: string): string {
  const { meta } = route;
  const slugMatch = meta.canonicalPath.match(/^\/stations\/([^/]+)$/);

  if (slugMatch) {
    const station = getStationBySlug(slugMatch[1]);
    if (station) {
      const hotels = getHotelsForStation(station.name);
      return buildStationMarkdown(station, meta, hotels, siteUrl);
    }
  }

  if (parseHomeCanonicalPath(meta.canonicalPath)) {
    return buildHomeMarkdown(meta, siteUrl);
  }
  if (meta.canonicalPath === "/rankings") {
    return buildRankingsMarkdown(meta, siteUrl);
  }
  if (meta.canonicalPath === "/tickets") {
    return buildTicketsMarkdown(meta, siteUrl);
  }
  if (meta.canonicalPath === "/trip") {
    return buildTripMarkdown(meta, siteUrl);
  }
  if (meta.canonicalPath === "/404") {
    return buildNotFoundMarkdown(meta, siteUrl);
  }

  return `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
  })}# ${meta.title}

${meta.description}
`;
}

export function buildMarkdownForPath(pathname: string, siteUrl: string): string | null {
  const normalized =
    pathname === "" || pathname === "/" ? "/" : pathname.replace(/\/$/, "") || "/";

  const home = parseHomeCanonicalPath(normalized);
  if (home) {
    return buildHomeMarkdown(getHomePageMeta("en", home.scope, home.page), siteUrl);
  }

  if (normalized === "/") {
    return buildHomeMarkdown(getHomePageMeta("en", "all"), siteUrl);
  }

  const slugMatch = normalized.match(/^\/stations\/([^/]+)$/);
  if (slugMatch) {
    const station = getStationBySlug(slugMatch[1]);
    if (!station) return null;
    const hotels = getHotelsForStation(station.name);
    const meta = buildStationPageMeta(station, hotels, getStationShareImageUrl(station.name));
    return buildStationMarkdown(station, meta, hotels, siteUrl);
  }

  if (normalized === "/rankings") {
    return buildRankingsMarkdown(RANKINGS_PAGE_META, siteUrl);
  }
  if (normalized === "/tickets") {
    return buildTicketsMarkdown(getTicketsPageMeta("en"), siteUrl);
  }
  if (normalized === "/trip") {
    return buildTripMarkdown(getTripPageMeta("en"), siteUrl);
  }

  return null;
}
