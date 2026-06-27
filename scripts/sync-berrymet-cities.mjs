#!/usr/bin/env node
/**
 * Sync published berrymet.com cities from /api/cities/major into src/data/berrymetCities.ts.
 *
 *   npm run berrymet:sync
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src/data/berrymetCities.ts");

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "VeryStays-BerrymetSync/1.0 (+https://www.verystays.com)" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`http_${res.status}_${url}`);
  return res.json();
}

const major = await fetchJson("https://berrymet.com/api/cities/major");
const cities = major.data
  .map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    lat: Number(city.latitude),
    lng: Number(city.longitude),
  }))
  .sort((a, b) => a.id - b.id);

const content = `export type BerrymetCity = {
  id: number;
  name: string;
  country: "PT" | "ES";
  lat: number;
  lng: number;
};

/** Cities with live pages on berrymet.com (GET /api/cities/major). Regenerate: npm run berrymet:sync */
export const berrymetCities: BerrymetCity[] = [
${cities
  .map(
    (city) =>
      `  { id: ${city.id}, name: ${JSON.stringify(city.name)}, country: ${JSON.stringify(city.country)}, lat: ${city.lat}, lng: ${city.lng} },`,
  )
  .join("\n")}
];
`;

writeFileSync(outPath, content);
console.log(`Wrote ${cities.length} published cities → ${outPath}`);
