import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildApiCatalogLinkset } from "../../api/lib/apiCatalog";
import {
  AGENT_SKILLS_SCHEMA,
  buildAgentSkillsIndex,
  readSkillArtifact,
  sha256Digest,
} from "../../api/lib/agentSkillsIndex";
import { buildMcpServerCard } from "../../api/lib/mcpServerCard";

const SITE = "https://www.verystays.com";

describe("agent discovery (RFC 8288 / RFC 9727)", () => {
  it("builds an RFC 9727 Appendix A linkset", () => {
    const catalog = buildApiCatalogLinkset(SITE);
    const entry = catalog.linkset[0];

    expect(entry.anchor).toBe(`${SITE}/api`);
    expect(entry["service-desc"]?.[0]).toEqual({
      href: `${SITE}/api/openapi.json`,
      type: "application/openapi+json",
    });
    expect(entry["service-doc"]?.[0]).toEqual({
      href: `${SITE}/docs/api`,
      type: "text/markdown",
    });
    expect(entry.status?.[0]).toEqual({
      href: `${SITE}/api/votes?ping=1`,
      type: "application/json",
    });
  });

  it("keeps public api-catalog JSON aligned with the linkset builder", () => {
    const raw = readFileSync(
      join(process.cwd(), "public/.well-known/api-catalog"),
      "utf8",
    );
    expect(JSON.parse(raw)).toEqual(buildApiCatalogLinkset(SITE));
  });

  it("builds an MCP Server Card (SEP-1649)", () => {
    const card = buildMcpServerCard(SITE);
    expect(card.serverInfo.name).toBe("com.verystays/portugal-by-train");
    expect(card.serverInfo.version).toBe("1.0.0");
    expect(card.transport.type).toBe("streamable-http");
    expect(card.transport.endpoint).toBe(`${SITE}/api/mcp`);
    expect(card.capabilities).toEqual({ tools: {}, resources: {}, prompts: {} });
    expect(card.authentication.required).toBe(false);
  });

  it("keeps public MCP server card JSON aligned with the builder", () => {
    const raw = readFileSync(
      join(process.cwd(), "public/.well-known/mcp/server-card.json"),
      "utf8",
    );
    expect(JSON.parse(raw)).toEqual(buildMcpServerCard(SITE));
  });

  it("builds an Agent Skills discovery index (v0.2.0)", () => {
    const index = buildAgentSkillsIndex(SITE);
    expect(index.$schema).toBe(AGENT_SKILLS_SCHEMA);
    expect(index.skills.length).toBeGreaterThan(0);

    for (const skill of index.skills) {
      expect(skill.type).toBe("skill-md");
      expect(skill.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
      expect(skill.digest).toBe(sha256Digest(readSkillArtifact(skill.name)));
      expect(skill.url).toBe(
        `${SITE}/.well-known/agent-skills/${skill.name}/SKILL.md`,
      );
    }
  });

  it("keeps public agent-skills index aligned with the builder", () => {
    const raw = readFileSync(
      join(process.cwd(), "public/.well-known/agent-skills/index.json"),
      "utf8",
    );
    expect(JSON.parse(raw)).toEqual(buildAgentSkillsIndex(SITE));
  });

  it("declares Content Signals in robots.txt", () => {
    const robots = readFileSync(join(process.cwd(), "public/robots.txt"), "utf8");
    expect(robots).toContain("Content-Signal: ai-train=no, search=yes, ai-input=no");
    expect(robots).toMatch(/User-agent: \*\s*\nAllow: \/\s*\nContent-Signal:/m);
  });

  it("advertises resources on the homepage via Link header", () => {
    const vercel = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8")) as {
      headers: { source: string; headers: { key: string; value: string }[] }[];
      rewrites: { source: string; destination: string }[];
    };
    const home = vercel.headers.find((h) => h.source === "/");
    const link = home?.headers.find((h) => h.key === "Link")?.value ?? "";
    expect(link).toContain('rel="api-catalog"');
    expect(link).toContain("</.well-known/api-catalog>");
    expect(link).toContain('rel="service-doc"');
    expect(link).toContain("</docs/api>");

    const catalogRewrite = vercel.rewrites.find(
      (r) => r.source === "/.well-known/api-catalog",
    );
    expect(catalogRewrite?.destination).toBe("/api/api-catalog");

    const mcpRewrite = vercel.rewrites.find(
      (r) => r.source === "/.well-known/mcp/server-card.json",
    );
    expect(mcpRewrite?.destination).toBe("/api/mcp-server-card");

    const skillsRewrite = vercel.rewrites.find(
      (r) => r.source === "/.well-known/agent-skills/index.json",
    );
    expect(skillsRewrite?.destination).toBe("/api/agent-skills-index");
  });
});
