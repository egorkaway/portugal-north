#!/usr/bin/env node
/**
 * Copy mobile bundled JSON to public/data/mobile/ and write mobile-catalog.json.
 *
 *   node scripts/publish-mobile-catalog.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publishMobileCatalogFromBundle } from "./lib/mobileCatalog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = publishMobileCatalogFromBundle(root);
const assetCount = Object.keys(catalog.assets).length;
console.log(
  `Published mobile catalog (${assetCount} assets, ${catalog.generatedAt}) → public${"/data/mobile-catalog.json"}`,
);
