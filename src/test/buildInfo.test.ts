import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bumpBuildNumber,
  createBuildVersion,
  readBuildNumber,
  writeBuildNumber,
} from "../../scripts/buildVersion";
import { fetchBuildInfo } from "@/lib/buildInfo";

describe("buildVersion", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      delete process.env.BUILD_NUMBER_FILE;
      tempDir = "";
    }
  });

  function useTempBuildNumberFile() {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pn-build-"));
    process.env.BUILD_NUMBER_FILE = path.join(tempDir, "build-number.json");
  }

  it("starts at 0 and bumps from 1", () => {
    useTempBuildNumberFile();
    expect(readBuildNumber()).toBe(0);
    expect(bumpBuildNumber()).toBe(1);
    expect(readBuildNumber()).toBe(1);
    expect(bumpBuildNumber()).toBe(2);
  });

  it("createBuildVersion bumps only when requested", () => {
    useTempBuildNumberFile();
    writeBuildNumber(0);
    expect(createBuildVersion()).toEqual({ buildNumber: "0" });
    expect(createBuildVersion({ bump: true })).toEqual({ buildNumber: "1" });
    expect(createBuildVersion()).toEqual({ buildNumber: "1" });
  });
});

describe("fetchBuildInfo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads buildNumber from version.json", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ buildNumber: "1" }),
      }),
    );

    await expect(fetchBuildInfo()).resolves.toEqual({ buildNumber: "1" });
  });

  it("throws when version.json is missing buildNumber", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );

    await expect(fetchBuildInfo()).rejects.toThrow(/missing buildNumber/i);
  });
});
