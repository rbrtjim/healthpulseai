import type { Vital } from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export function listVitals(cfg: ApiClientConfig, from?: string, to?: string) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  return apiFetch<{ vitals: Vital[] }>(cfg, `/api/v1/vitals?${qs.toString()}`);
}
