import { describe, expect, it } from "vitest";
import { parseHomeCanonicalPath } from "@/lib/homeRoute";

describe("footer country resolution", () => {
  it("reads scope from home paths", () => {
    expect(parseHomeCanonicalPath("/all")?.scope).toBe("all");
    expect(parseHomeCanonicalPath("/es")?.scope).toBe("es");
    expect(parseHomeCanonicalPath("/es/2")?.scope).toBe("es");
  });

  it("defaults root path to all countries", () => {
    expect(parseHomeCanonicalPath("/pt")?.scope).toBe("pt");
  });
});
