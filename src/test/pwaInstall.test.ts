import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isPwaInstalledContext,
  isPwaStandalone,
  markPwaJustInstalled,
  wasPwaJustInstalled,
} from "@/lib/pwaInstall";
import { shouldOfferPwaPermissions } from "@/lib/pwaPermissions";

describe("pwaInstall", () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("detects standalone display mode", () => {
    vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
      matches: query.includes("standalone"),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    expect(isPwaStandalone()).toBe(true);
    expect(isPwaInstalledContext()).toBe(true);
  });

  it("detects fresh install via session flag", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));

    markPwaJustInstalled();
    expect(wasPwaJustInstalled()).toBe(true);
    expect(isPwaInstalledContext()).toBe(true);
  });
});

describe("pwaPermissions", () => {
  it("offers prompt when either permission is still prompt", () => {
    expect(shouldOfferPwaPermissions("prompt", "granted")).toBe(true);
    expect(shouldOfferPwaPermissions("granted", "prompt")).toBe(true);
    expect(shouldOfferPwaPermissions("granted", "denied")).toBe(false);
  });
});
