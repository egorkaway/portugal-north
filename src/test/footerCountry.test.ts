import { describe, expect, it } from "vitest";
import { parseHomeCanonicalPath } from "@/lib/homeRoute";
import { footerIntroMessageKeys } from "@/hooks/useFooterCountry";

describe("footer country resolution", () => {
  it("reads scope from home paths", () => {
    expect(parseHomeCanonicalPath("/all")?.scope).toBe("all");
    expect(parseHomeCanonicalPath("/es")?.scope).toBe("es");
    expect(parseHomeCanonicalPath("/es/2")?.scope).toBe("es");
  });

  it("defaults root path to all countries", () => {
    expect(parseHomeCanonicalPath("/pt")?.scope).toBe("pt");
  });

  it("picks intro copy keys from home scope", () => {
    expect(footerIntroMessageKeys("es")).toEqual({
      title: "footer.titleSpain",
      subtitle: "footer.subtitleSpain",
    });
    expect(footerIntroMessageKeys("pt")).toEqual({
      title: "footer.title",
      subtitle: "footer.subtitle",
    });
    expect(footerIntroMessageKeys("all")).toEqual({
      title: "footer.titleIberia",
      subtitle: "footer.subtitleIberia",
    });
  });
});
