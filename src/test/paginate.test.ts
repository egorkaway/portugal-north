import { describe, expect, it } from "vitest";
import { paginate, pageFromSearchParams } from "@/lib/paginate";

describe("paginate", () => {
  const items = Array.from({ length: 75 }, (_, index) => index + 1);

  it("returns the first page of items", () => {
    const result = paginate(items, 1, 30);
    expect(result.items).toHaveLength(30);
    expect(result.items[0]).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.rangeFrom).toBe(1);
    expect(result.rangeTo).toBe(30);
  });

  it("returns the last partial page", () => {
    const result = paginate(items, 3, 30);
    expect(result.items).toEqual([61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]);
    expect(result.rangeFrom).toBe(61);
    expect(result.rangeTo).toBe(75);
  });

  it("clamps invalid page numbers", () => {
    expect(paginate(items, 99, 30).currentPage).toBe(3);
    expect(paginate(items, 0, 30).currentPage).toBe(1);
  });

  it("parses page from search params", () => {
    expect(pageFromSearchParams(new URLSearchParams("page=2"))).toBe(2);
    expect(pageFromSearchParams(new URLSearchParams())).toBe(1);
    expect(pageFromSearchParams(new URLSearchParams("page=0"))).toBe(1);
    expect(pageFromSearchParams(new URLSearchParams("page=abc"))).toBe(1);
  });
});
