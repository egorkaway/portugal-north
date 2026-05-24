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
    expect(md).toContain('title: "Portugal by Train: Stations & Budget Hotels"');
    expect(md).toContain("# Portugal by Train");
    expect(md).toContain("```json");
  });

  it("builds station markdown for a known slug", () => {
    const md = buildMarkdownForPath("/stations/braga", SITE);
    expect(md).toContain("# Braga");
    expect(md).toContain("Linha de Braga");
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
