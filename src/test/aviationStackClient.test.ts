import { describe, expect, it } from "vitest";
import { isAviationStackMonthlyLimitError } from "../../server/lib/aviationStackClient";

describe("isAviationStackMonthlyLimitError", () => {
  it("detects AviationStack monthly usage limit messages", () => {
    const error = new Error("Your monthly usage limit has been reached.");
    expect(isAviationStackMonthlyLimitError(error)).toBe(true);
    expect(isAviationStackMonthlyLimitError("Monthly usage limit exceeded")).toBe(true);
  });

  it("ignores other API errors", () => {
    expect(isAviationStackMonthlyLimitError(new Error("aviationstack_http_429"))).toBe(false);
    expect(isAviationStackMonthlyLimitError(new Error("Invalid API key"))).toBe(false);
  });
});
