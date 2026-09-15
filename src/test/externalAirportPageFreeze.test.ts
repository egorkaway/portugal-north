import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writeExternalAirportPageIatas } from "../../scripts/lib/externalAirportConnectionMaps.mjs";

describe("external airport page IATA freeze", () => {
  /** @type {string[]} */
  const temps = [];

  afterEach(() => {
    while (temps.length) {
      const dir = temps.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function makeRoot(existingIatas) {
    const rootDir = mkdtempSync(join(tmpdir(), "external-pages-"));
    temps.push(rootDir);
    mkdirSync(join(rootDir, "src/data"), { recursive: true });
    mkdirSync(join(rootDir, "public/maps/airports/external"), { recursive: true });
    writeFileSync(
      join(rootDir, "src/data/externalAirportPageIatas.ts"),
      `export const EXTERNAL_AIRPORT_PAGE_IATAS: readonly string[] = ${JSON.stringify(existingIatas, null, 2)};\n`,
    );
    return rootDir;
  }

  it("does not add new both-map airports while pages are frozen", () => {
    const rootDir = makeRoot(["AMS", "CDG"]);
    writeExternalAirportPageIatas(rootDir, {
      airports: [
        {
          iata: "AMS",
          provider: "aviationstack",
          iberianMapImage: "/maps/airports/external/ams-iberia.png",
          mapImage: "/maps/airports/external/ams.png",
        },
        {
          iata: "CDG",
          provider: "aviationstack",
          iberianMapImage: "/maps/airports/external/cdg-iberia.png",
          mapImage: "/maps/airports/external/cdg.png",
        },
        {
          iata: "ZRH",
          provider: "aviationstack",
          iberianMapImage: "/maps/airports/external/zrh-iberia.png",
          mapImage: "/maps/airports/external/zrh.png",
        },
      ],
    });
    const body = readFileSync(join(rootDir, "src/data/externalAirportPageIatas.ts"), "utf8");
    expect(body).toContain('"AMS"');
    expect(body).toContain('"CDG"');
    expect(body).not.toContain('"ZRH"');
  });

  it("adds both-map airports when expandPages is true", () => {
    const rootDir = makeRoot(["AMS"]);
    writeExternalAirportPageIatas(
      rootDir,
      {
        airports: [
          {
            iata: "AMS",
            provider: "aviationstack",
            iberianMapImage: "/maps/airports/external/ams-iberia.png",
            mapImage: "/maps/airports/external/ams.png",
          },
          {
            iata: "ZRH",
            provider: "aviationstack",
            iberianMapImage: "/maps/airports/external/zrh-iberia.png",
            mapImage: "/maps/airports/external/zrh.png",
          },
        ],
      },
      { expandPages: true },
    );
    const body = readFileSync(join(rootDir, "src/data/externalAirportPageIatas.ts"), "utf8");
    expect(body).toContain('"AMS"');
    expect(body).toContain('"ZRH"');
  });
});
