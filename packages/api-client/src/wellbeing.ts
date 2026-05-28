import type { WellbeingEntry, NewWellbeingEntry } from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export function upsertWellbeing(cfg: ApiClientConfig, input: NewWellbeingEntry) {
  return apiFetch<{ entry: WellbeingEntry }>(cfg, "/api/v1/wellbeing", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listWellbeing(cfg: ApiClientConfig, page = 1, pageSize = 20) {
  return apiFetch<{ entries: WellbeingEntry[]; total: number }>(
    cfg,
    `/api/v1/wellbeing?page=${page}&pageSize=${pageSize}`,
  );
}

export function getWellbeingByDate(cfg: ApiClientConfig, date: string) {
  return apiFetch<{ entry: WellbeingEntry | null }>(
    cfg,
    `/api/v1/wellbeing/${date}`,
  );
}
