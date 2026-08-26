import { mkdirSync, writeFileSync, rmSync, mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  MOBILE_CATALOG_CHECK_INTERVAL_MS,
  MOBILE_CATALOG_RETRY_AFTER_FAILURE_MS,
  MOBILE_CATALOG_SCHEMA_VERSION,
  parseMobileCatalog,
  publishMobileCatalogFromBundle,
  sha256Hex,
  shouldCheckMobileCatalog,
} from "../../scripts/lib/mobileCatalog.mjs";
import {
  parseCatalog,
  parseHotelsPayload,
  parseStationsPayload,
  shouldCheckCatalog,
} from "../../mobile/lib/catalogPolicy";

describe("mobile catalog publish", () => {
  /** @type {string[]} */
  const temps = [];

  afterEach(() => {
    while (temps.length) {
      const dir = temps.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function makeRoot() {
    const rootDir = mkdtempSync(join(tmpdir(), "mobile-catalog-"));
    temps.push(rootDir);

    const stations = [
      {
        name: "Aveiro",
        lines: ["Linha do Norte"],
        types: ["Intercidades"],
        lat: 40.6,
        lng: -8.6,
        country: "pt",
      },
    ];
    const hotels = {
      Aveiro: [
        {
          name: "Hotel Aveiro",
          distanceKm: 0.4,
          priceFrom: 70,
          bookingUrl: "https://www.booking.com/hotel/pt/aveiro.html",
        },
      ],
    };

    mkdirSync(join(rootDir, "mobile/data"), { recursive: true });
    mkdirSync(join(rootDir, "public/data"), { recursive: true });

    const copied = {
      "stations-full.json": stations,
      "hotels.json": hotels,
      "stationImages.json": { Aveiro: "https://example.com/aveiro.jpg" },
      "pexelsPhotoCredits.json": {
        "1559": {
          photographer: "SplitShire",
          photographerUrl: "https://www.pexels.com/@splitshire",
          photoPageUrl: "https://www.pexels.com/photo/1559/",
        },
      },
      "summaries-en.json": { Aveiro: "A coastal hub." },
      "summaries-pt.json": { Aveiro: "Um hub costeiro." },
      "summaries-es.json": { Aveiro: "Un hub costero." },
      "summaries-ca.json": { Aveiro: "Un hub costaner." },
      "summaries-gl.json": { Aveiro: "Un hub costeiro." },
      "cpStationCodes.json": { Aveiro: "9402006" },
    };
    for (const [name, body] of Object.entries(copied)) {
      writeFileSync(join(rootDir, "mobile/data", name), JSON.stringify(body));
    }

    const reliability = {
      generatedAt: "2026-08-26T00:00:00.000Z",
      runCount: 12,
      stationCount: 1,
      scores: { Aveiro: 8.2 },
      movements: { Aveiro: 40 },
    };
    writeFileSync(
      join(rootDir, "public/data/reliability-scores.json"),
      JSON.stringify(reliability),
    );
    writeFileSync(
      join(rootDir, "public/data/spain-reliability-scores.json"),
      JSON.stringify({ ...reliability, scores: {}, movements: {}, stationCount: 0 }),
    );
    writeFileSync(
      join(rootDir, "public/data/train-reliability-spotlight.json"),
      JSON.stringify({ generatedAt: reliability.generatedAt, runCount: 12, mostDelayed: null, mostReliable: null }),
    );

    return rootDir;
  }

  it("copies bundle files, hashes them, and writes a parseable catalog", () => {
    const rootDir = makeRoot();
    const catalog = publishMobileCatalogFromBundle(rootDir, {
      generatedAt: "2026-08-26T12:00:00.000Z",
    });

    expect(catalog.schemaVersion).toBe(MOBILE_CATALOG_SCHEMA_VERSION);
    expect(catalog.generatedAt).toBe("2026-08-26T12:00:00.000Z");
    expect(catalog.assets.stations.path).toBe("/data/mobile/stations-full.json");
    expect(catalog.assets.reliabilityScores.path).toBe("/data/reliability-scores.json");

    const publishedStations = readFileSync(
      join(rootDir, "public/data/mobile/stations-full.json"),
    );
    expect(catalog.assets.stations.sha256).toBe(sha256Hex(publishedStations));
    expect(catalog.assets.stations.bytes).toBe(publishedStations.length);

    const catalogPath = join(rootDir, "public/data/mobile-catalog.json");
    expect(existsSync(catalogPath)).toBe(true);
    const parsed = parseMobileCatalog(JSON.parse(readFileSync(catalogPath, "utf8")));
    expect(parsed?.assets.hotels.sha256).toBe(catalog.assets.hotels.sha256);
    expect(parseCatalog(JSON.parse(readFileSync(catalogPath, "utf8")))?.generatedAt).toBe(
      "2026-08-26T12:00:00.000Z",
    );
  });

  it("rejects a catalog with a missing asset or bad hash", () => {
    const rootDir = makeRoot();
    const catalog = publishMobileCatalogFromBundle(rootDir);
    expect(parseMobileCatalog({ ...catalog, assets: { ...catalog.assets, hotels: undefined } })).toBeNull();
    expect(
      parseMobileCatalog({
        ...catalog,
        assets: {
          ...catalog.assets,
          hotels: { ...catalog.assets.hotels, sha256: "nope" },
        },
      }),
    ).toBeNull();
  });
});

describe("mobile catalog check interval", () => {
  it("checks immediately when there is no previous success", () => {
    expect(shouldCheckMobileCatalog({ lastCheckAt: null, now: 1_000 })).toBe(true);
    expect(shouldCheckCatalog({ lastCheckAt: null, now: 1_000 })).toBe(true);
  });

  it("waits a day after a successful check", () => {
    const lastCheckAt = 1_000;
    expect(
      shouldCheckMobileCatalog({
        lastCheckAt,
        now: lastCheckAt + MOBILE_CATALOG_CHECK_INTERVAL_MS - 1,
      }),
    ).toBe(false);
    expect(
      shouldCheckMobileCatalog({
        lastCheckAt,
        now: lastCheckAt + MOBILE_CATALOG_CHECK_INTERVAL_MS,
      }),
    ).toBe(true);
  });

  it("backs off after a failed attempt", () => {
    expect(
      shouldCheckMobileCatalog({
        lastCheckAt: null,
        lastAttemptAt: 5_000,
        now: 5_000 + MOBILE_CATALOG_RETRY_AFTER_FAILURE_MS - 1,
      }),
    ).toBe(false);
    expect(
      shouldCheckMobileCatalog({
        lastCheckAt: null,
        lastAttemptAt: 5_000,
        now: 5_000 + MOBILE_CATALOG_RETRY_AFTER_FAILURE_MS,
      }),
    ).toBe(true);
  });
});

describe("mobile catalog payload parsers", () => {
  it("accepts station and hotel snapshots", () => {
    expect(
      parseStationsPayload([
        {
          name: "Aveiro",
          lines: ["Linha do Norte"],
          types: ["Urban"],
          lat: 40.6,
          lng: -8.6,
          country: "pt",
        },
      ]),
    ).toHaveLength(1);
    expect(parseStationsPayload([])).toBeNull();
    expect(
      parseHotelsPayload({
        Aveiro: [
          {
            name: "Hotel Aveiro",
            distanceKm: 0.4,
            priceFrom: 70,
            bookingUrl: "https://www.booking.com/hotel/pt/aveiro.html",
          },
        ],
      })?.Aveiro,
    ).toHaveLength(1);
  });
});
