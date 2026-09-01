#!/usr/bin/env node
/**
 * Add the next Portuguese CP halt missing from the catalog, ranked by GTFS
 * scheduled stop_times (busiest unmatched first).
 *
 *   npm run stats:portugal-expand
 *   npm run stats:portugal-expand -- --dry-run
 *   npm run stats:portugal-expand -- --limit 1
 *   npm run stats:portugal-expand -- --fill-assets --names "São João do Estoril"
 *
 * Also invoked from collect-departure-stats.mjs after Portugal sampling
 * (default: one station per run).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIONS_PATH = join(root, "src/data/stations.ts");
const CODES_PATH = join(root, "src/data/cpStationCodes.ts");
const CP_STATIONS_END_MARKER = "\n];\n\n/** CP and Metro stations in Portugal.";

const SUMMARY_FILES = {
  en: join(root, "src/data/stationSummaries/en.ts"),
  es: join(root, "src/data/stationSummaries/es.ts"),
  pt: join(root, "src/data/stationSummaries/pt.ts"),
  gl: join(root, "src/data/stationSummaries/gl.ts"),
  ca: join(root, "src/data/stationSummaries/ca.ts"),
};

function insertBeforeMarker(content, marker, insertion) {
  const index = content.lastIndexOf(marker);
  if (index === -1) throw new Error(`marker not found: ${marker}`);
  const prefix = content.slice(0, index).replace(/[ \t]+$/, "");
  const block = insertion.startsWith("\n") ? insertion : `\n${insertion}`;
  return `${prefix}${block}${content.slice(index).replace(/^\n+/, "\n")}`;
}

function stationTsBlock(station) {
  const lines = station.lines.map((line) => JSON.stringify(line)).join(", ");
  const types = station.types.map((type) => JSON.stringify(type)).join(", ");
  return `  {
    name: ${JSON.stringify(station.name)},
    lines: [${lines}],
    types: [${types}],
    lat: ${station.lat},
    lng: ${station.lng},
  },
`;
}

function parseCpStationCodes(text) {
  const map = {};
  for (const match of text.matchAll(/^\s*"([^"]+)":\s*"(94-[^"]+)"/gm)) {
    map[match[1]] = match[2];
  }
  return map;
}

function insertSortedCpCode(content, name, code) {
  if (content.includes(`${JSON.stringify(name)}:`)) return content;
  const line = `  ${JSON.stringify(name)}: ${JSON.stringify(code)},\n`;
  const re = /^  "[^"]+": "94-[^"]+",\n/gm;
  let match;
  while ((match = re.exec(content))) {
    const existing = match[0].match(/^  "([^"]+)":/)?.[1];
    if (existing && existing.localeCompare(name, "pt") > 0) {
      return `${content.slice(0, match.index)}${line}${content.slice(match.index)}`;
    }
  }
  return insertBeforeMarker(content, "\n};\n\nexport function getCpStationCode", line);
}

function servicePhrase(types, locale) {
  const urban = types.includes("Urban");
  const regional = types.includes("Regional");
  const intercidades = types.includes("Intercidades");
  const alfa = types.includes("Alfa Pendular");
  const parts = [];
  if (alfa) parts.push("Alfa Pendular");
  if (intercidades) parts.push("Intercidades");
  if (locale === "en") {
    if (urban) parts.push("urban");
    if (regional) parts.push("regional");
    return parts.join(" and ") || "regional";
  }
  if (locale === "pt") {
    if (urban) parts.push("urbanos");
    if (regional) parts.push("regionais");
    return parts.join(" e ") || "regionais";
  }
  if (locale === "es") {
    if (urban) parts.push("cercanías");
    if (regional) parts.push("regionales");
    return parts.join(" y ") || "regionales";
  }
  if (locale === "gl") {
    if (urban) parts.push("urbanos");
    if (regional) parts.push("rexionais");
    return parts.join(" e ") || "rexionais";
  }
  if (urban) parts.push("rodalia");
  if (regional) parts.push("regionals");
  return parts.join(" i ") || "regionals";
}

function summaryTemplates(name, lines, types) {
  const lineEn = lines[0] ?? "the CP network";
  return {
    en: `${name} is a CP ${servicePhrase(types, "en")} halt on ${lineEn} in Portugal. It is a practical rail stop for exploring the surrounding area, with live departure boards.`,
    pt: `${name} é uma paragem CP de serviços ${servicePhrase(types, "pt")} na ${lineEn} em Portugal. É uma paragem prática para explorar os arredores, com painéis de partidas em direto.`,
    es: `${name} es una parada de CP de servicios ${servicePhrase(types, "es")} en la ${lineEn} en Portugal. Es una parada práctica para explorar los alrededores, con paneles de salidas en directo.`,
    gl: `${name} é unha parada de CP de servizos ${servicePhrase(types, "gl")} na ${lineEn} en Portugal. É unha parada práctica para explorar os arredores, con paneis de saídas en directo.`,
    ca: `${name} és una parada de CP de serveis ${servicePhrase(types, "ca")} a la ${lineEn} a Portugal. És una parada pràctica per explorar els voltants, amb panells de sortides en directe.`,
  };
}

function appendSummary(filePath, name, text) {
  const current = readFileSync(filePath, "utf8");
  if (current.includes(JSON.stringify(name))) return false;
  const block = `  ${JSON.stringify(name)}:\n    ${JSON.stringify(text)},\n`;
  writeFileSync(filePath, insertBeforeMarker(current, "\n};", block));
  return true;
}

function appendPortugalStation(station) {
  const current = readFileSync(STATIONS_PATH, "utf8");
  if (current.includes(`name: ${JSON.stringify(station.name)}`)) return;
  writeFileSync(
    STATIONS_PATH,
    insertBeforeMarker(current, CP_STATIONS_END_MARKER, stationTsBlock(station)),
  );
}

export async function expandPortugalStations(options = {}) {
  const dryRun = Boolean(options.dryRun);
  const { pickNextPortugalStations, PORTUGAL_EXPAND_BATCH_SIZE } = await import(
    "../src/lib/portugalStationCandidates.ts"
  );
  const { loadEnvFile, parseAllStationsFromRepo } = await import("./lib/stationImageFetch.mjs");
  const { loadPortugalGtfsStops } = await import("./lib/portugalGtfsStops.mjs");
  const {
    createExpandAssetContext,
    fillExpandedStationAssets,
    persistExpandedStationAssets,
    resolveExpandedStationAssets,
  } = await import("./lib/expandStationAssets.mjs");

  loadEnvFile(join(root, ".env"));

  if (options.fillNames?.length) {
    const existing = parseAllStationsFromRepo(root);
    const wanted = options.fillNames.map((name) => existing.find((row) => row.name === name)).filter(Boolean);
    if (!wanted.length) {
      console.log("Portugal expand: no matching catalog names to fill assets for.");
      return { added: [], skipped: "none" };
    }
    if (dryRun) return { added: wanted.map((row) => row.name), skipped: undefined, dryRun: true };
    const ctx = await createExpandAssetContext(root);
    const { missingImages } = await fillExpandedStationAssets(
      wanted.map((row) => ({ ...row, lines: row.lines ?? [], types: row.types ?? [] })),
      ctx,
    );
    if (missingImages.length) {
      console.error(`Portugal expand: unique image missing for ${missingImages.join(", ")}`);
    }
    return { added: wanted.map((row) => row.name), missingImages };
  }

  const existing = parseAllStationsFromRepo(root);
  const codeMap = parseCpStationCodes(readFileSync(CODES_PATH, "utf8"));
  const limit = Number(options.limit ?? PORTUGAL_EXPAND_BATCH_SIZE);

  let stops;
  try {
    stops = await loadPortugalGtfsStops(root);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Portugal expand skipped: GTFS stops failed (${message})`);
    return { added: [], skipped: "gtfs_failed" };
  }

  const picked = pickNextPortugalStations({
    stops,
    existing,
    existingCodes: Object.values(codeMap),
    limit,
  });
  if (!picked.length) {
    console.log("Portugal expand: no new catalog candidates this run.");
    return { added: [], skipped: "none" };
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Portugal expand: adding ${picked.length} station(s) — ${picked
      .map((row) => `${row.name} (${row.scheduledStops} GTFS stops)`)
      .join("; ")}`,
  );

  if (dryRun) return { added: picked.map((row) => row.name), skipped: undefined, dryRun: true };

  const ctx = await createExpandAssetContext(root);
  const added = [];
  let codes = readFileSync(CODES_PATH, "utf8");
  for (const candidate of picked) {
    const station = { ...candidate, country: "pt" };
    const assets = await resolveExpandedStationAssets(station, ctx);
    if (!assets.image?.url) {
      console.error(`Portugal expand skipped ${station.name}: no unique image`);
      continue;
    }
    appendPortugalStation(station);
    codes = insertSortedCpCode(codes, station.name, station.code);
    const summaries = summaryTemplates(station.name, station.lines, station.types);
    for (const [locale, filePath] of Object.entries(SUMMARY_FILES)) {
      appendSummary(filePath, station.name, summaries[locale]);
    }
    ctx.stations = parseAllStationsFromRepo(root);
    await persistExpandedStationAssets(station, assets, ctx);
    added.push(station.name);
  }
  writeFileSync(CODES_PATH, codes);
  return { added };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const dryRun = process.argv.includes("--dry-run");
  const fillAssets = process.argv.includes("--fill-assets");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const namesArg = process.argv.find((arg) => arg.startsWith("--names="));
  const namesIdx = process.argv.indexOf("--names");
  const namesRaw =
    namesArg?.split("=").slice(1).join("=") ??
    (namesIdx !== -1 && process.argv[namesIdx + 1] && !process.argv[namesIdx + 1].startsWith("-")
      ? process.argv[namesIdx + 1]
      : "");
  const fillNames = fillAssets
    ? namesRaw
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    : undefined;
  const { PORTUGAL_EXPAND_BATCH_SIZE } = await import("../src/lib/portugalStationCandidates.ts");
  const limit = limitArg
    ? Number.parseInt(limitArg.split("=")[1], 10)
    : PORTUGAL_EXPAND_BATCH_SIZE;
  expandPortugalStations({ dryRun, limit, fillNames }).then((result) => {
    if (result.added?.length) {
      console.log(`Done: ${result.added.join(", ")}`);
    }
    process.exit(0);
  });
}
