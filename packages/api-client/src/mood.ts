import type { MoodLog } from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export function listMood(cfg: ApiClientConfig, from?: string, to?: string) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  return apiFetch<{ mood: MoodLog[] }>(cfg, `/api/v1/mood?${qs.toString()}`);
}
