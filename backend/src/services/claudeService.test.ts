import { describe, it, expect } from "vitest";
import { _internal } from "./claudeService.js";
import type { SymptomEntry } from "@healthpulse/shared";

describe("buildUserPrompt", () => {
  it("formats entry and past context", () => {
    const entry: SymptomEntry = {
      id: "1",
      user_id: "u",
      date: "2026-05-28",
      symptoms: [{ name: "headache", severity: 8, location: "left temple" }],
      notes: "started after lunch",
      created_at: "",
    };
    const past: SymptomEntry[] = [
      {
        id: "0",
        user_id: "u",
        date: "2026-05-27",
        symptoms: [{ name: "fatigue", severity: 5 }],
        notes: undefined,
        created_at: "",
      },
    ];
    const prompt = _internal.buildUserPrompt(entry, past);
    expect(prompt).toContain("headache(sev 8) at left temple");
    expect(prompt).toContain("[2026-05-27]");
    expect(prompt).toContain("started after lunch");
  });
});
