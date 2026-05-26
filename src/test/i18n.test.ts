import { describe, expect, it } from "vitest";
import {
  LOCALES,
  createTranslator,
  detectBrowserLocale,
  isLocale,
  resolveInitialLocale,
} from "@/i18n";
import { getHomePageMeta, getRankingsPageMeta } from "@/lib/pageMeta";

describe("i18n", () => {
  it("detects Portuguese, Spanish, Galician, and Catalan browser tags", () => {
    const original = navigator.language;
    Object.defineProperty(navigator, "language", { value: "pt-PT", configurable: true });
    expect(detectBrowserLocale()).toBe("pt");
    Object.defineProperty(navigator, "language", { value: "es-ES", configurable: true });
    expect(detectBrowserLocale()).toBe("es");
    Object.defineProperty(navigator, "language", { value: "gl-ES", configurable: true });
    expect(detectBrowserLocale()).toBe("gl");
    Object.defineProperty(navigator, "language", { value: "ca-ES", configurable: true });
    expect(detectBrowserLocale()).toBe("ca");
    Object.defineProperty(navigator, "language", {
      value: "ca-ES-valencia",
      configurable: true,
    });
    expect(detectBrowserLocale()).toBe("ca");
    Object.defineProperty(navigator, "language", { value: original, configurable: true });
  });

  it("interpolates translation parameters", () => {
    const { t } = createTranslator("en");
    expect(t("vote.upvote", { subject: "Braga" })).toBe("Upvote Braga");
    expect(t("visited.markVisited", { subject: "Braga" })).toBe("Mark Braga as visited");
  });

  it("builds localized home page meta", () => {
    const pt = getHomePageMeta("pt");
    expect(pt.title).toContain("Portugal de Comboio");
    expect(isLocale("pt")).toBe(true);
    expect(isLocale("gl")).toBe(true);
    expect(isLocale("ca")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("builds localized rankings page meta for gl and ca", () => {
    expect(getRankingsPageMeta("gl").title).toContain("Portugal en tren");
    expect(getRankingsPageMeta("ca").title).toContain("Portugal en tren");
  });

  it("exposes all supported locales", () => {
    expect(LOCALES).toEqual(["en", "pt", "es", "gl", "ca"]);
  });

  it("resolveInitialLocale falls back to browser when storage empty", () => {
    expect(LOCALES).toContain(resolveInitialLocale());
  });
});
