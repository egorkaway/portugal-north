import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export type BuildVersion = {
  buildNumber: string;
};

function getBuildNumberFilePath(): string {
  return process.env.BUILD_NUMBER_FILE ?? path.join(root, "build-number.json");
}

export function readBuildNumber(): number {
  try {
    const parsed = JSON.parse(fs.readFileSync(getBuildNumberFilePath(), "utf8")) as {
      buildNumber?: number;
    };
    return typeof parsed.buildNumber === "number" && parsed.buildNumber >= 0
      ? parsed.buildNumber
      : 0;
  } catch {
    return 0;
  }
}

export function writeBuildNumber(buildNumber: number): void {
  fs.writeFileSync(
    getBuildNumberFilePath(),
    `${JSON.stringify({ buildNumber }, null, 2)}\n`,
  );
}

export function bumpBuildNumber(): number {
  const next = readBuildNumber() + 1;
  writeBuildNumber(next);
  return next;
}

export function createBuildVersion(options: { bump?: boolean } = {}): BuildVersion {
  const buildNumber = options.bump ? bumpBuildNumber() : readBuildNumber();
  return { buildNumber: String(buildNumber) };
}
