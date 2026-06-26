import { describe, expect, it } from "vitest";
import { DEFAULT_COUNTRY } from "@/lib/countries";

function applySearchQueryParam(current: URLSearchParams, query: string): URLSearchParams {
  const next = new URLSearchParams(current);
  if (query.trim()) {
    next.set("q", query);
  } else {
    next.delete("q");
  }
  return next;
}

function applyCountryParam(current: URLSearchParams, country: "pt" | "es"): URLSearchParams {
  const next = new URLSearchParams(current);
  if (country === DEFAULT_COUNTRY) {
    next.delete("country");
  } else {
    next.set("country", country);
  }
  return next;
}

describe("homepage search params", () => {
  it("preserves country when updating search query", () => {
    const current = new URLSearchParams("country=es");
    const next = applySearchQueryParam(current, "madrid");
    expect(next.get("country")).toBe("es");
    expect(next.get("q")).toBe("madrid");
  });

  it("preserves search when switching country", () => {
    const current = new URLSearchParams("q=porto");
    const next = applyCountryParam(current, "es");
    expect(next.get("q")).toBe("porto");
    expect(next.get("country")).toBe("es");
  });

  it("clears search without dropping country", () => {
    const current = new URLSearchParams("country=es&q=madrid");
    const next = applySearchQueryParam(current, "");
    expect(next.get("country")).toBe("es");
    expect(next.has("q")).toBe(false);
  });
});
