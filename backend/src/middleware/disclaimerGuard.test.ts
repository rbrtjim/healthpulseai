import { describe, it, expect } from "vitest";
import { withDisclaimer, DISCLAIMER } from "./disclaimerGuard.js";

describe("withDisclaimer", () => {
  it("appends disclaimer field to response", () => {
    const out = withDisclaimer({
      insights: "x",
      possible_causes: [],
      recommendations: [],
      urgency_level: "low",
    });
    expect(out.disclaimer).toBe(DISCLAIMER);
  });

  it("never overwrites an existing disclaimer with empty string", () => {
    const out = withDisclaimer({
      insights: "x",
      possible_causes: [],
      recommendations: [],
      urgency_level: "low",
      disclaimer: "",
    });
    expect(out.disclaimer).toBe(DISCLAIMER);
  });
});
