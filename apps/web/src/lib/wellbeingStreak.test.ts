import { describe, it, expect } from "vitest";
import type { WellbeingEntry } from "@healthpulse/shared";
import { computeStreak } from "./wellbeingStreak.js";

const mk = (date: string): WellbeingEntry => ({
  id: date,
  user_id: "u",
  date,
  gratitude_things: [],
  gratitude_people: [],
  goals_short_term: [],
  goals_long_term: [],
  tomorrow_tasks: [],
  created_at: "",
});

describe("computeStreak", () => {
  it("counts consecutive days back from today", () => {
    const entries = [
      mk("2026-05-28"),
      mk("2026-05-27"),
      mk("2026-05-26"),
      mk("2026-05-24"),
    ];
    expect(computeStreak(entries, "2026-05-28")).toBe(3);
  });

  it("returns 0 when today is missing", () => {
    expect(computeStreak([mk("2026-05-27")], "2026-05-28")).toBe(0);
  });
});
