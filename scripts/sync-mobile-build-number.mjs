#!/usr/bin/env node
/**
 * Sync mobile iOS build numbers from the shared repo root `build-number.json`.
 *
 * Usage:
 *   node scripts/sync-mobile-build-number.mjs
 *   node scripts/sync-mobile-build-number.mjs --bump   # bump shared number first, then sync
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bumpBuildNumber, readBuildNumber, writeBuildNumber } from "./buildVersion.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bump = process.argv.includes("--bump");

const buildNumber = bump ? bumpBuildNumber() : readBuildNumber();
const build = String(buildNumber);

const versionJsonPath = path.join(root, "public/version.json");
fs.writeFileSync(versionJsonPath, `${JSON.stringify({ buildNumber: build }, null, 2)}\n`);

const appJsonPath = path.join(root, "mobile/app.json");
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
appJson.expo.ios.buildNumber = build;
if (appJson.expo.android && typeof appJson.expo.android.versionCode === "number") {
  appJson.expo.android.versionCode = buildNumber;
} else if (appJson.expo.android) {
  appJson.expo.android.versionCode = buildNumber;
}
fs.writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);

for (const rel of [
  "mobile/ios/VeryStays/Info.plist",
  "mobile/ios/ExpoWidgetsTarget/Info.plist",
]) {
  const plistPath = path.join(root, rel);
  let plist = fs.readFileSync(plistPath, "utf8");
  plist = plist.replace(
    /(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${build}$2`,
  );
  fs.writeFileSync(plistPath, plist);
}

const pbxPath = path.join(root, "mobile/ios/VeryStays.xcodeproj/project.pbxproj");
let pbx = fs.readFileSync(pbxPath, "utf8");
pbx = pbx.replace(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${build};`);
fs.writeFileSync(pbxPath, pbx);

// Ensure build-number.json stays in sync (already written if --bump)
writeBuildNumber(buildNumber);

console.log(`Synced build number ${build} → web version.json + mobile iOS/Android`);
