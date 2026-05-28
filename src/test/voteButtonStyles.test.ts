import { describe, expect, it } from "vitest";
import {
  voteDownButtonClassName,
  voteUpButtonClassName,
  visitedButtonClassName,
} from "@/lib/voteButtonStyles";

describe("voteButtonStyles", () => {
  it("uses solid emerald fill for active upvote on all surfaces", () => {
    expect(voteUpButtonClassName("up", "card")).toContain("bg-emerald-600");
    expect(voteUpButtonClassName("up", "primary")).toContain("text-white");
    expect(voteUpButtonClassName("up", "card")).not.toContain("bg-primary-foreground");
  });

  it("uses solid destructive fill for active downvote on all surfaces", () => {
    expect(voteDownButtonClassName("down", "card")).toContain("bg-destructive");
    expect(voteDownButtonClassName("down", "primary")).toContain("bg-destructive");
  });

  it("avoids white-on-white inactive upvote on cards", () => {
    const inactive = voteUpButtonClassName(null, "card");
    expect(inactive).toContain("bg-muted");
    expect(inactive).not.toContain("bg-card");
  });

  it("uses light pills on primary header when inactive", () => {
    expect(voteUpButtonClassName(null, "primary")).toContain("bg-primary-foreground");
    expect(voteDownButtonClassName(null, "primary")).toContain("bg-primary-foreground");
  });

  it("uses amber fill when visited on all surfaces", () => {
    expect(visitedButtonClassName(true, "card")).toContain("bg-amber-500");
    expect(visitedButtonClassName(true, "primary")).toContain("text-white");
  });

  it("uses muted inactive visited on cards and light pill on primary header", () => {
    expect(visitedButtonClassName(false, "card", true)).toContain("bg-muted");
    expect(visitedButtonClassName(false, "primary")).toContain("bg-primary-foreground");
  });
});
