import { describe, expect, it } from "vitest";
import { parseHomeCanonicalPath } from "@/lib/homeRoute";

describe("footer country resolution", () => {
  it("reads Spain from home path", () => {
    expect(parseHomeCanonicalPath("/es")?.country).toBe("es");
    expect(parseHomeCanonicalPath("/es/2")?.country).toBe("es");
  });

  it("reads Portugal from home path", () => {
    expect(parseHomeCanonicalPath("/pt")?.country).toBe("pt");
  });
});
