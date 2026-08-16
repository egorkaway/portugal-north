import { describe, expect, it } from "vitest";
import { getPrivacyContent } from "@/content/privacy";

describe("privacy content", () => {
  it("covers votes, device storage, and analytics for each locale", () => {
    for (const locale of ["en", "pt", "es", "ca", "gl"] as const) {
      const content = getPrivacyContent(locale);
      expect(content.sections.length).toBeGreaterThanOrEqual(9);
      const text = content.sections.flatMap((s) => s.paragraphs).join(" ");
      expect(text).toMatch(/vote|vot/i);
      expect(text).toMatch(/localStorage|cookie|browser|navegador/i);
      expect(text).toMatch(/RevenueCat/i);
      expect(content.sections.some((s) => s.id === "mobile-purchases")).toBe(true);
    }
  });
});
