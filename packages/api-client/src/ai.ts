import type { AIAnalysis } from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export function analyzeEntry(cfg: ApiClientConfig, entryId: string) {
  return apiFetch<{ analysis: AIAnalysis }>(cfg, "/api/v1/ai/analyze", {
    method: "POST",
    body: JSON.stringify({ entry_id: entryId }),
  });
}

export function listAnalyses(cfg: ApiClientConfig) {
  return apiFetch<{ analyses: AIAnalysis[] }>(cfg, "/api/v1/ai/analyses");
}
