import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteUrl } from "./apiCatalog.js";

export const AGENT_SKILLS_SCHEMA =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json";

export type AgentSkillEntry = {
  name: string;
  type: "skill-md";
  description: string;
  url: string;
  digest: string;
};

export type AgentSkillsIndex = {
  $schema: typeof AGENT_SKILLS_SCHEMA;
  skills: AgentSkillEntry[];
};

const SKILL_DEFINITIONS = [
  {
    name: "portugal-by-train-api",
    description:
      "Use the Portugal by Train HTTP API for CP live departures, community votes, and discovery metadata.",
  },
] as const;

function resolveSkillsRoot(): string {
  const candidates = [
    join(process.cwd(), "api/agent-skills"),
    join(dirname(fileURLToPath(import.meta.url)), "../agent-skills"),
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, SKILL_DEFINITIONS[0].name, "SKILL.md"))) {
      return dir;
    }
  }
  throw new Error("api/agent-skills directory not found");
}

export function sha256Digest(content: string | Buffer): string {
  const hash = createHash("sha256").update(content).digest("hex");
  return `sha256:${hash}`;
}

export function readSkillArtifact(skillName: string): Buffer {
  const path = join(resolveSkillsRoot(), skillName, "SKILL.md");
  return readFileSync(path);
}

export function buildAgentSkillsIndex(siteUrl = getSiteUrl()): AgentSkillsIndex {
  const base = siteUrl.replace(/\/$/, "");

  const skills = SKILL_DEFINITIONS.map((def) => {
    const bytes = readSkillArtifact(def.name);
    const url = `${base}/.well-known/agent-skills/${def.name}/SKILL.md`;

    return {
      name: def.name,
      type: "skill-md" as const,
      description: def.description,
      url,
      digest: sha256Digest(bytes),
    };
  });

  return {
    $schema: AGENT_SKILLS_SCHEMA,
    skills,
  };
}
