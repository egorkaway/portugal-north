import type { Hotel } from "../data/hotels";
import type { Station } from "../data/stations";
import { stations } from "../data/stations";
import { getStationPath } from "./stationSlug";
import { absoluteUrl, SITE_URL } from "./site";
import { createTranslator } from "@/i18n";
import { getStationMetaDescription, getStationPageTitle } from "./stationMeta";
import { attributionForImageUrl, siteLogoAttribution } from "./imageAttribution";
import type { CountryCode } from "./countries";
import { DEFAULT_COUNTRY } from "./countries";
import { buildHomePath } from "./homeRoute";

const SITE_NAME = "Sustainable Iberian";

type JsonLd = Record<string, unknown>;

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function normalizeBreadcrumbPath(path: string): string {
  if (!path || /undefined/.test(path)) {
    return buildHomePath(DEFAULT_COUNTRY);
  }
  if (path === "/") {
    return buildHomePath(DEFAULT_COUNTRY);
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildBreadcrumbList(items: { name: string; path: string }[]): JsonLd {
  const normalized = items.map((item) => ({
    name: item.name,
    path: normalizeBreadcrumbPath(item.path),
  }));
  const lastPath = normalized[normalized.length - 1]?.path ?? buildHomePath(DEFAULT_COUNTRY);

  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(lastPath)}#breadcrumb`,
    itemListElement: normalized.map((item, index) => {
      const listItem: JsonLd = {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
      };
      const isLast = index === normalized.length - 1;
      if (!isLast) {
        listItem.item = absoluteUrl(item.path);
      }
      return listItem;
    }),
  };
}

function buildStationImageObject(imageUrl: string, stationName: string): JsonLd {
  const attribution = attributionForImageUrl(imageUrl);
  const { creator, creditText, copyrightNotice, license, acquireLicensePage } = attribution;
  const image: JsonLd = {
    "@type": "ImageObject",
    contentUrl: imageUrl,
    name:
      creator["@type"] === "Person"
        ? `${stationName} train station — photo by ${creator.name}`
        : `${stationName} train station`,
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

function buildLodgingBusiness(hotel: Hotel, station: Station): JsonLd {
  return {
    "@type": "LodgingBusiness",
    name: hotel.name,
    url: hotel.bookingUrl,
    priceRange: `€${hotel.priceFrom}+`,
    description: `Budget stay about ${hotel.distanceKm} km from ${station.name} station.`,
    containedInPlace: {
      "@type": "TrainStation",
      name: station.name,
      geo: {
        "@type": "GeoCoordinates",
        latitude: station.lat,
        longitude: station.lng,
      },
    },
  };
}

export function buildStationStructuredData(options: {
  station: Station;
  slug: string;
  hotels: Hotel[];
  imageUrl?: string;
}): JsonLd {
  const { station, slug, hotels, imageUrl } = options;
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
    ...hotels.map((hotel) => buildLodgingBusiness(hotel, station)),
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
        { name: "Home", path: buildHomePath(DEFAULT_COUNTRY) },
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
