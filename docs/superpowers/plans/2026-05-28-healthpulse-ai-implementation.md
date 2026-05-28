# HealthPulse AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack, AI-powered health journaling web app (React + Vite + Express + Supabase + Claude) per the approved spec at `docs/superpowers/specs/2026-05-27-healthpulse-ai-design.md`.

**Architecture:** pnpm monorepo with `apps/web` (React SPA), `backend/` (Express API), and shared `packages/` for types, store, and api-client. Supabase provides Postgres + auth + RLS. Claude Haiku 4.5 powers AI symptom analysis via a backend proxy with rate limiting and a disclaimer guard.

**Tech Stack:** TypeScript, React 18, Vite 5, Tailwind CSS v3, React Router v6, Zustand, TanStack Query, Express 4, Supabase JS, Anthropic SDK, Recharts, Vitest + Testing Library, ESLint, Prettier, GitHub Actions.

**Working dir convention:** All paths are relative to repo root `c:\Users\Jim\Desktop\HealthPulseAI`. Use PowerShell syntax for shell commands.

---

## Phase 1 — Monorepo Scaffold

### Task 1.1: Initialize git and root files

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.editorconfig`
- Create: `.nvmrc`

- [ ] **Step 1: Init git repo**

```powershell
git init
git branch -M main
```

- [ ] **Step 2: Create `.gitignore`**

```gitignore
# deps
node_modules/
.pnpm-store/

# build
dist/
build/
.next/
.expo/

# env
.env
.env.local
.env.*.local

# logs
*.log
npm-debug.log*
pnpm-debug.log*

# editor
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store
Thumbs.db

# coverage
coverage/
.nyc_output/

# vite/vitest cache
.vite/
.vitest/
```

- [ ] **Step 3: Create `package.json` (root)**

```json
{
  "name": "healthpulse-ai",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "scripts": {
    "build": "pnpm -r build",
    "dev:web": "pnpm --filter @healthpulse/web dev",
    "dev:api": "pnpm --filter @healthpulse/backend dev",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md,css}\""
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 4: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "backend"
```

- [ ] **Step 5: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 6: Create `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 7: Create `.nvmrc`**

```
20
```

- [ ] **Step 8: Install root deps**

Run: `pnpm install`
Expected: Lockfile created, no errors.

- [ ] **Step 9: Commit**

```powershell
git add .
git commit -m "chore: initialize monorepo scaffold"
```

---

### Task 1.2: Shared lint + format config

**Files:**
- Create: `.eslintrc.cjs`
- Create: `.prettierrc.json`
- Create: `.prettierignore`

- [ ] **Step 1: Install shared lint tooling**

Run: `pnpm add -Dw eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier`
Expected: deps installed.

- [ ] **Step 2: Create `.eslintrc.cjs`**

```js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", "build", "node_modules", "coverage"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
```

- [ ] **Step 3: Create `.prettierrc.json`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] **Step 4: Create `.prettierignore`**

```
node_modules
dist
build
coverage
pnpm-lock.yaml
```

- [ ] **Step 5: Commit**

```powershell
git add .eslintrc.cjs .prettierrc.json .prettierignore package.json pnpm-lock.yaml
git commit -m "chore: add eslint and prettier config"
```

---

### Task 1.3: `packages/shared` — types and utils

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/types/symptom.ts`
- Create: `packages/shared/src/types/vital.ts`
- Create: `packages/shared/src/types/mood.ts`
- Create: `packages/shared/src/types/wellbeing.ts`
- Create: `packages/shared/src/types/ai.ts`
- Create: `packages/shared/src/utils/date.ts`
- Create: `packages/shared/src/utils/date.test.ts`

- [ ] **Step 1: Create `packages/shared/package.json`**

```json
{
  "name": "@healthpulse/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `packages/shared/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `packages/shared/src/types/symptom.ts`**

```ts
export interface Symptom {
  name: string;
  severity: number; // 1-10
  location?: string;
}

export interface SymptomEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  symptoms: Symptom[];
  notes?: string;
  created_at: string;
}

export interface NewSymptomEntry {
  date: string;
  symptoms: Symptom[];
  notes?: string;
}
```

- [ ] **Step 4: Create `packages/shared/src/types/vital.ts`**

```ts
export interface Vital {
  id: string;
  user_id: string;
  date: string;
  heart_rate?: number;
  systolic?: number;
  diastolic?: number;
  temp_c?: number;
  weight_kg?: number;
}

export interface NewVital {
  date: string;
  heart_rate?: number;
  systolic?: number;
  diastolic?: number;
  temp_c?: number;
  weight_kg?: number;
}
```

- [ ] **Step 5: Create `packages/shared/src/types/mood.ts`**

```ts
export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  sleep_hours?: number;
}

export interface NewMoodLog {
  date: string;
  mood: number;
  energy: number;
  sleep_hours?: number;
}
```

- [ ] **Step 6: Create `packages/shared/src/types/wellbeing.ts`**

```ts
export interface WellbeingEntry {
  id: string;
  user_id: string;
  date: string;
  gratitude_things: string[];
  gratitude_people: string[];
  goals_short_term: string[];
  goals_long_term: string[];
  tomorrow_tasks: string[];
  created_at: string;
}

export interface NewWellbeingEntry {
  date: string;
  gratitude_things: string[];
  gratitude_people: string[];
  goals_short_term: string[];
  goals_long_term: string[];
  tomorrow_tasks: string[];
}
```

- [ ] **Step 7: Create `packages/shared/src/types/ai.ts`**

```ts
export type UrgencyLevel = "low" | "moderate" | "high" | "emergency";

export interface AIAnalysisResponse {
  insights: string;
  possible_causes: string[];
  recommendations: string[];
  urgency_level: UrgencyLevel;
  disclaimer: string;
}

export interface AIAnalysis {
  id: string;
  user_id: string;
  entry_id: string;
  response: AIAnalysisResponse;
  model: string;
  tokens_used: number;
  created_at: string;
}
```

- [ ] **Step 8: Create `packages/shared/src/types/index.ts`**

```ts
export * from "./symptom.js";
export * from "./vital.js";
export * from "./mood.js";
export * from "./wellbeing.js";
export * from "./ai.js";
```

- [ ] **Step 9: Write failing test for date utils**

`packages/shared/src/utils/date.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { todayISO, formatISO, isValidISODate } from "./date.js";

describe("date utils", () => {
  it("todayISO returns YYYY-MM-DD", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formatISO formats a Date as YYYY-MM-DD", () => {
    const d = new Date(Date.UTC(2026, 4, 28));
    expect(formatISO(d)).toBe("2026-05-28");
  });

  it("isValidISODate accepts good dates and rejects bad ones", () => {
    expect(isValidISODate("2026-05-28")).toBe(true);
    expect(isValidISODate("2026-13-01")).toBe(false);
    expect(isValidISODate("not-a-date")).toBe(false);
  });
});
```

- [ ] **Step 10: Run test (should fail — file doesn't exist)**

Run: `pnpm --filter @healthpulse/shared test`
Expected: FAIL — `Cannot find module './date.js'`.

- [ ] **Step 11: Implement `packages/shared/src/utils/date.ts`**

```ts
export function formatISO(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return formatISO(new Date());
}

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}
```

- [ ] **Step 12: Create `packages/shared/src/index.ts`**

```ts
export * from "./types/index.js";
export * from "./utils/date.js";
```

- [ ] **Step 13: Run test (should pass)**

Run: `pnpm --filter @healthpulse/shared test`
Expected: PASS — 3 tests.

- [ ] **Step 14: Commit**

```powershell
git add packages/shared
git commit -m "feat(shared): add types and date utils"
```

---

### Task 1.4: `packages/store` — Zustand slices (placeholder)

**Files:**
- Create: `packages/store/package.json`
- Create: `packages/store/tsconfig.json`
- Create: `packages/store/src/index.ts`
- Create: `packages/store/src/authStore.ts`
- Create: `packages/store/src/entriesStore.ts`

- [ ] **Step 1: Create `packages/store/package.json`**

```json
{
  "name": "@healthpulse/store",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@healthpulse/shared": "workspace:*",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `packages/store/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `packages/store/src/authStore.ts`**

```ts
import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser | null, token: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setSession: (user, token) => set({ user, accessToken: token }),
  clear: () => set({ user: null, accessToken: null }),
}));
```

- [ ] **Step 4: Create `packages/store/src/entriesStore.ts`**

```ts
import { create } from "zustand";
import type { SymptomEntry } from "@healthpulse/shared";

interface EntriesState {
  entries: SymptomEntry[];
  setEntries: (entries: SymptomEntry[]) => void;
  upsertEntry: (entry: SymptomEntry) => void;
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  upsertEntry: (entry) =>
    set((s) => {
      const i = s.entries.findIndex((e) => e.id === entry.id);
      if (i === -1) return { entries: [entry, ...s.entries] };
      const next = [...s.entries];
      next[i] = entry;
      return { entries: next };
    }),
}));
```

- [ ] **Step 5: Create `packages/store/src/index.ts`**

```ts
export * from "./authStore.js";
export * from "./entriesStore.js";
```

- [ ] **Step 6: Install + typecheck**

Run: `pnpm install`
Run: `pnpm --filter @healthpulse/store typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```powershell
git add packages/store pnpm-lock.yaml
git commit -m "feat(store): add zustand auth and entries stores"
```

---

### Task 1.5: `packages/api-client` — typed fetch wrapper

**Files:**
- Create: `packages/api-client/package.json`
- Create: `packages/api-client/tsconfig.json`
- Create: `packages/api-client/src/http.ts`
- Create: `packages/api-client/src/entries.ts`
- Create: `packages/api-client/src/vitals.ts`
- Create: `packages/api-client/src/mood.ts`
- Create: `packages/api-client/src/wellbeing.ts`
- Create: `packages/api-client/src/ai.ts`
- Create: `packages/api-client/src/index.ts`

- [ ] **Step 1: Create `packages/api-client/package.json`**

```json
{
  "name": "@healthpulse/api-client",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@healthpulse/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `packages/api-client/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `packages/api-client/src/http.ts`**

```ts
export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => string | null;
}

export class ApiError extends Error {
  constructor(public status: number, public body: unknown, message: string) {
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
```

- [ ] **Step 4: Create `packages/api-client/src/entries.ts`**

```ts
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
```

- [ ] **Step 5: Create `packages/api-client/src/vitals.ts`**

```ts
import type { Vital } from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export function listVitals(cfg: ApiClientConfig, from?: string, to?: string) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  return apiFetch<{ vitals: Vital[] }>(cfg, `/api/v1/vitals?${qs.toString()}`);
}
```

- [ ] **Step 6: Create `packages/api-client/src/mood.ts`**

```ts
import type { MoodLog } from "@healthpulse/shared";
import { apiFetch, type ApiClientConfig } from "./http.js";

export function listMood(cfg: ApiClientConfig, from?: string, to?: string) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  return apiFetch<{ mood: MoodLog[] }>(cfg, `/api/v1/mood?${qs.toString()}`);
}
```

- [ ] **Step 7: Create `packages/api-client/src/wellbeing.ts`**

```ts
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
```

- [ ] **Step 8: Create `packages/api-client/src/ai.ts`**

```ts
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
```

- [ ] **Step 9: Create `packages/api-client/src/index.ts`**

```ts
export * from "./http.js";
export * as Entries from "./entries.js";
export * as Vitals from "./vitals.js";
export * as Mood from "./mood.js";
export * as Wellbeing from "./wellbeing.js";
export * as AI from "./ai.js";
```

- [ ] **Step 10: Install + typecheck**

Run: `pnpm install`
Run: `pnpm --filter @healthpulse/api-client typecheck`
Expected: no errors.

- [ ] **Step 11: Commit**

```powershell
git add packages/api-client pnpm-lock.yaml
git commit -m "feat(api-client): add typed fetch wrapper for all routes"
```

---

### Task 1.6: `.env.example` and GitHub Actions CI

**Files:**
- Create: `.env.example`
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.env.example`**

```env
# ---- Backend ----
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace_me
SUPABASE_JWT_SECRET=replace_me
ANTHROPIC_API_KEY=replace_me
PORT=3001
NODE_ENV=development
AI_DAILY_RATE_LIMIT=10

# ---- Frontend (Vite) ----
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=replace_me
VITE_API_BASE_URL=http://localhost:3001
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

- [ ] **Step 3: Commit**

```powershell
git add .env.example .github
git commit -m "chore: add env example and github actions CI"
```

---

## Phase 2 — Backend Express App

### Task 2.1: Backend package skeleton

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/index.ts`
- Create: `backend/src/app.ts`
- Create: `backend/src/config.ts`
- Create: `backend/src/db/supabase.ts`

- [ ] **Step 1: Create `backend/package.json`**

```json
{
  "name": "@healthpulse/backend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0",
    "@healthpulse/shared": "workspace:*",
    "@supabase/supabase-js": "^2.43.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.2.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/morgan": "^1.9.9",
    "@types/supertest": "^6.0.2",
    "supertest": "^7.0.0",
    "tsx": "^4.7.2",
    "typescript": "^5.4.5",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `backend/tsconfig.json`**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `backend/src/config.ts`**

```ts
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
    jwtSecret: required("SUPABASE_JWT_SECRET"),
  },
  anthropic: {
    apiKey: required("ANTHROPIC_API_KEY"),
  },
  ai: {
    dailyRateLimit: Number(process.env.AI_DAILY_RATE_LIMIT ?? 10),
  },
};
```

- [ ] **Step 4: Create `backend/src/db/supabase.ts`**

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
```

- [ ] **Step 5: Create `backend/src/app.ts`**

```ts
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export function buildApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
```

- [ ] **Step 6: Create `backend/src/index.ts`**

```ts
import { buildApp } from "./app.js";
import { config } from "./config.js";

const app = buildApp();
app.listen(config.port, () => {
  console.log(`HealthPulse API listening on :${config.port}`);
});
```

- [ ] **Step 7: Install**

Run: `pnpm install`
Expected: deps installed.

- [ ] **Step 8: Write smoke test for `/health`**

Create `backend/src/app.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "./app.js";

describe("buildApp", () => {
  it("GET /health returns ok", async () => {
    const app = buildApp();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
```

- [ ] **Step 9: Run test (must mock config)**

Set required env vars or mock. Easiest: create `backend/vitest.setup.ts`:

```ts
process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_SERVICE_ROLE_KEY = "x";
process.env.SUPABASE_JWT_SECRET = "x";
process.env.ANTHROPIC_API_KEY = "x";
```

And `backend/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

- [ ] **Step 10: Run test**

Run: `pnpm --filter @healthpulse/backend test`
Expected: PASS — 1 test.

- [ ] **Step 11: Commit**

```powershell
git add backend pnpm-lock.yaml
git commit -m "feat(backend): scaffold express app with health endpoint"
```

---

### Task 2.2: Auth middleware (Supabase JWT verification)

**Files:**
- Create: `backend/src/middleware/authMiddleware.ts`
- Create: `backend/src/middleware/authMiddleware.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { requireAuth } from "./authMiddleware.js";

describe("requireAuth", () => {
  it("rejects missing Authorization header with 401", async () => {
    const app = express();
    app.get("/p", requireAuth, (_req, res) => res.json({ ok: true }));
    const res = await request(app).get("/p");
    expect(res.status).toBe(401);
  });

  it("rejects malformed token with 401", async () => {
    const app = express();
    app.get("/p", requireAuth, (_req, res) => res.json({ ok: true }));
    const res = await request(app).get("/p").set("Authorization", "Bearer bad");
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test (should fail — file missing)**

Run: `pnpm --filter @healthpulse/backend test src/middleware/authMiddleware.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement middleware**

```ts
import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../db/supabase.js";

export interface AuthedRequest extends Request {
  userId: string;
  accessToken: string;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.header("authorization") ?? req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const { data, error } = await supabaseAdmin().auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  (req as AuthedRequest).userId = data.user.id;
  (req as AuthedRequest).accessToken = token;
  next();
}
```

- [ ] **Step 4: Run test**

Run: `pnpm --filter @healthpulse/backend test src/middleware/authMiddleware.test.ts`
Expected: PASS — 2 tests (missing header + malformed both 401).

> Note: the "malformed" case will reach Supabase and fail with an error → 401. In CI this requires `SUPABASE_URL` to point somewhere; tests use the setup-file env. If the network call is flaky, mock `supabaseAdmin().auth.getUser` instead — but the 401 outcome is what matters.

- [ ] **Step 5: Commit**

```powershell
git add backend/src/middleware
git commit -m "feat(backend): add JWT auth middleware"
```

---

### Task 2.3: Rate limiter middleware (AI 10/day)

**Files:**
- Create: `backend/src/middleware/rateLimiter.ts`
- Create: `backend/src/middleware/rateLimiter.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { aiRateLimiter, _resetRateLimit } from "./rateLimiter.js";

function appWith(userId: string) {
  const app = express();
  app.use((req, _res, next) => {
    (req as any).userId = userId;
    next();
  });
  app.post("/x", aiRateLimiter(3), (_req, res) => res.json({ ok: true }));
  return app;
}

describe("aiRateLimiter", () => {
  beforeEach(() => _resetRateLimit());

  it("allows up to the limit then 429", async () => {
    const app = appWith("u1");
    for (let i = 0; i < 3; i++) {
      const r = await request(app).post("/x");
      expect(r.status).toBe(200);
    }
    const r = await request(app).post("/x");
    expect(r.status).toBe(429);
  });
});
```

- [ ] **Step 2: Run test (fail)**

Run: `pnpm --filter @healthpulse/backend test src/middleware/rateLimiter.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
import type { Request, Response, NextFunction } from "express";
import type { AuthedRequest } from "./authMiddleware.js";

interface Bucket {
  date: string;
  count: number;
}
const buckets = new Map<string, Bucket>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function _resetRateLimit() {
  buckets.clear();
}

export function aiRateLimiter(limit: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    const userId = (req as AuthedRequest).userId;
    if (!userId) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    const today = todayKey();
    const b = buckets.get(userId);
    if (!b || b.date !== today) {
      buckets.set(userId, { date: today, count: 1 });
      next();
      return;
    }
    if (b.count >= limit) {
      res.status(429).json({ error: "rate_limit_exceeded", limit });
      return;
    }
    b.count += 1;
    next();
  };
}
```

- [ ] **Step 4: Run test**

Run: `pnpm --filter @healthpulse/backend test src/middleware/rateLimiter.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add backend/src/middleware/rateLimiter.ts backend/src/middleware/rateLimiter.test.ts
git commit -m "feat(backend): add per-user daily AI rate limiter"
```

---

### Task 2.4: Disclaimer guard

**Files:**
- Create: `backend/src/middleware/disclaimerGuard.ts`
- Create: `backend/src/middleware/disclaimerGuard.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { withDisclaimer, DISCLAIMER } from "./disclaimerGuard.js";

describe("withDisclaimer", () => {
  it("appends disclaimer field to response", () => {
    const out = withDisclaimer({ insights: "x", possible_causes: [], recommendations: [], urgency_level: "low" });
    expect(out.disclaimer).toBe(DISCLAIMER);
  });

  it("never overwrites an existing disclaimer with empty string", () => {
    const out = withDisclaimer({ insights: "x", possible_causes: [], recommendations: [], urgency_level: "low", disclaimer: "" });
    expect(out.disclaimer).toBe(DISCLAIMER);
  });
});
```

- [ ] **Step 2: Run test (fail)**

Run: `pnpm --filter @healthpulse/backend test src/middleware/disclaimerGuard.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
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
```

- [ ] **Step 4: Run test**

Run: `pnpm --filter @healthpulse/backend test src/middleware/disclaimerGuard.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add backend/src/middleware/disclaimerGuard.ts backend/src/middleware/disclaimerGuard.test.ts
git commit -m "feat(backend): add disclaimer guard"
```

---

### Task 2.5: Initial DB migration SQL

**Files:**
- Create: `backend/supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create migration**

```sql
-- 001_initial_schema.sql
-- HealthPulse AI baseline schema

create extension if not exists "pgcrypto";

-- symptom_entries
create table if not exists symptom_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  symptoms    jsonb not null,
  notes       text,
  created_at  timestamptz default now()
);
create index if not exists idx_symptom_entries_user_date
  on symptom_entries (user_id, date desc);

-- vitals
create table if not exists vitals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  heart_rate  int,
  systolic    int,
  diastolic   int,
  temp_c      numeric(4,1),
  weight_kg   numeric(5,1)
);
create index if not exists idx_vitals_user_date on vitals (user_id, date desc);

-- mood_logs
create table if not exists mood_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  mood        int check (mood between 1 and 5),
  energy      int check (energy between 1 and 5),
  sleep_hours numeric(3,1)
);
create index if not exists idx_mood_user_date on mood_logs (user_id, date desc);

-- wellbeing_entries
create table if not exists wellbeing_entries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users not null,
  date              date not null,
  gratitude_things  text[] default '{}',
  gratitude_people  text[] default '{}',
  goals_short_term  text[] default '{}',
  goals_long_term   text[] default '{}',
  tomorrow_tasks    text[] default '{}',
  created_at        timestamptz default now(),
  unique (user_id, date)
);
create index if not exists idx_wellbeing_user_date
  on wellbeing_entries (user_id, date desc);

-- ai_analyses
create table if not exists ai_analyses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  entry_id    uuid references symptom_entries,
  response    jsonb not null,
  model       text,
  tokens_used int,
  created_at  timestamptz default now()
);
create index if not exists idx_ai_analyses_user_created
  on ai_analyses (user_id, created_at desc);

-- RLS
alter table symptom_entries  enable row level security;
alter table vitals            enable row level security;
alter table mood_logs         enable row level security;
alter table ai_analyses       enable row level security;
alter table wellbeing_entries enable row level security;

create policy "own_data_symptom" on symptom_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_data_vitals" on vitals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_data_mood" on mood_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_data_ai" on ai_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_data_wellbeing" on wellbeing_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

- [ ] **Step 2: Commit**

```powershell
git add backend/supabase/migrations/001_initial_schema.sql
git commit -m "feat(db): initial schema migration with RLS"
```

---

### Task 2.6: Wire middleware into app and verify CI

**Files:**
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Add placeholder route mount**

Replace the body of `buildApp` (keep `/health`):

```ts
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export function buildApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // v1 routes mounted in Phase 4+
  return app;
}
```

- [ ] **Step 2: Typecheck + tests**

Run: `pnpm --filter @healthpulse/backend typecheck`
Run: `pnpm --filter @healthpulse/backend test`
Expected: all green.

- [ ] **Step 3: Commit**

```powershell
git add backend/src/app.ts
git commit -m "chore(backend): prepare app for v1 route mounts"
```

---

## Phase 3 — Web App Skeleton + Auth

### Task 3.1: `apps/web` Vite scaffold + Tailwind

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/tsconfig.node.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/postcss.config.cjs`
- Create: `apps/web/tailwind.config.cjs`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/styles/globals.css`

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "@healthpulse/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@healthpulse/api-client": "workspace:*",
    "@healthpulse/shared": "workspace:*",
    "@healthpulse/store": "workspace:*",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/auth-ui-react": "^0.4.7",
    "@supabase/auth-ui-shared": "^0.1.8",
    "@tanstack/react-query": "^5.40.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.5",
    "@testing-library/react": "^15.0.7",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.2.13",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `apps/web/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["vite/client", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create `apps/web/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `apps/web/vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 5: Create `apps/web/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HealthPulse AI</title>
  </head>
  <body class="bg-slate-50 text-slate-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `apps/web/postcss.config.cjs`**

```js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 7: Create `apps/web/tailwind.config.cjs`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          500: "#1A56DB",
          600: "#1648b8",
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 8: Create `apps/web/src/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
```

- [ ] **Step 9: Create `apps/web/src/App.tsx`**

```tsx
export default function App() {
  return (
    <main className="flex h-full items-center justify-center">
      <h1 className="text-3xl font-bold text-brand-600">HealthPulse AI</h1>
    </main>
  );
}
```

- [ ] **Step 10: Create `apps/web/src/main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 11: Create `apps/web/src/test/setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 12: Install + dev sanity**

Run: `pnpm install`
Run: `pnpm --filter @healthpulse/web build`
Expected: clean build, no errors.

- [ ] **Step 13: Commit**

```powershell
git add apps/web pnpm-lock.yaml
git commit -m "feat(web): scaffold vite + react + tailwind"
```

---

### Task 3.2: Supabase client + Query provider + Router

**Files:**
- Create: `apps/web/src/lib/supabase.ts`
- Create: `apps/web/src/lib/queryClient.ts`
- Create: `apps/web/src/lib/apiConfig.ts`
- Modify: `apps/web/src/main.tsx`
- Modify: `apps/web/src/App.tsx`
- Create: `apps/web/src/routes/index.tsx`
- Create: `apps/web/src/pages/LandingPage.tsx`
- Create: `apps/web/src/pages/AuthPage.tsx`
- Create: `apps/web/src/pages/DashboardPage.tsx`
- Create: `apps/web/src/pages/NewEntryPage.tsx`
- Create: `apps/web/src/pages/EntryDetailPage.tsx`
- Create: `apps/web/src/pages/WellbeingPage.tsx`
- Create: `apps/web/src/pages/WellbeingDetailPage.tsx`
- Create: `apps/web/src/pages/HistoryPage.tsx`
- Create: `apps/web/src/pages/InsightsPage.tsx`
- Create: `apps/web/src/components/ProtectedRoute.tsx`
- Create: `apps/web/src/components/Layout.tsx`

- [ ] **Step 1: Create `apps/web/src/lib/supabase.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

- [ ] **Step 2: Create `apps/web/src/lib/queryClient.ts`**

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});
```

- [ ] **Step 3: Create `apps/web/src/lib/apiConfig.ts`**

```ts
import { useAuthStore } from "@healthpulse/store";
import type { ApiClientConfig } from "@healthpulse/api-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

export const apiConfig: ApiClientConfig = {
  baseUrl,
  getToken: () => useAuthStore.getState().accessToken,
};
```

- [ ] **Step 4: Create page stubs**

Each of `LandingPage.tsx`, `AuthPage.tsx`, `DashboardPage.tsx`, `NewEntryPage.tsx`, `EntryDetailPage.tsx`, `WellbeingPage.tsx`, `WellbeingDetailPage.tsx`, `HistoryPage.tsx`, `InsightsPage.tsx`. Use this template per file (replace name):

```tsx
export default function DashboardPage() {
  return <div className="p-6">DashboardPage</div>;
}
```

Create all 9 page stubs with their own component names.

- [ ] **Step 5: Create `apps/web/src/components/Layout.tsx`**

```tsx
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);
  const signOut = async () => {
    await supabase.auth.signOut();
    clear();
  };
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-brand-600">
          🌿 HealthPulse AI
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/journal/new">Log</Link>
          <Link to="/journal/wellbeing">Wellbeing</Link>
          <Link to="/history">History</Link>
          <Link to="/insights">Insights</Link>
          {user && (
            <button onClick={signOut} className="text-slate-500 hover:text-slate-900">
              Sign out
            </button>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Create `apps/web/src/components/ProtectedRoute.tsx`**

```tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";

export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
```

- [ ] **Step 7: Create `apps/web/src/routes/index.tsx`**

```tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout.js";
import ProtectedRoute from "../components/ProtectedRoute.js";
import LandingPage from "../pages/LandingPage.js";
import AuthPage from "../pages/AuthPage.js";
import DashboardPage from "../pages/DashboardPage.js";
import NewEntryPage from "../pages/NewEntryPage.js";
import EntryDetailPage from "../pages/EntryDetailPage.js";
import WellbeingPage from "../pages/WellbeingPage.js";
import WellbeingDetailPage from "../pages/WellbeingDetailPage.js";
import HistoryPage from "../pages/HistoryPage.js";
import InsightsPage from "../pages/InsightsPage.js";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/auth", element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/journal/new", element: <NewEntryPage /> },
          { path: "/journal/:id", element: <EntryDetailPage /> },
          { path: "/journal/wellbeing", element: <WellbeingPage /> },
          { path: "/journal/wellbeing/:date", element: <WellbeingDetailPage /> },
          { path: "/history", element: <HistoryPage /> },
          { path: "/insights", element: <InsightsPage /> },
        ],
      },
    ],
  },
]);
```

- [ ] **Step 8: Update `apps/web/src/main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/index.js";
import { queryClient } from "./lib/queryClient.js";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

- [ ] **Step 9: Drop the old `App.tsx`**

Delete `apps/web/src/App.tsx` (no longer referenced).

```powershell
Remove-Item apps/web/src/App.tsx
```

- [ ] **Step 10: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck`
Run: `pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 11: Commit**

```powershell
git add apps/web
git commit -m "feat(web): add router, supabase client, query provider, and page stubs"
```

---

### Task 3.3: Auth bridge — sync Supabase session into Zustand

**Files:**
- Create: `apps/web/src/lib/useAuthBridge.ts`
- Modify: `apps/web/src/pages/AuthPage.tsx`
- Modify: `apps/web/src/pages/LandingPage.tsx`
- Modify: `apps/web/src/main.tsx`

- [ ] **Step 1: Create `apps/web/src/lib/useAuthBridge.ts`**

```ts
import { useEffect } from "react";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "./supabase.js";

export function useAuthBridge() {
  const setSession = useAuthStore((s) => s.setSession);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(
          { id: data.session.user.id, email: data.session.user.email ?? "" },
          data.session.access_token,
        );
      } else {
        setSession(null, null);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        setSession(
          { id: session.user.id, email: session.user.email ?? "" },
          session.access_token,
        );
      } else {
        setSession(null, null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [setSession]);
}
```

- [ ] **Step 2: Create `apps/web/src/components/AuthBridge.tsx`**

```tsx
import { useAuthBridge } from "../lib/useAuthBridge.js";

export default function AuthBridge() {
  useAuthBridge();
  return null;
}
```

- [ ] **Step 3: Mount `AuthBridge` in `main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes/index.js";
import { queryClient } from "./lib/queryClient.js";
import AuthBridge from "./components/AuthBridge.js";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthBridge />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

- [ ] **Step 4: Implement `AuthPage.tsx`**

```tsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "../lib/supabase.js";

export default function AuthPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Sign in to HealthPulse</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        magicLink
      />
    </div>
  );
}
```

- [ ] **Step 5: Implement `LandingPage.tsx`**

```tsx
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@healthpulse/store";

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <section className="mx-auto max-w-3xl p-12 text-center">
      <h1 className="text-5xl font-bold text-brand-600">HealthPulse AI</h1>
      <p className="mt-4 text-lg text-slate-600">
        Your AI-powered health journal & wellbeing companion.
      </p>
      <Link
        to="/auth"
        className="mt-8 inline-block rounded bg-brand-500 px-6 py-3 text-white"
      >
        Get started →
      </Link>
    </section>
  );
}
```

- [ ] **Step 6: Build + typecheck**

Run: `pnpm --filter @healthpulse/web typecheck`
Run: `pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 7: Commit**

```powershell
git add apps/web
git commit -m "feat(web): wire supabase auth into zustand and protect routes"
```

---

## Phase 4 — Health Journal CRUD

### Task 4.1: Backend — entries route (POST + list + get)

**Files:**
- Create: `backend/src/routes/entries.ts`
- Create: `backend/src/routes/entries.test.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Implement `backend/src/routes/entries.ts`**

```ts
import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

const symptomSchema = z.object({
  name: z.string().min(1),
  severity: z.number().int().min(1).max(10),
  location: z.string().optional(),
});

const createSchema = z.object({
  entry: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    symptoms: z.array(symptomSchema).min(1),
    notes: z.string().optional(),
  }),
  vital: z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      heart_rate: z.number().int().positive().optional(),
      systolic: z.number().int().positive().optional(),
      diastolic: z.number().int().positive().optional(),
      temp_c: z.number().optional(),
      weight_kg: z.number().optional(),
    })
    .optional(),
  mood: z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      mood: z.number().int().min(1).max(5),
      energy: z.number().int().min(1).max(5),
      sleep_hours: z.number().min(0).max(24).optional(),
    })
    .optional(),
});

export const entriesRouter: Router = Router();
entriesRouter.use(requireAuth);

entriesRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.parse(req.body);
    const userId = (req as AuthedRequest).userId;
    const sb = supabaseAdmin();

    const { data: entry, error: e1 } = await sb
      .from("symptom_entries")
      .insert({
        user_id: userId,
        date: parsed.entry.date,
        symptoms: parsed.entry.symptoms,
        notes: parsed.entry.notes ?? null,
      })
      .select()
      .single();
    if (e1) throw e1;

    if (parsed.vital) {
      const { error: e2 } = await sb
        .from("vitals")
        .insert({ user_id: userId, ...parsed.vital });
      if (e2) throw e2;
    }
    if (parsed.mood) {
      const { error: e3 } = await sb
        .from("mood_logs")
        .insert({ user_id: userId, ...parsed.mood });
      if (e3) throw e3;
    }

    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
});

entriesRouter.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)));
    const userId = (req as AuthedRequest).userId;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdmin()
      .from("symptom_entries")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .range(from, to);
    if (error) throw error;

    res.json({ entries: data ?? [], total: count ?? 0 });
  } catch (err) {
    next(err);
  }
});

entriesRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("symptom_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("id", req.params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ entry: data });
  } catch (err) {
    next(err);
  }
});
```

- [ ] **Step 2: Add global error handler + route mount**

Update `backend/src/app.ts`:

```ts
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";
import { entriesRouter } from "./routes/entries.js";

export function buildApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/v1/entries", entriesRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "validation_error", issues: err.issues });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "internal_error" });
  });

  return app;
}
```

- [ ] **Step 3: Write smoke test (validation path)**

`backend/src/routes/entries.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../app.js";

describe("POST /api/v1/entries", () => {
  it("rejects missing Authorization with 401", async () => {
    const res = await request(buildApp())
      .post("/api/v1/entries")
      .send({ entry: { date: "2026-05-28", symptoms: [{ name: "x", severity: 5 }] } });
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @healthpulse/backend test`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add backend/src/routes/entries.ts backend/src/routes/entries.test.ts backend/src/app.ts
git commit -m "feat(backend): add entries POST/GET routes with validation"
```

---

### Task 4.2: Backend — vitals + mood read routes

**Files:**
- Create: `backend/src/routes/vitals.ts`
- Create: `backend/src/routes/mood.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Create `backend/src/routes/vitals.ts`**

```ts
import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

export const vitalsRouter: Router = Router();
vitalsRouter.use(requireAuth);

vitalsRouter.get("/", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    let q = supabaseAdmin().from("vitals").select("*").eq("user_id", userId);
    if (from) q = q.gte("date", from);
    if (to) q = q.lte("date", to);
    const { data, error } = await q.order("date", { ascending: true });
    if (error) throw error;
    res.json({ vitals: data ?? [] });
  } catch (err) {
    next(err);
  }
});
```

- [ ] **Step 2: Create `backend/src/routes/mood.ts`**

```ts
import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

export const moodRouter: Router = Router();
moodRouter.use(requireAuth);

moodRouter.get("/", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    let q = supabaseAdmin().from("mood_logs").select("*").eq("user_id", userId);
    if (from) q = q.gte("date", from);
    if (to) q = q.lte("date", to);
    const { data, error } = await q.order("date", { ascending: true });
    if (error) throw error;
    res.json({ mood: data ?? [] });
  } catch (err) {
    next(err);
  }
});
```

- [ ] **Step 3: Mount in `app.ts`**

Add after the entries mount:

```ts
import { vitalsRouter } from "./routes/vitals.js";
import { moodRouter } from "./routes/mood.js";
// ...
app.use("/api/v1/vitals", vitalsRouter);
app.use("/api/v1/mood", moodRouter);
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @healthpulse/backend typecheck`
Expected: pass.

- [ ] **Step 5: Commit**

```powershell
git add backend/src/routes/vitals.ts backend/src/routes/mood.ts backend/src/app.ts
git commit -m "feat(backend): add vitals and mood list routes"
```

---

### Task 4.3: Web — New Entry form

**Files:**
- Modify: `apps/web/src/pages/NewEntryPage.tsx`
- Create: `apps/web/src/components/entry/SymptomList.tsx`
- Create: `apps/web/src/components/entry/VitalsFields.tsx`
- Create: `apps/web/src/components/entry/MoodFields.tsx`

- [ ] **Step 1: Create `SymptomList.tsx`**

```tsx
import { useState } from "react";
import type { Symptom } from "@healthpulse/shared";

interface Props {
  value: Symptom[];
  onChange: (next: Symptom[]) => void;
}

export default function SymptomList({ value, onChange }: Props) {
  const [name, setName] = useState("");

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...value, { name: trimmed, severity: 5 }]);
    setName("");
  };

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const setSeverity = (i: number, severity: number) =>
    onChange(value.map((s, j) => (j === i ? { ...s, severity } : s)));
  const setLocation = (i: number, location: string) =>
    onChange(value.map((s, j) => (j === i ? { ...s, location } : s)));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Type a symptom (e.g. headache)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button
          type="button"
          className="rounded bg-brand-500 px-3 py-2 text-white"
          onClick={add}
        >
          + Add
        </button>
      </div>
      <ul className="space-y-2">
        {value.map((s, i) => (
          <li key={i} className="rounded border p-3">
            <div className="flex items-center justify-between">
              <strong>{s.name}</strong>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
            <label className="block text-sm mt-2">
              Severity: {s.severity}
              <input
                type="range"
                min={1}
                max={10}
                value={s.severity}
                onChange={(e) => setSeverity(i, Number(e.target.value))}
                className="w-full"
              />
            </label>
            <input
              className="mt-2 w-full rounded border px-2 py-1 text-sm"
              placeholder="Location (optional)"
              value={s.location ?? ""}
              onChange={(e) => setLocation(i, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Create `VitalsFields.tsx`**

```tsx
import type { NewVital } from "@healthpulse/shared";

interface Props {
  value: Omit<NewVital, "date">;
  onChange: (v: Omit<NewVital, "date">) => void;
}

export default function VitalsFields({ value, onChange }: Props) {
  const set = (k: keyof Omit<NewVital, "date">, v: string) =>
    onChange({ ...value, [k]: v === "" ? undefined : Number(v) });
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Heart rate (bpm)" value={value.heart_rate} onChange={(v) => set("heart_rate", v)} />
      <Field label="Systolic (mmHg)" value={value.systolic} onChange={(v) => set("systolic", v)} />
      <Field label="Diastolic (mmHg)" value={value.diastolic} onChange={(v) => set("diastolic", v)} />
      <Field label="Temp (°C)" value={value.temp_c} onChange={(v) => set("temp_c", v)} step="0.1" />
      <Field label="Weight (kg)" value={value.weight_kg} onChange={(v) => set("weight_kg", v)} step="0.1" />
    </div>
  );
}

function Field(props: { label: string; value: number | undefined; onChange: (v: string) => void; step?: string }) {
  return (
    <label className="block text-sm">
      <span>{props.label}</span>
      <input
        type="number"
        step={props.step ?? "1"}
        className="mt-1 w-full rounded border px-2 py-1"
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}
```

- [ ] **Step 3: Create `MoodFields.tsx`**

```tsx
import type { NewMoodLog } from "@healthpulse/shared";

interface Props {
  value: Omit<NewMoodLog, "date">;
  onChange: (v: Omit<NewMoodLog, "date">) => void;
}

const MOODS = ["😞", "😟", "😐", "🙂", "😄"];

export default function MoodFields({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm mb-1">Mood</div>
        <div className="flex gap-2">
          {MOODS.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange({ ...value, mood: i + 1 })}
              className={`text-2xl rounded px-2 py-1 ${value.mood === i + 1 ? "bg-brand-50 ring-2 ring-brand-500" : ""}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm mb-1">Energy ({value.energy})</div>
        <input
          type="range"
          min={1}
          max={5}
          value={value.energy}
          onChange={(e) => onChange({ ...value, energy: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <label className="block text-sm">
        Sleep hours
        <input
          type="number"
          step="0.5"
          min={0}
          max={24}
          value={value.sleep_hours ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              sleep_hours: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 4: Implement `NewEntryPage.tsx`**

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Entries } from "@healthpulse/api-client";
import { todayISO, type Symptom } from "@healthpulse/shared";
import { apiConfig } from "../lib/apiConfig.js";
import SymptomList from "../components/entry/SymptomList.js";
import VitalsFields from "../components/entry/VitalsFields.js";
import MoodFields from "../components/entry/MoodFields.js";

export default function NewEntryPage() {
  const nav = useNavigate();
  const date = todayISO();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState("");
  const [vital, setVital] = useState({});
  const [mood, setMood] = useState({ mood: 3, energy: 3, sleep_hours: undefined as number | undefined });

  const mutation = useMutation({
    mutationFn: () =>
      Entries.createEntry(apiConfig, {
        entry: { date, symptoms, notes: notes || undefined },
        vital: Object.keys(vital).length > 0 ? { date, ...(vital as any) } : undefined,
        mood: { date, ...mood },
      }),
    onSuccess: (data) => nav(`/journal/${data.entry.id}`),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.length === 0) return;
    mutation.mutate();
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Log today — {date}</h1>

      <section>
        <h2 className="font-semibold mb-2">Symptoms</h2>
        <SymptomList value={symptoms} onChange={setSymptoms} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Vitals (optional)</h2>
        <VitalsFields value={vital} onChange={setVital as any} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Mood & Sleep</h2>
        <MoodFields value={mood} onChange={setMood} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={4}
        />
      </section>

      {mutation.isError && (
        <p className="text-red-600 text-sm">Failed to save. Try again.</p>
      )}

      <button
        type="submit"
        disabled={symptoms.length === 0 || mutation.isPending}
        className="rounded bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck`
Run: `pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 6: Commit**

```powershell
git add apps/web
git commit -m "feat(web): implement journal entry form"
```

---

### Task 4.4: Web — Entry detail page

**Files:**
- Modify: `apps/web/src/pages/EntryDetailPage.tsx`

- [ ] **Step 1: Implement detail page**

```tsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Entries } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

export default function EntryDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => Entries.getEntry(apiConfig, id),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error || !data) return <div className="p-6 text-red-600">Could not load entry.</div>;

  const e = data.entry;
  return (
    <article className="mx-auto max-w-2xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{e.date}</h1>
        <Link to="/history" className="text-sm text-brand-600">
          ← Back
        </Link>
      </header>
      <section>
        <h2 className="font-semibold">Symptoms</h2>
        <ul className="mt-1 space-y-1">
          {e.symptoms.map((s, i) => (
            <li key={i}>
              <strong>{s.name}</strong> — severity {s.severity}
              {s.location && <> at {s.location}</>}
            </li>
          ))}
        </ul>
      </section>
      {e.notes && (
        <section>
          <h2 className="font-semibold">Notes</h2>
          <p className="whitespace-pre-wrap">{e.notes}</p>
        </section>
      )}
      <section className="rounded border bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          AI analysis is added in Phase 6.
        </p>
      </section>
    </article>
  );
}
```

- [ ] **Step 2: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck`
Run: `pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 3: Commit**

```powershell
git add apps/web/src/pages/EntryDetailPage.tsx
git commit -m "feat(web): implement entry detail page"
```

---

### Task 4.5: Web — History page (health tab) + Dashboard

**Files:**
- Modify: `apps/web/src/pages/HistoryPage.tsx`
- Modify: `apps/web/src/pages/DashboardPage.tsx`

- [ ] **Step 1: Implement `HistoryPage.tsx` (health tab only for now)**

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Entries } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

type Tab = "health" | "wellbeing";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("health");
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <div className="mb-4 flex gap-2 border-b">
        {(["health", "wellbeing"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 ${tab === t ? "border-b-2 border-brand-500 font-semibold" : ""}`}
          >
            {t === "health" ? "Health" : "Wellbeing"}
          </button>
        ))}
      </div>
      {tab === "health" ? <HealthList /> : <p className="text-slate-500">Wellbeing tab — Phase 5.</p>}
    </div>
  );
}

function HealthList() {
  const { data, isLoading } = useQuery({
    queryKey: ["entries"],
    queryFn: () => Entries.listEntries(apiConfig, 1, 50),
  });
  if (isLoading) return <p>Loading…</p>;
  if (!data || data.entries.length === 0)
    return <p className="text-slate-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {data.entries.map((e) => (
        <li key={e.id} className="rounded border p-3">
          <Link to={`/journal/${e.id}`} className="font-semibold">
            {e.date}
          </Link>
          <div className="text-sm text-slate-600">
            {e.symptoms.map((s) => s.name).join(", ")}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Implement `DashboardPage.tsx`**

```tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Entries } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["entries", "recent"],
    queryFn: () => Entries.listEntries(apiConfig, 1, 5),
  });
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/journal/new"
          className="rounded bg-brand-500 px-4 py-2 text-white"
        >
          + Log Today
        </Link>
      </div>

      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-2">Recent entries</h2>
        {!data || data.entries.length === 0 ? (
          <p className="text-slate-500">No entries yet — log your first one!</p>
        ) : (
          <ul className="space-y-1">
            {data.entries.map((e) => (
              <li key={e.id}>
                <Link to={`/journal/${e.id}`} className="text-brand-600">
                  {e.date}
                </Link>{" "}
                — {e.symptoms.map((s) => s.name).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Wellbeing streak card lives here (Phase 5). */}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 4: Commit**

```powershell
git add apps/web/src/pages/HistoryPage.tsx apps/web/src/pages/DashboardPage.tsx
git commit -m "feat(web): implement history and dashboard pages"
```

---

## Phase 5 — Wellbeing Journal

### Task 5.1: Backend — wellbeing route

**Files:**
- Create: `backend/src/routes/wellbeing.ts`
- Create: `backend/src/routes/wellbeing.test.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Implement `wellbeing.ts`**

```ts
import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

const upsertSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gratitude_things: z.array(z.string()).default([]),
  gratitude_people: z.array(z.string()).default([]),
  goals_short_term: z.array(z.string()).default([]),
  goals_long_term: z.array(z.string()).default([]),
  tomorrow_tasks: z.array(z.string()).default([]),
});

export const wellbeingRouter: Router = Router();
wellbeingRouter.use(requireAuth);

wellbeingRouter.post("/", async (req, res, next) => {
  try {
    const body = upsertSchema.parse(req.body);
    const userId = (req as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("wellbeing_entries")
      .upsert(
        { user_id: userId, ...body },
        { onConflict: "user_id,date" },
      )
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ entry: data });
  } catch (err) {
    next(err);
  }
});

wellbeingRouter.get("/", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabaseAdmin()
      .from("wellbeing_entries")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .range(from, to);
    if (error) throw error;
    res.json({ entries: data ?? [], total: count ?? 0 });
  } catch (err) {
    next(err);
  }
});

wellbeingRouter.get("/:date", async (req, res, next) => {
  try {
    const date = req.params.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "bad_date" });
      return;
    }
    const userId = (req as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("wellbeing_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle();
    if (error) throw error;
    res.json({ entry: data });
  } catch (err) {
    next(err);
  }
});
```

- [ ] **Step 2: Mount in `app.ts`**

```ts
import { wellbeingRouter } from "./routes/wellbeing.js";
// ...
app.use("/api/v1/wellbeing", wellbeingRouter);
```

- [ ] **Step 3: Smoke test**

`backend/src/routes/wellbeing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../app.js";

describe("POST /api/v1/wellbeing", () => {
  it("rejects unauthenticated 401", async () => {
    const res = await request(buildApp())
      .post("/api/v1/wellbeing")
      .send({ date: "2026-05-28", gratitude_things: ["x"] });
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @healthpulse/backend test`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add backend
git commit -m "feat(backend): add wellbeing upsert/list/get-by-date routes"
```

---

### Task 5.2: Web — Wellbeing page

**Files:**
- Create: `apps/web/src/components/wellbeing/EditableList.tsx`
- Modify: `apps/web/src/pages/WellbeingPage.tsx`
- Modify: `apps/web/src/pages/WellbeingDetailPage.tsx`

- [ ] **Step 1: Create `EditableList.tsx`**

```tsx
import { useState } from "react";

interface Props {
  label: string;
  emoji: string;
  value: string[];
  onChange: (next: string[]) => void;
}

export default function EditableList({ label, emoji, value, onChange }: Props) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...value, t]);
    setDraft("");
  };
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const update = (i: number, next: string) =>
    onChange(value.map((v, j) => (j === i ? next : v)));

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="font-semibold mb-2">
        {emoji} {label}
      </h2>
      <ul className="space-y-1">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-slate-400">○</span>
            <input
              className="flex-1 rounded border px-2 py-1"
              value={item}
              onChange={(e) => update(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded border px-2 py-1"
          placeholder="Add an item…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} className="rounded bg-brand-500 px-3 py-1 text-white">
          + Add
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement `WellbeingPage.tsx`**

```tsx
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wellbeing } from "@healthpulse/api-client";
import { todayISO, type NewWellbeingEntry } from "@healthpulse/shared";
import { apiConfig } from "../lib/apiConfig.js";
import EditableList from "../components/wellbeing/EditableList.js";

const EMPTY: NewWellbeingEntry = {
  date: "",
  gratitude_things: [],
  gratitude_people: [],
  goals_short_term: [],
  goals_long_term: [],
  tomorrow_tasks: [],
};

export default function WellbeingPage() {
  const date = todayISO();
  const qc = useQueryClient();
  const [form, setForm] = useState<NewWellbeingEntry>({ ...EMPTY, date });

  const existing = useQuery({
    queryKey: ["wellbeing", date],
    queryFn: () => Wellbeing.getWellbeingByDate(apiConfig, date),
  });

  useEffect(() => {
    if (existing.data?.entry) {
      const e = existing.data.entry;
      setForm({
        date: e.date,
        gratitude_things: e.gratitude_things ?? [],
        gratitude_people: e.gratitude_people ?? [],
        goals_short_term: e.goals_short_term ?? [],
        goals_long_term: e.goals_long_term ?? [],
        tomorrow_tasks: e.tomorrow_tasks ?? [],
      });
    }
  }, [existing.data]);

  const save = useMutation({
    mutationFn: () => Wellbeing.upsertWellbeing(apiConfig, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellbeing"] });
      qc.invalidateQueries({ queryKey: ["wellbeing-streak"] });
    },
  });

  const update = (k: keyof NewWellbeingEntry, v: string[]) =>
    setForm({ ...form, [k]: v });

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🌿 Today's Wellbeing Journal</h1>
        <span className="text-slate-500">{date}</span>
      </header>

      <EditableList
        label="Things I'm grateful for today"
        emoji="🙏"
        value={form.gratitude_things}
        onChange={(v) => update("gratitude_things", v)}
      />
      <EditableList
        label="People I'm grateful for"
        emoji="👥"
        value={form.gratitude_people}
        onChange={(v) => update("gratitude_people", v)}
      />
      <EditableList
        label="Short-term goals"
        emoji="🎯"
        value={form.goals_short_term}
        onChange={(v) => update("goals_short_term", v)}
      />
      <EditableList
        label="Long-term goals"
        emoji="🏔️"
        value={form.goals_long_term}
        onChange={(v) => update("goals_long_term", v)}
      />
      <EditableList
        label="Things I want done tomorrow"
        emoji="✅"
        value={form.tomorrow_tasks}
        onChange={(v) => update("tomorrow_tasks", v)}
      />

      <button
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="rounded bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
      >
        {save.isPending ? "Saving…" : "Save Wellbeing Journal"}
      </button>
      {save.isSuccess && <p className="text-green-600">Saved ✓</p>}
    </div>
  );
}
```

- [ ] **Step 3: Implement `WellbeingDetailPage.tsx`**

```tsx
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Wellbeing } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

export default function WellbeingDetailPage() {
  const { date = "" } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["wellbeing", date],
    queryFn: () => Wellbeing.getWellbeingByDate(apiConfig, date),
  });
  if (isLoading) return <p className="p-6">Loading…</p>;
  const e = data?.entry;
  if (!e) return <p className="p-6">No entry for {date}.</p>;

  return (
    <article className="mx-auto max-w-2xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🌿 Wellbeing — {e.date}</h1>
        <Link to="/history" className="text-sm text-brand-600">
          ← Back
        </Link>
      </header>
      <Section title="🙏 Grateful for" items={e.gratitude_things} />
      <Section title="👥 People grateful for" items={e.gratitude_people} />
      <Section title="🎯 Short-term goals" items={e.goals_short_term} />
      <Section title="🏔️ Long-term goals" items={e.goals_long_term} />
      <Section title="✅ Tomorrow" items={e.tomorrow_tasks} />
    </article>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded border bg-white p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">— none —</p>
      ) : (
        <ul className="list-disc pl-5">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): implement wellbeing journal page and detail view"
```

---

### Task 5.3: Web — Wellbeing tab in History + Dashboard streak card

**Files:**
- Modify: `apps/web/src/pages/HistoryPage.tsx`
- Modify: `apps/web/src/pages/DashboardPage.tsx`

- [ ] **Step 1: Add wellbeing list to HistoryPage**

Replace the placeholder branch with a `WellbeingList` component (add at bottom of same file):

```tsx
function WellbeingList() {
  const { data, isLoading } = useQuery({
    queryKey: ["wellbeing"],
    queryFn: () => Wellbeing.listWellbeing(apiConfig, 1, 50),
  });
  if (isLoading) return <p>Loading…</p>;
  if (!data || data.entries.length === 0) return <p className="text-slate-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {data.entries.map((e) => (
        <li key={e.id} className="rounded border p-3">
          <Link to={`/journal/wellbeing/${e.date}`} className="font-semibold">
            {e.date}
          </Link>
          <div className="text-sm text-slate-600">
            {e.gratitude_things[0] ?? "—"}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

Add the import at the top: `import { Wellbeing } from "@healthpulse/api-client";`
And update the JSX: `{tab === "health" ? <HealthList /> : <WellbeingList />}`.

- [ ] **Step 2: Compute streak helper**

Add `apps/web/src/lib/wellbeingStreak.ts`:

```ts
import type { WellbeingEntry } from "@healthpulse/shared";

export function computeStreak(entries: WellbeingEntry[], todayISO: string): number {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  let cursor = new Date(`${todayISO}T00:00:00Z`);
  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!dates.has(iso)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
```

Add a quick test `apps/web/src/lib/wellbeingStreak.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeStreak } from "./wellbeingStreak.js";

describe("computeStreak", () => {
  it("counts consecutive days back from today", () => {
    const entries = [
      { date: "2026-05-28" },
      { date: "2026-05-27" },
      { date: "2026-05-26" },
      { date: "2026-05-24" },
    ] as any;
    expect(computeStreak(entries, "2026-05-28")).toBe(3);
  });

  it("returns 0 when today is missing", () => {
    expect(computeStreak([{ date: "2026-05-27" }] as any, "2026-05-28")).toBe(0);
  });
});
```

Run: `pnpm --filter @healthpulse/web test`
Expected: PASS.

- [ ] **Step 3: Add streak card to DashboardPage**

Add inside `DashboardPage`, after the recent-entries section:

```tsx
import { Wellbeing } from "@healthpulse/api-client";
import { todayISO } from "@healthpulse/shared";
import { computeStreak } from "../lib/wellbeingStreak.js";

// inside the component:
const today = todayISO();
const wb = useQuery({
  queryKey: ["wellbeing-streak"],
  queryFn: () => Wellbeing.listWellbeing(apiConfig, 1, 60),
});
const streak = wb.data ? computeStreak(wb.data.entries, today) : 0;
const todayEntry = wb.data?.entries.find((e) => e.date === today);

// in JSX:
<section className="rounded border bg-emerald-50 p-4 flex items-center justify-between">
  <div>
    <p className="font-semibold">🌿 You've journaled {streak} day{streak === 1 ? "" : "s"} in a row</p>
    {todayEntry ? (
      <p className="text-sm text-emerald-700">
        ✓ Today: {todayEntry.gratitude_things[0] ?? "saved"}
      </p>
    ) : (
      <p className="text-sm text-slate-600">No entry today yet.</p>
    )}
  </div>
  <Link to="/journal/wellbeing" className="rounded bg-emerald-600 px-3 py-2 text-white">
    Write today's entry →
  </Link>
</section>
```

- [ ] **Step 4: Typecheck + build + test**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web test && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): add wellbeing tab and dashboard streak card"
```

---

## Phase 6 — AI Analysis

### Task 6.1: Backend — Claude service

**Files:**
- Create: `backend/src/services/claudeService.ts`
- Create: `backend/src/services/claudeService.test.ts`

- [ ] **Step 1: Implement `claudeService.ts`**

```ts
import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";
import { supabaseAdmin } from "../db/supabase.js";
import { withDisclaimer } from "../middleware/disclaimerGuard.js";
import type { AIAnalysisResponse, SymptomEntry } from "@healthpulse/shared";

export const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `You are a health assistant. You do NOT diagnose conditions.
You suggest possible explanations and recommend when to see a doctor.
Always end with: "This is not medical advice. Consult a healthcare professional."
Respond ONLY in valid JSON: { "insights": string, "possible_causes": string[], "recommendations": string[], "urgency_level": "low" | "moderate" | "high" | "emergency" }`;

function buildUserPrompt(entry: SymptomEntry, past: SymptomEntry[]): string {
  const contextLines = past
    .map((e) => `[${e.date}]: ${e.symptoms.map((s) => `${s.name}(sev ${s.severity})`).join(", ")}${e.notes ? ` notes: ${e.notes}` : ""}`)
    .join("\n");
  return `USER CONTEXT (last ${past.length} entries):\n${contextLines || "(no prior entries)"}\n\nToday (${entry.date}): ${entry.symptoms
    .map((s) => `${s.name}(sev ${s.severity})${s.location ? ` at ${s.location}` : ""}`)
    .join(", ")}${entry.notes ? `\nNotes: ${entry.notes}` : ""}\n\nWhat could be causing this?`;
}

export interface AnalyzeResult {
  response: AIAnalysisResponse;
  model: string;
  tokens_used: number;
}

export async function analyzeEntry(
  userId: string,
  entryId: string,
  client?: Anthropic,
): Promise<AnalyzeResult> {
  const sb = supabaseAdmin();
  const { data: entry, error: e1 } = await sb
    .from("symptom_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", userId)
    .single();
  if (e1 || !entry) throw new Error("entry_not_found");

  const { data: past } = await sb
    .from("symptom_entries")
    .select("*")
    .eq("user_id", userId)
    .lt("created_at", entry.created_at)
    .order("created_at", { ascending: false })
    .limit(7);

  const anthropic = client ?? new Anthropic({ apiKey: config.anthropic.apiKey });
  const result = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(entry as SymptomEntry, (past ?? []) as SymptomEntry[]) }],
  });

  const text = result.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: Partial<AIAnalysisResponse>;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {};
  }
  const response = withDisclaimer(parsed);
  const tokens = result.usage.input_tokens + result.usage.output_tokens;

  return { response, model: MODEL, tokens_used: tokens };
}
```

- [ ] **Step 2: Write a unit test for `buildUserPrompt` indirectly via export**

Add an export at bottom of `claudeService.ts`:

```ts
export const _internal = { buildUserPrompt };
```

`backend/src/services/claudeService.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { _internal } from "./claudeService.js";

describe("buildUserPrompt", () => {
  it("formats entry and past context", () => {
    const entry = {
      id: "1",
      user_id: "u",
      date: "2026-05-28",
      symptoms: [{ name: "headache", severity: 8, location: "left temple" }],
      notes: "started after lunch",
      created_at: "",
    };
    const past = [
      {
        id: "0",
        user_id: "u",
        date: "2026-05-27",
        symptoms: [{ name: "fatigue", severity: 5 }],
        notes: undefined,
        created_at: "",
      },
    ];
    const prompt = _internal.buildUserPrompt(entry as any, past as any);
    expect(prompt).toContain("headache(sev 8) at left temple");
    expect(prompt).toContain("[2026-05-27]");
    expect(prompt).toContain("started after lunch");
  });
});
```

- [ ] **Step 3: Run test**

Run: `pnpm --filter @healthpulse/backend test src/services/claudeService.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add backend/src/services/claudeService.ts backend/src/services/claudeService.test.ts
git commit -m "feat(backend): add Claude service for entry analysis"
```

---

### Task 6.2: Backend — AI routes

**Files:**
- Create: `backend/src/routes/ai.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: Implement `ai.ts`**

```ts
import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";
import { supabaseAdmin } from "../db/supabase.js";
import { analyzeEntry } from "../services/claudeService.js";
import { config } from "../config.js";

const analyzeSchema = z.object({ entry_id: z.string().uuid() });

export const aiRouter: Router = Router();
aiRouter.use(requireAuth);

aiRouter.post(
  "/analyze",
  aiRateLimiter(config.ai.dailyRateLimit),
  async (req, res, next) => {
    try {
      const { entry_id } = analyzeSchema.parse(req.body);
      const userId = (req as AuthedRequest).userId;
      const result = await analyzeEntry(userId, entry_id);

      const { data, error } = await supabaseAdmin()
        .from("ai_analyses")
        .insert({
          user_id: userId,
          entry_id,
          response: result.response,
          model: result.model,
          tokens_used: result.tokens_used,
        })
        .select()
        .single();
      if (error) throw error;
      res.status(200).json({ analysis: data });
    } catch (err) {
      next(err);
    }
  },
);

aiRouter.get("/analyses", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("ai_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json({ analyses: data ?? [] });
  } catch (err) {
    next(err);
  }
});
```

- [ ] **Step 2: Mount in `app.ts`**

```ts
import { aiRouter } from "./routes/ai.js";
// ...
app.use("/api/v1/ai", aiRouter);
```

- [ ] **Step 3: Typecheck + tests**

Run: `pnpm --filter @healthpulse/backend typecheck && pnpm --filter @healthpulse/backend test`
Expected: pass.

- [ ] **Step 4: Commit**

```powershell
git add backend/src/routes/ai.ts backend/src/app.ts
git commit -m "feat(backend): add AI analyze and analyses routes with rate limit"
```

---

### Task 6.3: Web — AI button + result display on EntryDetail

**Files:**
- Create: `apps/web/src/components/ai/UrgencyBadge.tsx`
- Create: `apps/web/src/components/ai/AnalysisCard.tsx`
- Modify: `apps/web/src/pages/EntryDetailPage.tsx`

- [ ] **Step 1: Create `UrgencyBadge.tsx`**

```tsx
import type { UrgencyLevel } from "@healthpulse/shared";

const styles: Record<UrgencyLevel, { bg: string; label: string }> = {
  low: { bg: "bg-green-100 text-green-800", label: "No immediate concern" },
  moderate: { bg: "bg-yellow-100 text-yellow-800", label: "Monitor symptoms" },
  high: { bg: "bg-orange-100 text-orange-800", label: "Consider seeing a doctor soon" },
  emergency: { bg: "bg-red-600 text-white", label: "Seek immediate medical care" },
};

export default function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const s = styles[level];
  return (
    <span className={`inline-block rounded px-3 py-1 text-sm font-semibold ${s.bg}`}>
      {s.label}
    </span>
  );
}
```

- [ ] **Step 2: Create `AnalysisCard.tsx`**

```tsx
import type { AIAnalysis } from "@healthpulse/shared";
import UrgencyBadge from "./UrgencyBadge.js";

export default function AnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  const r = analysis.response;
  return (
    <div className="rounded border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">AI Analysis</h3>
        <UrgencyBadge level={r.urgency_level} />
      </div>
      <p>{r.insights}</p>
      {r.possible_causes.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm">Possible causes</h4>
          <ul className="list-disc pl-5">
            {r.possible_causes.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
      {r.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm">Recommendations</h4>
          <ul className="list-disc pl-5">
            {r.recommendations.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
      <p className="text-xs text-slate-500">{r.disclaimer}</p>
    </div>
  );
}
```

- [ ] **Step 3: Update `EntryDetailPage.tsx`**

Replace the placeholder AI section with a real one:

```tsx
import { useMutation } from "@tanstack/react-query";
import { AI } from "@healthpulse/api-client";
import AnalysisCard from "../components/ai/AnalysisCard.js";
import type { AIAnalysis } from "@healthpulse/shared";
// ...inside component, after fetching `e`:
const analyze = useMutation({
  mutationFn: () => AI.analyzeEntry(apiConfig, id),
});
const analysis: AIAnalysis | undefined = analyze.data?.analysis;
```

And replace the placeholder JSX:

```tsx
<section className="space-y-3">
  {analysis ? (
    <AnalysisCard analysis={analysis} />
  ) : (
    <button
      onClick={() => analyze.mutate()}
      disabled={analyze.isPending}
      className="rounded bg-brand-500 px-4 py-2 text-white disabled:opacity-50"
    >
      {analyze.isPending ? "Analyzing…" : "🤖 Analyze with AI"}
    </button>
  )}
  {analyze.isError && (
    <p className="text-red-600 text-sm">
      Could not analyze. {(analyze.error as Error).message}
    </p>
  )}
</section>
```

- [ ] **Step 4: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): add AI analysis button and result card"
```

---

## Phase 7 — Insights & Charts

### Task 7.1: Vitals line chart

**Files:**
- Create: `apps/web/src/components/insights/VitalsChart.tsx`

- [ ] **Step 1: Implement `VitalsChart.tsx`**

```tsx
import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Vital } from "@healthpulse/shared";

const METRICS = [
  { key: "heart_rate", label: "Heart rate", color: "#dc2626" },
  { key: "systolic", label: "Systolic", color: "#2563eb" },
  { key: "diastolic", label: "Diastolic", color: "#7c3aed" },
  { key: "temp_c", label: "Temp °C", color: "#ea580c" },
  { key: "weight_kg", label: "Weight kg", color: "#059669" },
] as const;

export default function VitalsChart({ vitals }: { vitals: Vital[] }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    heart_rate: true,
    systolic: true,
    diastolic: true,
    temp_c: false,
    weight_kg: false,
  });
  const data = useMemo(
    () => vitals.map((v) => ({ date: v.date, ...v })),
    [vitals],
  );
  return (
    <div className="rounded border bg-white p-4">
      <div className="flex flex-wrap gap-3 mb-2">
        {METRICS.map((m) => (
          <label key={m.key} className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={enabled[m.key]}
              onChange={(e) => setEnabled({ ...enabled, [m.key]: e.target.checked })}
            />
            <span style={{ color: m.color }}>{m.label}</span>
          </label>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {METRICS.filter((m) => enabled[m.key]).map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              stroke={m.color}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add apps/web/src/components/insights/VitalsChart.tsx
git commit -m "feat(web): add vitals line chart"
```

---

### Task 7.2: Symptom heatmap

**Files:**
- Create: `apps/web/src/components/insights/SymptomHeatmap.tsx`

- [ ] **Step 1: Implement heatmap**

```tsx
import { useMemo } from "react";
import type { SymptomEntry } from "@healthpulse/shared";

const DAYS = 90;

export default function SymptomHeatmap({ entries }: { entries: SymptomEntry[] }) {
  const grid = useMemo(() => buildGrid(entries), [entries]);
  return (
    <div className="rounded border bg-white p-4">
      <h3 className="font-semibold mb-2">Last 90 days</h3>
      <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
        {grid.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.count} symptom(s)`}
            className="aspect-square rounded"
            style={{ background: colorFor(cell.count) }}
          />
        ))}
      </div>
    </div>
  );
}

function buildGrid(entries: SymptomEntry[]) {
  const counts = new Map<string, number>();
  for (const e of entries) {
    counts.set(e.date, (counts.get(e.date) ?? 0) + e.symptoms.length);
  }
  const today = new Date();
  const cells: { date: string; count: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ date: iso, count: counts.get(iso) ?? 0 });
  }
  return cells;
}

function colorFor(n: number): string {
  if (n === 0) return "#e2e8f0";
  if (n === 1) return "#bae6fd";
  if (n === 2) return "#60a5fa";
  if (n <= 4) return "#2563eb";
  return "#1e3a8a";
}
```

- [ ] **Step 2: Commit**

```powershell
git add apps/web/src/components/insights/SymptomHeatmap.tsx
git commit -m "feat(web): add 90-day symptom heatmap"
```

---

### Task 7.3: Mood/energy chart + correlation cards + Insights page

**Files:**
- Create: `apps/web/src/components/insights/MoodTrendChart.tsx`
- Create: `apps/web/src/components/insights/CorrelationCards.tsx`
- Create: `apps/web/src/lib/correlations.ts`
- Create: `apps/web/src/lib/correlations.test.ts`
- Modify: `apps/web/src/pages/InsightsPage.tsx`

- [ ] **Step 1: Create `MoodTrendChart.tsx`**

```tsx
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MoodLog } from "@healthpulse/shared";

export default function MoodTrendChart({ mood }: { mood: MoodLog[] }) {
  return (
    <div className="rounded border bg-white p-4">
      <h3 className="font-semibold mb-2">Mood & energy</h3>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={mood}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" domain={[1, 5]} />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" dataKey="mood" stroke="#1A56DB" />
          <Line yAxisId="left" dataKey="energy" stroke="#059669" />
          <Bar yAxisId="right" dataKey="sleep_hours" fill="#fde68a" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Create `correlations.ts`**

```ts
import type { SymptomEntry, MoodLog } from "@healthpulse/shared";

export interface Correlation {
  title: string;
  detail: string;
}

export function computeCorrelations(
  entries: SymptomEntry[],
  mood: MoodLog[],
): Correlation[] {
  const out: Correlation[] = [];
  const sleepByDate = new Map<string, number>();
  for (const m of mood) {
    if (m.sleep_hours != null) sleepByDate.set(m.date, m.sleep_hours);
  }

  // Headaches following <6h sleep
  let headacheAfterPoorSleep = 0;
  let totalPoorSleepDays = 0;
  const dates = [...sleepByDate.keys()].sort();
  for (const d of dates) {
    if ((sleepByDate.get(d) ?? 99) < 6) {
      totalPoorSleepDays += 1;
      const next = new Date(`${d}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      const nextISO = next.toISOString().slice(0, 10);
      const hadHeadache = entries.some(
        (e) => e.date === nextISO && e.symptoms.some((s) => /headache/i.test(s.name)),
      );
      if (hadHeadache) headacheAfterPoorSleep += 1;
    }
  }
  if (totalPoorSleepDays > 0) {
    out.push({
      title: "Sleep ↔ headaches",
      detail: `Headaches appeared on ${headacheAfterPoorSleep} of ${totalPoorSleepDays} days following < 6 hrs sleep.`,
    });
  }

  // Average mood on high-severity days
  const moodByDate = new Map<string, number>(mood.map((m) => [m.date, m.mood]));
  const highSevDates = entries
    .filter((e) => e.symptoms.some((s) => s.severity >= 7))
    .map((e) => e.date);
  const moods = highSevDates.map((d) => moodByDate.get(d)).filter((x): x is number => x != null);
  if (moods.length > 0) {
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    out.push({
      title: "Mood on high-severity days",
      detail: `Your average mood was ${avg.toFixed(1)} on days with high-severity symptoms.`,
    });
  }

  return out.slice(0, 3);
}
```

- [ ] **Step 3: Test correlations**

`apps/web/src/lib/correlations.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeCorrelations } from "./correlations.js";

describe("computeCorrelations", () => {
  it("links poor sleep to next-day headaches", () => {
    const entries: any = [
      { date: "2026-05-26", symptoms: [{ name: "headache", severity: 5 }] },
    ];
    const mood: any = [{ date: "2026-05-25", mood: 3, energy: 3, sleep_hours: 5 }];
    const c = computeCorrelations(entries, mood);
    expect(c[0].detail).toContain("1 of 1");
  });

  it("reports avg mood on high-severity days", () => {
    const entries: any = [
      { date: "2026-05-25", symptoms: [{ name: "x", severity: 8 }] },
      { date: "2026-05-26", symptoms: [{ name: "y", severity: 9 }] },
    ];
    const mood: any = [
      { date: "2026-05-25", mood: 2, energy: 3 },
      { date: "2026-05-26", mood: 2, energy: 3 },
    ];
    const c = computeCorrelations(entries, mood);
    const moodCard = c.find((x) => x.title.includes("Mood"));
    expect(moodCard?.detail).toContain("2.0");
  });
});
```

Run: `pnpm --filter @healthpulse/web test`
Expected: PASS.

- [ ] **Step 4: Create `CorrelationCards.tsx`**

```tsx
import type { Correlation } from "../../lib/correlations.js";

export default function CorrelationCards({ items }: { items: Correlation[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((c, i) => (
        <div key={i} className="rounded border bg-white p-4">
          <h4 className="font-semibold mb-1">{c.title}</h4>
          <p className="text-sm">{c.detail}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Implement `InsightsPage.tsx`**

```tsx
import { useQuery } from "@tanstack/react-query";
import { Entries, Vitals, Mood } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";
import VitalsChart from "../components/insights/VitalsChart.js";
import SymptomHeatmap from "../components/insights/SymptomHeatmap.js";
import MoodTrendChart from "../components/insights/MoodTrendChart.js";
import CorrelationCards from "../components/insights/CorrelationCards.js";
import { computeCorrelations } from "../lib/correlations.js";

export default function InsightsPage() {
  const e = useQuery({ queryKey: ["entries-all"], queryFn: () => Entries.listEntries(apiConfig, 1, 200) });
  const v = useQuery({ queryKey: ["vitals-all"], queryFn: () => Vitals.listVitals(apiConfig) });
  const m = useQuery({ queryKey: ["mood-all"], queryFn: () => Mood.listMood(apiConfig) });

  const entries = e.data?.entries ?? [];
  const vitals = v.data?.vitals ?? [];
  const mood = m.data?.mood ?? [];
  const correlations = computeCorrelations(entries, mood);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Insights</h1>
      <VitalsChart vitals={vitals} />
      <SymptomHeatmap entries={entries} />
      <MoodTrendChart mood={mood} />
      <CorrelationCards items={correlations} />
    </div>
  );
}
```

- [ ] **Step 6: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 7: Commit**

```powershell
git add apps/web
git commit -m "feat(web): implement insights page with charts and correlation cards"
```

---

## Phase 8 — Polish (dark mode, loading, errors, responsive)

### Task 8.1: Dark mode toggle

**Files:**
- Create: `apps/web/src/lib/useTheme.ts`
- Modify: `apps/web/src/components/Layout.tsx`

- [ ] **Step 1: Create `useTheme.ts`**

```ts
import { useEffect, useState } from "react";

const KEY = "hp.theme";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);
  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
```

- [ ] **Step 2: Add toggle to Layout**

In `Layout.tsx`, add to imports:

```tsx
import { useTheme } from "../lib/useTheme.js";
```

And add a button in the nav (before the sign-out):

```tsx
const { theme, toggle } = useTheme();
// ...
<button onClick={toggle} className="text-slate-500">
  {theme === "dark" ? "☀️" : "🌙"}
</button>
```

- [ ] **Step 3: Apply dark variants to globals**

Update `apps/web/src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }

html.dark body {
  background-color: #0f172a;
  color: #e2e8f0;
}
html.dark .bg-white { background-color: #1e293b !important; }
html.dark .border { border-color: #334155 !important; }
```

- [ ] **Step 4: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): add dark mode toggle"
```

---

### Task 8.2: Global error boundary + 404 route

**Files:**
- Create: `apps/web/src/components/ErrorBoundary.tsx`
- Create: `apps/web/src/pages/NotFoundPage.tsx`
- Modify: `apps/web/src/routes/index.tsx`

- [ ] **Step 1: Create `ErrorBoundary.tsx`**

```tsx
import { Component, type ReactNode } from "react";

interface State { error: Error | null; }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error) { console.error(error); }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold text-red-600">Something went wrong</h1>
          <pre className="mt-2 text-sm">{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: Create `NotFoundPage.tsx`**

```tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-12 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">That page doesn't exist.</p>
      <Link to="/dashboard" className="mt-4 inline-block text-brand-600">
        ← Dashboard
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Wire into router**

Update `routes/index.tsx`:

```tsx
import NotFoundPage from "../pages/NotFoundPage.js";
// ...
// Add at the end of the routes array:
{ path: "*", element: <NotFoundPage /> },
```

And wrap `RouterProvider` in `main.tsx` with `<ErrorBoundary>`:

```tsx
import ErrorBoundary from "./components/ErrorBoundary.js";
// ...
<QueryClientProvider client={queryClient}>
  <AuthBridge />
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
</QueryClientProvider>
```

- [ ] **Step 4: Typecheck + build**

Run: `pnpm --filter @healthpulse/web typecheck && pnpm --filter @healthpulse/web build`
Expected: success.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): add error boundary and 404 page"
```

---

## Phase 9 — Deploy

### Task 9.1: Vercel + Render config

**Files:**
- Create: `apps/web/vercel.json`
- Create: `backend/render.yaml`
- Modify: `README.md` (add deploy section)

- [ ] **Step 1: Create `apps/web/vercel.json`**

```json
{
  "buildCommand": "cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @healthpulse/web build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Create `backend/render.yaml`**

```yaml
services:
  - type: web
    name: healthpulse-api
    env: node
    rootDir: backend
    buildCommand: "cd .. && pnpm install --frozen-lockfile && pnpm --filter @healthpulse/backend build"
    startCommand: "pnpm --filter @healthpulse/backend start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: SUPABASE_JWT_SECRET
        sync: false
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: AI_DAILY_RATE_LIMIT
        value: "10"
```

- [ ] **Step 3: Append deploy section to `README.md`**

```markdown
## Deployment

### Web (Vercel)
1. Import the repo into Vercel.
2. Set root to `apps/web` and use the bundled `vercel.json`.
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`.

### Backend (Render)
1. Create a new Web Service from this repo, pointing at `backend/render.yaml`.
2. Set the secrets listed in the YAML in the Render dashboard.

### Database (Supabase)
1. Create a new Supabase project.
2. Run `backend/supabase/migrations/001_initial_schema.sql` in the SQL editor.
```

- [ ] **Step 4: Commit**

```powershell
git add apps/web/vercel.json backend/render.yaml README.md
git commit -m "chore: add vercel and render deploy configs"
```

---

## Final Verification

### Task F.1: End-to-end checks

- [ ] **Step 1: Full install**

Run: `pnpm install`
Expected: success.

- [ ] **Step 2: Typecheck all**

Run: `pnpm typecheck`
Expected: all green.

- [ ] **Step 3: Lint all**

Run: `pnpm lint`
Expected: green or only warnings.

- [ ] **Step 4: Test all**

Run: `pnpm test`
Expected: all suites pass.

- [ ] **Step 5: Build all**

Run: `pnpm build`
Expected: success.

- [ ] **Step 6: Commit any final cleanup**

```powershell
git status
# if anything is dirty:
git add -A
git commit -m "chore: final cleanup"
```

---

## Notes & Conventions

- **DRY/YAGNI/TDD:** Tests exist for date utils, rate limiter, disclaimer, Claude prompt builder, streak, and correlations. UI is covered by typecheck + build (heavy E2E is out of scope for MVP).
- **Commits:** Each task ends with a commit so progress is reviewable.
- **PowerShell:** All shell snippets use PowerShell-compatible syntax. The repo has `Bash` available via the Bash tool too if preferred.
- **Env:** User must fill `.env` from `.env.example` and run the Supabase migration before any backend route works.
