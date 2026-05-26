import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  ANONYMOUS_ID_STORAGE_KEY,
  getOrCreateAnonymousId,
  identifyAnonymousUser,
  identifyAuthenticatedUser,
} from "@/lib/posthogIdentity";

describe("posthogIdentity", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("crypto", { randomUUID: () => "test-uuid-1111-2222-3333-444444444444" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("persists anonymous id in localStorage", () => {
    const first = getOrCreateAnonymousId();
    const second = getOrCreateAnonymousId();
    expect(first).toBe(second);
    expect(localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY)).toBe(first);
  });

  it("identifyAnonymousUser calls identify with is_anonymous", () => {
    const identify = vi.fn();
    const register = vi.fn();
    const client = { identify, register } as unknown as import("posthog-js").PostHog;

    const id = identifyAnonymousUser(client);

    expect(id).toBe("test-uuid-1111-2222-3333-444444444444");
    expect(identify).toHaveBeenCalledWith(id, { is_anonymous: true });
    expect(register).toHaveBeenCalledWith({ is_anonymous: true });
  });

  it("identifyAuthenticatedUser aliases anonymous id then identifies user", () => {
    getOrCreateAnonymousId();
    const alias = vi.fn();
    const identify = vi.fn();
    const register = vi.fn();
    const client = { alias, identify, register } as unknown as import("posthog-js").PostHog;

    identifyAuthenticatedUser(client, "user_42", { email: "a@b.co" });

    expect(alias).toHaveBeenCalledWith("user_42", "test-uuid-1111-2222-3333-444444444444");
    expect(identify).toHaveBeenCalledWith("user_42", {
      email: "a@b.co",
      is_anonymous: false,
    });
    expect(register).toHaveBeenCalledWith({ is_anonymous: false });
  });
});
