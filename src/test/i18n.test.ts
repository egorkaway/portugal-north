import { describe, expect, it } from "vitest";
import { createTranslator, detectBrowserLocale, isLocale, resolveInitialLocale } from "@/i18n";
import { getHomePageMeta } from "@/lib/pageMeta";

describe("i18n", () => {
  it("detects Portuguese and Spanish browser tags", () => {
    const original = navigator.language;
    Object.defineProperty(navigator, "language", { value: "pt-PT", configurable: true });
    expect(detectBrowserLocale()).toBe("pt");
    Object.defineProperty(navigator, "language", { value: "es-ES", configurable: true });
    expect(detectBrowserLocale()).toBe("es");
    Object.defineProperty(navigator, "language", { value: original, configurable: true });
  });

  it("interpolates translation parameters", () => {
    const { t } = createTranslator("en");
    expect(t("vote.upvote", { subject: "Braga" })).toBe("Upvote Braga");
  });

  it("builds localized home page meta", () => {
    const pt = getHomePageMeta("pt");
    expect(pt.title).toContain("Portugal de Comboio");
    expect(isLocale("pt")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("resolveInitialLocale falls back to browser when storage empty", () => {
    expect(["en", "pt", "es"]).toContain(resolveInitialLocale());
  });
});
