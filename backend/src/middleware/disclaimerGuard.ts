import type { AIAnalysisResponse } from "@healthpulse/shared";

export const DISCLAIMER =
  "This is not medical advice. Consult a healthcare professional.";

export function withDisclaimer(
  resp: Partial<AIAnalysisResponse>,
): AIAnalysisResponse {
  return {
    insights: resp.insights ?? "",
    possible_causes: resp.possible_causes ?? [],
    recommendations: resp.recommendations ?? [],
    urgency_level: resp.urgency_level ?? "low",
    disclaimer: DISCLAIMER,
  };
}
