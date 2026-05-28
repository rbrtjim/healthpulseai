import type {
  SymptomEntry,
  NewSymptomEntry,
  NewVital,
  NewMoodLog,
} from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export interface CreateEntryInput {
  entry: NewSymptomEntry;
  vital?: NewVital;
  mood?: NewMoodLog;
}

export interface CreateEntryResponse {
  entry: SymptomEntry;
}

export function createEntry(cfg: ApiClientConfig, input: CreateEntryInput) {
  return apiFetch<CreateEntryResponse>(cfg, "/api/v1/entries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listEntries(cfg: ApiClientConfig, page = 1, pageSize = 20) {
  return apiFetch<{ entries: SymptomEntry[]; total: number }>(
    cfg,
    `/api/v1/entries?page=${page}&pageSize=${pageSize}`,
  );
}

export function getEntry(cfg: ApiClientConfig, id: string) {
  return apiFetch<{ entry: SymptomEntry }>(cfg, `/api/v1/entries/${id}`);
}
