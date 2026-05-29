# HealthPulse AI
### Symptom Checker & Health Journal

> A full-stack, AI-powered health companion — React Native (iOS/Android) + React Web

![Portfolio Project](https://img.shields.io/badge/Portfolio-Project-1A56DB) ![React Native](https://img.shields.io/badge/React_Native-Expo-7C3AED) ![Claude AI](https://img.shields.io/badge/AI-Claude_Anthropic-B45309) ![License](https://img.shields.io/badge/License-MIT-047857)

---

## 1. Overview

HealthPulse AI is a cross-platform health journaling and AI-powered symptom analysis application. Users log daily symptoms, vitals, and mood, then receive intelligent health insights and trend analysis powered by Claude (Anthropic). The application runs natively on iOS and Android via React Native/Expo, and also as a full web application via React + Vite — sharing a single codebase.

> **Why this project impresses recruiters:**
> - End-to-end AI pipeline (user input → RAG → Claude → structured output)
> - Responsible AI design with medical disclaimers & safety guardrails
> - Cross-platform: one codebase ships iOS, Android, and Web
> - Real-world domain (health tech) with privacy-conscious architecture
> - Charts, biometric auth, push notifications, offline-first storage

---

## 2. Features

### Core Journaling
- Daily symptom logging with severity scale (1–10)
- Vitals tracking: heart rate, blood pressure, temperature, weight
- Mood & energy tracking with emoji-based UI
- Free-text notes with voice-to-text support
- Photo attachments (rashes, swelling, medication labels)

### AI-Powered Analysis
- Symptom pattern recognition using Claude AI
- Possible cause suggestions with confidence levels
- When-to-see-a-doctor recommendations
- Weekly & monthly health trend summaries
- RAG-based context: AI analyzes your full history, not just today
- Smart follow-up questions to clarify ambiguous symptoms

### Dashboard & Visualizations
- Line charts: vitals over time (Recharts / Victory Native)
- Heat-map calendar: symptom frequency view
- Body map: tap where it hurts to log location-specific symptoms
- Correlation insights (e.g., poor sleep → headaches next day)

### Cross-Platform UX
- Shared business logic between mobile and web
- Biometric authentication (Face ID / Touch ID on mobile)
- Push notifications for daily check-in reminders
- Offline-first: works without internet, syncs when reconnected
- Dark mode support

---

## 3. Architecture

### High-Level Overview

```
┌────────────────────────────────────────────────────────────┐
│                CLIENT LAYER (Shared Codebase)              │
│   React Native / Expo (iOS + Android)                      │
│   React + Vite (Web)                                       │
│   Shared: components, hooks, store, utils                  │
└───────────────┬────────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────────────────────────┐
│           BACKEND LAYER (Node.js + Express)                │
│   REST API  │  Auth Middleware  │  AI Proxy Service        │
│   Rate Limiting  │  Medical Disclaimer Guard               │
└───────────────┬─────────┬───────────────────────────┬──────┘
                │         │                           │
          Supabase     Supabase                  Anthropic
          (Postgres    Auth                      Claude API
           + pgvector)
```

### Directory Structure

```
healthpulse-ai/
├── apps/
│   ├── mobile/          # Expo (React Native) — iOS & Android
│   └── web/             # Vite + React — browser
├── packages/
│   ├── shared/          # Components, hooks, utils shared across platforms
│   ├── store/           # Zustand state management
│   └── api-client/      # Typed API calls
├── backend/
│   ├── src/
│   │   ├── routes/      # Express route handlers
│   │   ├── services/    # AI service, embedding service
│   │   ├── middleware/  # Auth, rate limit, disclaimer guard
│   │   └── db/          # Supabase client + schema
│   └── supabase/        # Migrations & edge functions
├── .env.example
├── package.json         # Monorepo root (pnpm workspaces)
└── README.md
```

---

## 4. Technology Stack (100% Free Tier)

| Layer | Technology | Purpose |
|---|---|---|
| Mobile | React Native + Expo | Cross-platform iOS & Android from one codebase |
| Web | React + Vite | Fast web build sharing same component library |
| Shared UI | NativeWind (Tailwind) | One design system across mobile and web |
| State | Zustand | Lightweight, boilerplate-free global state |
| Navigation | Expo Router | File-based routing, works on web + native |
| Backend | Node.js + Express | REST API server, thin proxy to AI + DB |
| Database | Supabase (Postgres) | Free tier: 500MB, real-time, row-level security |
| Auth | Supabase Auth | Email, Google OAuth, magic link — free |
| Vector DB | pgvector (Supabase) | Symptom embeddings for RAG — built into Supabase |
| AI Engine | Claude API (Anthropic) | claude-haiku-4-5 for speed/cost on free credits |
| Embeddings | Supabase Edge Functions | Generate vectors on save, store in pgvector |
| Charts Mobile | Victory Native | Animated charts for React Native |
| Charts Web | Recharts | D3-based charts for React web |
| Notifications | Expo Notifications | Push reminders via Expo free push service |
| Offline | MMKV + React Query | Persist cache, retry on reconnect |
| Biometric Auth | expo-local-authentication | Face ID / Touch ID — native APIs |
| Deploy Web | Vercel | Free hosting with auto-deploy from GitHub |
| Deploy API | Render.com | Free tier Node.js server (spins down on idle) |
| CI/CD | GitHub Actions | Free for public repos — lint, test, build |

---

## 5. AI Architecture & RAG Pipeline

The AI layer is the technical centrepiece of this project. Rather than sending raw symptom text to Claude, the app uses **Retrieval-Augmented Generation (RAG)** to provide contextualised health history with every AI query.

### How RAG Works Here

1. User logs a symptom entry (text + severity + vitals)
2. Supabase Edge Function generates an embedding via a lightweight model
3. Vector is stored in `pgvector` alongside the entry
4. When user requests AI analysis, the backend performs semantic similarity search
5. Top-k relevant past entries are injected as context into the Claude prompt
6. Claude returns structured JSON: `insights`, `possible_causes`, `recommendations`, `urgency_level`

### Responsible AI Design

- Every AI response includes a mandatory medical disclaimer
- `urgency_level` field triggers UI alerts (e.g., "seek care immediately")
- Claude is instructed to **never diagnose**, only suggest and recommend
- Rate limiting prevents abuse (10 AI queries/day on free plan)
- System prompt includes explicit safety guardrails reviewed per query

### Example Prompt Structure

```
SYSTEM:
  You are a health assistant. You do NOT diagnose conditions.
  You suggest possible explanations and recommend when to see a doctor.
  Always end with: "This is not medical advice. Consult a healthcare professional."
  Respond ONLY in JSON: { insights, possible_causes, recommendations, urgency_level }

USER CONTEXT (retrieved via RAG):
  Past entries (last 7 most relevant):
  - 2025-05-20: Headache, severity 6, notes: "started after lunch"
  - 2025-05-18: Fatigue, severity 7, heart_rate: 88
  ...

USER:
  Today: Headache (severity 8), nausea, sensitivity to light. What could this be?
```

---

## 6. Database Schema (Supabase / PostgreSQL)

```sql
-- Users managed by Supabase Auth
-- uid, email, display_name, created_at

create table symptom_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  symptoms    jsonb not null,        -- [{ name, severity, location }]
  notes       text,
  embedding   vector(1536),          -- pgvector for RAG
  created_at  timestamptz default now()
);

create table vitals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  heart_rate  int,
  systolic    int,
  diastolic   int,
  temp_c      numeric(4,1),
  weight_kg   numeric(5,1)
);

create table mood_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  mood        int check (mood between 1 and 5),
  energy      int check (energy between 1 and 5),
  sleep_hours numeric(3,1)
);

create table ai_analyses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  entry_id    uuid references symptom_entries,
  response    jsonb not null,         -- full Claude response
  model       text,
  tokens_used int,
  created_at  timestamptz default now()
);

create table body_map_pins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  entry_id    uuid references symptom_entries,
  x_pct       numeric(5,2),           -- % position on body map
  y_pct       numeric(5,2),
  label       text,
  side        text check (side in ('front', 'back'))
);

-- Row-Level Security: users can only access their own data
alter table symptom_entries enable row level security;
alter table vitals           enable row level security;
alter table mood_logs        enable row level security;
alter table ai_analyses      enable row level security;
alter table body_map_pins    enable row level security;

create policy "own data only" on symptom_entries
  for all using (auth.uid() = user_id);
-- (repeat for each table)
```

---

## 7. Prerequisites

Make sure you have the following installed and accounts created before starting:

### Local Tools

| Tool | Version | Install |
|---|---|---|
| Node.js | v20+ (LTS) | [nodejs.org](https://nodejs.org) |
| pnpm | v9+ | `npm install -g pnpm` |
| Expo CLI | Latest | `npm install -g expo` |
| Git | Any recent | [git-scm.com](https://git-scm.com) |

### Free Accounts Required

| Service | Free Tier | Sign Up |
|---|---|---|
| Supabase | 500MB DB, 50k users/month | [supabase.com](https://supabase.com) |
| Anthropic | Free API credits on signup | [console.anthropic.com](https://console.anthropic.com) |
| Vercel | Unlimited personal projects | [vercel.com](https://vercel.com) |
| Render | Free web service (with sleep) | [render.com](https://render.com) |
| Expo | Free builds + push notifications | [expo.dev](https://expo.dev) |
| GitHub | Free public repos + Actions CI | [github.com](https://github.com) |

> **Note:** No credit card is required for any of the above services at the free tier level.

---

## Setup

```bash
pnpm install
cp .env.example .env   # then fill in Supabase + Anthropic keys
pnpm dev:api           # backend on :3001
pnpm dev:web           # web on :5173
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm typecheck` | Strict TypeScript across all packages |
| `pnpm lint` | ESLint across all packages |
| `pnpm test` | Vitest suites (shared, backend, web) |
| `pnpm build` | Build all packages |
| `pnpm dev:web` | Start web dev server |
| `pnpm dev:api` | Start backend dev server (tsx watch) |

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

---

> **Medical Disclaimer:** This application is a portfolio and educational project. It is NOT a medical device and does NOT provide medical advice. All AI-generated content is for informational purposes only. Always consult a qualified healthcare professional for medical concerns.

---

*Built with ❤️ as a software engineering portfolio project. Claude AI by Anthropic. MIT License.*
