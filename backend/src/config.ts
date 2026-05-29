import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  supabase: {
    url: required("SUPABASE_URL"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  },
  anthropic: {
    apiKey: required("ANTHROPIC_API_KEY"),
  },
  ai: {
    dailyRateLimit: Number(process.env.AI_DAILY_RATE_LIMIT ?? 10),
  },
};
