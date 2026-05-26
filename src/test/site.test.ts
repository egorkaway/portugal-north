import { describe, expect, it } from "vitest";
import { absoluteUrl, DEFAULT_SITE_URL, SITE_URL } from "../lib/site";

describe("site", () => {
  it("resolves a non-empty production origin", () => {
    expect(SITE_URL).toBe(DEFAULT_SITE_URL);
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("absoluteUrl always returns https URLs", () => {
    expect(absoluteUrl("/")).toBe(`${DEFAULT_SITE_URL}/`);
    expect(absoluteUrl("stations/aveiro")).toBe(
      `${DEFAULT_SITE_URL}/stations/aveiro`,
    );
    expect(absoluteUrl("/stations/aveiro")).toBe(
      `${DEFAULT_SITE_URL}/stations/aveiro`,
    );
  });
});
