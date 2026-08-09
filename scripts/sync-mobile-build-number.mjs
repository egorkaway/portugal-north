#!/usr/bin/env node
/**
 * Sync mobile iOS/Android build numbers from the shared repo root `build-number.json`.
 * Keeps marketing version (`1.0`) aligned from `mobile/app.json` → expo.version.
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
const versionName = String(appJson.expo?.version ?? "1.0");
appJson.expo.ios = appJson.expo.ios ?? {};
appJson.expo.ios.buildNumber = build;
appJson.expo.android = appJson.expo.android ?? {};
appJson.expo.android.versionCode = buildNumber;
fs.writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);

for (const rel of [
  "mobile/ios/VeryStays/Info.plist",
  "mobile/ios/ExpoWidgetsTarget/Info.plist",
]) {
  const plistPath = path.join(root, rel);
  if (!fs.existsSync(plistPath)) continue;
  let plist = fs.readFileSync(plistPath, "utf8");
  plist = plist.replace(
    /(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${build}$2`,
  );
  plist = plist.replace(
    /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${versionName}$2`,
  );
  fs.writeFileSync(plistPath, plist);
}

const pbxPath = path.join(root, "mobile/ios/VeryStays.xcodeproj/project.pbxproj");
if (fs.existsSync(pbxPath)) {
  let pbx = fs.readFileSync(pbxPath, "utf8");
  pbx = pbx.replace(/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${build};`);
  pbx = pbx.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${versionName};`);
  fs.writeFileSync(pbxPath, pbx);
}

const androidGradlePath = path.join(root, "mobile/android/app/build.gradle");
if (fs.existsSync(androidGradlePath)) {
  let gradle = fs.readFileSync(androidGradlePath, "utf8");
  gradle = gradle.replace(/versionCode\s+\d+/g, `versionCode ${buildNumber}`);
  gradle = gradle.replace(/versionName\s+"[^"]*"/g, `versionName "${versionName}"`);
  fs.writeFileSync(androidGradlePath, gradle);
}

// Ensure build-number.json stays in sync (already written if --bump)
writeBuildNumber(buildNumber);

console.log(
  `Synced version ${versionName} (${build}) → web version.json + mobile iOS/Android`,
);
