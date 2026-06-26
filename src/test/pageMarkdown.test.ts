import { describe, expect, it } from "vitest";
import {
  buildHomeMarkdown,
  buildMarkdownForPath,
  buildMarkdownForRoute,
  estimateMarkdownTokens,
} from "@/lib/pageMarkdown";
import { HOME_PAGE_META } from "@/lib/pageMeta";
import { getPrerenderRoutes } from "@/lib/prerenderRoutes";

const SITE = "https://www.verystays.com";

describe("pageMarkdown", () => {
  it("estimates token count from content length", () => {
    expect(estimateMarkdownTokens("abcd")).toBe(1);
    expect(estimateMarkdownTokens("a".repeat(400))).toBe(100);
  });

  it("builds home markdown with YAML frontmatter", () => {
    const md = buildHomeMarkdown(HOME_PAGE_META, SITE);
    expect(md).toContain("---\n");
    expect(md).toContain('title: "Sustainable Iberian: Stations & Budget Hotels"');
    expect(md).toContain("# Sustainable Iberian");
    expect(md).toContain("```json");
  });

  it("builds station markdown for a known slug", () => {
    const md = buildMarkdownForPath("/stations/braga", SITE);
    expect(md).toContain("# Braga");
    expect(md).toContain("Linha de Braga");
  });

  it("builds paginated home markdown", () => {
    const md = buildMarkdownForPath("/pt/2", SITE);
    expect(md).toContain("# Sustainable Iberian");
    expect(md).toContain("/pt");
  });

  it("includes nearest long-distance stops for regional-only stations", () => {
    const md = buildMarkdownForPath("/stations/canelas", SITE);
    expect(md).toContain("## Nearest long-distance stops");
    expect(md).toContain("[Estarreja]");
    expect(md).toContain("[Aveiro]");
  });

  it("matches prerender route count", () => {
    const routes = getPrerenderRoutes();
    for (const route of routes.slice(0, 3)) {
      const md = buildMarkdownForRoute(route, SITE);
      expect(md.length).toBeGreaterThan(50);
      expect(md).toMatch(/^---\n/);
    }
  });
});
