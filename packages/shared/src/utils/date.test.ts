import { describe, it, expect } from "vitest";
import { todayISO, formatISO, isValidISODate } from "./date.js";

describe("date utils", () => {
  it("todayISO returns YYYY-MM-DD", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formatISO formats a Date as YYYY-MM-DD", () => {
    const d = new Date(Date.UTC(2026, 4, 28));
    expect(formatISO(d)).toBe("2026-05-28");
  });

  it("isValidISODate accepts good dates and rejects bad ones", () => {
    expect(isValidISODate("2026-05-28")).toBe(true);
    expect(isValidISODate("2026-13-01")).toBe(false);
    expect(isValidISODate("not-a-date")).toBe(false);
  });
});
