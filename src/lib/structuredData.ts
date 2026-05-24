import type { Hotel } from "../data/hotels";
import type { Station } from "../data/stations";
import { stations } from "../data/stations";
import type { GlobalRatings } from "./voteTypes";
import { getStationPath } from "./stationSlug";
import { absoluteUrl, SITE_URL } from "./site";
import { createTranslator } from "@/i18n";
import { getStationMetaDescription, getStationPageTitle } from "./stationMeta";

const SITE_NAME = "Portugal by Train";
const MIN_VOTES_FOR_AGGREGATE = 2;

type JsonLd = Record<string, unknown>;

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildBreadcrumbList(items: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(items[items.length - 1]?.path ?? "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function votesToAggregateRating(
  up: number,
  down: number,
): JsonLd | null {
  const total = up + down;
  if (total < MIN_VOTES_FOR_AGGREGATE || up === 0) return null;

  const ratingValue = Math.round((up / total) * 50) / 10;
  return {
    "@type": "AggregateRating",
    ratingValue: Math.min(5, Math.max(1, ratingValue)),
    ratingCount: total,
    reviewCount: total,
    bestRating: 5,
    worstRating: 1,
  };
}

function imageLicenseForUrl(url: string): { license: string; acquireLicensePage?: string } | null {
  if (url.includes("wikimedia.org") || url.includes("wikipedia.org")) {
    return {
      license: "https://creativecommons.org/licenses/by-sa/4.0/",
      acquireLicensePage: "https://commons.wikimedia.org/",
    };
  }
  if (url.includes("pexels.com")) {
    return {
      license: "https://www.pexels.com/license/",
      acquireLicensePage: "https://www.pexels.com/license/",
    };
  }
  return null;
}

function buildStationImageObject(imageUrl: string, stationName: string): JsonLd {
  const license = imageLicenseForUrl(imageUrl);
  const image: JsonLd = {
    "@type": "ImageObject",
    contentUrl: imageUrl,
    name: `${stationName} train station`,
  };
  if (license) {
    image.license = license.license;
    image.acquireLicensePage = license.acquireLicensePage;
  }
  return image;
}

function buildLodgingBusiness(
  hotel: Hotel,
  station: Station,
  stationPageUrl: string,
  hotelRatings?: GlobalRatings,
): JsonLd {
  const hotelKey = `${station.name}::${hotel.name}`;
  const counts = hotelRatings?.[hotelKey];
  const aggregateRating =
    counts && votesToAggregateRating(counts.up, counts.down);

  const lodging: JsonLd = {
    "@type": "LodgingBusiness",
    name: hotel.name,
    url: hotel.bookingUrl,
    priceRange: `€${hotel.priceFrom}+`,
    description: `Budget stay about ${hotel.distanceKm} km from ${station.name} station.`,
    containedInPlace: { "@id": `${stationPageUrl}#station` },
  };

  if (aggregateRating) {
    lodging.aggregateRating = aggregateRating;
  }

  return lodging;
}

export function buildStationStructuredData(options: {
  station: Station;
  slug: string;
  hotels: Hotel[];
  imageUrl?: string;
  stationRatings?: GlobalRatings;
  hotelRatings?: GlobalRatings;
}): JsonLd {
  const { station, slug, hotels, imageUrl, stationRatings, hotelRatings } = options;
  const path = `/stations/${slug}`;
  const pageUrl = absoluteUrl(path);
  const stationId = `${pageUrl}#station`;
  const tr = createTranslator("en");
  const pageTitle = getStationPageTitle(station, tr);
  const description = getStationMetaDescription(station, hotels, tr);

  const stationCounts = stationRatings?.[station.name];
  const stationAggregate = stationCounts
    ? votesToAggregateRating(stationCounts.up, stationCounts.down)
    : null;

  const trainStation: JsonLd = {
    "@type": "TrainStation",
    "@id": stationId,
    name: station.name,
    description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: station.lat,
      longitude: station.lng,
    },
    publicTransport: "Comboios de Portugal",
    sameAs: [
      `https://www.openstreetmap.org/?mlat=${station.lat}&mlon=${station.lng}`,
    ],
  };

  if (imageUrl) {
    trainStation.image = buildStationImageObject(imageUrl, station.name);
  }
  if (stationAggregate) {
    trainStation.aggregateRating = stationAggregate;
  }

  const graph: JsonLd[] = [
    buildBreadcrumbList([
      { name: "Home", path: "/" },
      { name: station.name, path },
    ]),
    {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: pageTitle,
      description,
      isPartOf: { "@id": `${SITE_URL || absoluteUrl("/")}#website` },
      about: { "@id": stationId },
      mainEntity: { "@id": stationId },
    },
    trainStation,
    ...hotels.map((hotel) =>
      buildLodgingBusiness(hotel, station, pageUrl, hotelRatings),
    ),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildHomeStructuredData(): JsonLd {
  const homeUrl = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        description:
          "Discover major train stations across Portugal with line info and nearby budget hotels.",
        publisher: { "@id": `${homeUrl}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${homeUrl}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${homeUrl}#organization`,
        name: SITE_NAME,
        url: homeUrl,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
          width: 512,
          height: 512,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: `${SITE_NAME}: Stations & Budget Hotels`,
        isPartOf: { "@id": `${homeUrl}#website` },
        mainEntity: { "@id": `${homeUrl}#station-list` },
      },
      {
        "@type": "ItemList",
        "@id": `${homeUrl}#station-list`,
        name: "CP train stations in Portugal",
        numberOfItems: stations.length,
        itemListElement: stations.map((station, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: station.name,
          url: absoluteUrl(getStationPath(station)),
        })),
      },
    ],
  };
}

export function buildRankingsStructuredData(): JsonLd {
  const path = "/rankings";
  const pageUrl = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbList([
        { name: "Home", path: "/" },
        { name: "Community rankings", path },
      ]),
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: "Community Rankings | Portugal by Train",
        description:
          "See which CP train stations and budget hotels visitors rate highest and lowest across Portugal.",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      },
    ],
  };
}

