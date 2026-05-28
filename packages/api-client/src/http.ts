export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => string | null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  config: ApiClientConfig,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = config.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${config.baseUrl}${path}`, { ...init, headers });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, body, `HTTP ${res.status} ${path}`);
  }
  return body as T;
}
