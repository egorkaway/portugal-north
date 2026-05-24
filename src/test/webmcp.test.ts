import { describe, expect, it } from "vitest";
import {
  getStationDetails,
  resolveStation,
  searchStations,
} from "@/lib/webmcp/stationTools";
import { buildWebMcpTools } from "@/lib/webmcp/registerWebMcp";

describe("WebMCP station tools", () => {
  it("search_stations matches name and line", () => {
    const byName = searchStations("Braga", 5);
    expect(byName.some((s) => s.name === "Braga")).toBe(true);

    const byLine = searchStations("Douro", 10);
    expect(byLine.some((s) => s.lines.some((l) => l.includes("Douro")))).toBe(true);
  });

  it("get_station resolves slug and name", () => {
    const bySlug = getStationDetails("braga");
    expect("error" in bySlug).toBe(false);
    if (!("error" in bySlug)) {
      expect(bySlug.name).toBe("Braga");
      expect(bySlug.cpCode).toBe("94-29157");
    }

    expect(resolveStation("Porto-Campanhã")?.name).toBe("Porto-Campanhã");
  });

  it("buildWebMcpTools exposes key site actions", () => {
    const tools = buildWebMcpTools(() => {});
    const names = tools.map((t) => t.name);
    expect(names).toContain("search_stations");
    expect(names).toContain("get_station");
    expect(names).toContain("get_departures");
    expect(names).toContain("get_community_rankings");
    expect(names).toContain("navigate_to_station");
  });

  it("each tool has name, description, inputSchema, and execute", () => {
    for (const tool of buildWebMcpTools()) {
      expect(tool.name.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.inputSchema).toBeDefined();
      expect(typeof tool.execute).toBe("function");
    }
  });
});
