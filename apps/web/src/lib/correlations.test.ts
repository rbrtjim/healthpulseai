import { describe, it, expect } from "vitest";
import type { SymptomEntry, MoodLog } from "@healthpulse/shared";
import { computeCorrelations } from "./correlations.js";

const symptomEntry = (
  date: string,
  symptoms: { name: string; severity: number }[],
): SymptomEntry => ({
  id: date,
  user_id: "u",
  date,
  symptoms,
  notes: undefined,
  created_at: "",
});

const moodLog = (
  date: string,
  mood: number,
  energy: number,
  sleep_hours?: number,
): MoodLog => ({ id: date, user_id: "u", date, mood, energy, sleep_hours });

describe("computeCorrelations", () => {
  it("links poor sleep to next-day headaches", () => {
    const entries = [symptomEntry("2026-05-26", [{ name: "headache", severity: 5 }])];
    const mood = [moodLog("2026-05-25", 3, 3, 5)];
    const c = computeCorrelations(entries, mood);
    expect(c[0].detail).toContain("1 of 1");
  });

  it("reports avg mood on high-severity days", () => {
    const entries = [
      symptomEntry("2026-05-25", [{ name: "x", severity: 8 }]),
      symptomEntry("2026-05-26", [{ name: "y", severity: 9 }]),
    ];
    const mood = [moodLog("2026-05-25", 2, 3), moodLog("2026-05-26", 2, 3)];
    const c = computeCorrelations(entries, mood);
    const moodCard = c.find((x) => x.title.includes("Mood"));
    expect(moodCard?.detail).toContain("2.0");
  });
});
