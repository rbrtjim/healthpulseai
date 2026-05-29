import { useAuthStore } from "@healthpulse/store";
import type { ApiClientConfig } from "@healthpulse/api-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

export const apiConfig: ApiClientConfig = {
  baseUrl,
  getToken: () => useAuthStore.getState().accessToken,
};
