import type { Hotel } from "../data/hotels";
import type { Station } from "../data/stations";
import { stations } from "../data/stations";
import type { GlobalRatings } from "./voteTypes";
import { getStationPath } from "./stationSlug";
import { absoluteUrl, SITE_URL } from "./site";
import { createTranslator } from "@/i18n";
import { getStationMetaDescription, getStationPageTitle } from "./stationMeta";
import { attributionForImageUrl, siteLogoAttribution } from "./imageAttribution";
import type { CountryCode } from "./countries";
import { buildHomePath } from "./homeRoute";

const SITE_NAME = "Sustainable Iberian";
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
    // Community thumbs-up/down votes — not written reviews (Google Review snippet types).
    ratingCount: total,
    bestRating: 5,
    worstRating: 1,
  };
}

function buildStationImageObject(imageUrl: string, stationName: string): JsonLd {
  const { creator, creditText, copyrightNotice, license, acquireLicensePage } =
    attributionForImageUrl(imageUrl);
  const image: JsonLd = {
    "@type": "ImageObject",
    contentUrl: imageUrl,
    name: `${stationName} train station`,
    creator,
    creditText,
    copyrightNotice,
  };
  if (license) {
    image.license = license;
  }
  if (acquireLicensePage) {
    image.acquireLicensePage = acquireLicensePage;
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
  /** Hotel community votes only — TrainStation is not a valid Review snippet parent in Google. */
  hotelRatings?: GlobalRatings;
}): JsonLd {
  const { station, slug, hotels, imageUrl, hotelRatings } = options;
  const path = `/stations/${slug}`;
  const pageUrl = absoluteUrl(path);
  const stationId = `${pageUrl}#station`;
  const tr = createTranslator("en");
  const pageTitle = getStationPageTitle(station, tr);
  const description = getStationMetaDescription(station, hotels, tr);

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

  const graph: JsonLd[] = [
    buildBreadcrumbList([
      { name: "Home", path: buildHomePath(station.country) },
      { name: station.name, path },
    ]),
    {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: pageTitle,
      description,
      isPartOf: { "@id": `${SITE_URL}#website` },
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

export function buildHomeStructuredData(country: CountryCode = "pt"): JsonLd {
  const homeUrl = absoluteUrl(buildHomePath(country));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        name: SITE_NAME,
        url: homeUrl,
        description:
          "Discover train stations and airports across Portugal and Spain with line info and nearby budget hotels.",
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
          contentUrl: absoluteUrl("/logo.png"),
          width: 512,
          height: 512,
          ...siteLogoAttribution(),
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
        name: "Community Rankings | Sustainable Iberian",
        description:
          "See which CP train stations and budget hotels visitors rate highest and lowest across Portugal.",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      },
    ],
  };
}

