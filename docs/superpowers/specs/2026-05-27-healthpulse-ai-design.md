# HealthPulse AI — Design Spec
**Date:** 2026-05-27  
**Status:** Approved  
**Build Target:** Web App (MVP), Feature-by-Feature approach  
**Mobile:** Deferred (Phase 2)

---

## 1. Goals

Build a full-stack, AI-powered health journaling web application that:
- Lets users log daily symptoms, vitals, and mood
- Provides a dedicated Total Wellbeing Journal for gratitude, goals, and daily intentions
- Analyzes health history with Claude AI and surfaces insights
- Visualizes trends with interactive charts
- Serves as a recruiter-ready portfolio project demonstrating: end-to-end AI pipeline, full-stack monorepo, responsible AI design, and real-world domain expertise

---

## 2. Non-Goals (MVP Scope Exclusions)

- Mobile app (iOS/Android via Expo) — deferred to Phase 2
- Body map (touch-first feature — deferred to mobile)
- True pgvector semantic search embeddings — using date-based retrieval for MVP
- Voice-to-text input — deferred
- Photo attachments — deferred
- Biometric authentication — mobile only
- Push notifications — mobile only
- Offline-first (MMKV) — deferred

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Monorepo | pnpm workspaces | Single repo, multiple packages |
| Web App | React 18 + Vite 5 | `apps/web` |
| Styling | Tailwind CSS v3 | Web only (NativeWind deferred to mobile) |
| Routing | React Router v6 | Web SPA routing |
| State (client) | Zustand | Global app state |
| State (server) | React Query (TanStack) | API caching + background sync |
| Auth | Supabase Auth + `@supabase/auth-ui-react` | Email/password + magic link |
| Backend | Node.js 20 + Express 4 | `backend/` |
| Database | Supabase (PostgreSQL) | Free tier, 500MB |
| AI Engine | Anthropic Claude (`claude-haiku-4-5`) | Via `backend/` proxy |
| Charts | Recharts | Line, calendar heatmap |
| Linting | ESLint + Prettier | Shared config |
| Testing | Vitest + Testing Library | Unit + integration |
| CI/CD | GitHub Actions | Lint, test, build on push |
| Deploy (web) | Vercel | Auto-deploy from GitHub |
| Deploy (api) | Render.com | Free Node.js web service |

---

## 4. Project Structure

```
HealthPulseAI/
├── apps/
│   └── web/                      # React + Vite web application
│       ├── src/
│       │   ├── pages/            # Route-level components
│       │   ├── components/       # Feature components
│       │   ├── hooks/            # Custom hooks
│       │   └── main.tsx          # App entry
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   ├── shared/                   # Shared TypeScript types, utils
│   │   ├── src/
│   │   │   ├── types/            # SymptomEntry, Vital, MoodLog, AIAnalysis, WellbeingEntry
│   │   │   └── utils/            # date helpers, validators
│   │   └── package.json
│   ├── store/                    # Zustand store slices
│   │   ├── src/
│   │   │   ├── authStore.ts
│   │   │   ├── entriesStore.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── api-client/               # Typed fetch wrapper
│       ├── src/
│       │   ├── entries.ts
│       │   ├── vitals.ts
│       │   ├── mood.ts
│       │   ├── wellbeing.ts
│       │   ├── ai.ts
│       │   └── index.ts
│       └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── entries.ts        # POST /api/v1/entries, GET /api/v1/entries
│   │   │   ├── vitals.ts
│   │   │   ├── mood.ts
│   │   │   ├── wellbeing.ts      # POST/GET /api/v1/wellbeing
│   │   │   └── ai.ts             # POST /api/v1/ai/analyze
│   │   ├── services/
│   │   │   └── claudeService.ts  # Claude API wrapper + prompt builder
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts # Supabase JWT verification
│   │   │   ├── rateLimiter.ts    # 10 AI req/day per user
│   │   │   └── disclaimerGuard.ts# Appends medical disclaimer
│   │   ├── db/
│   │   │   └── supabase.ts       # Supabase client singleton
│   │   └── index.ts              # Express app entry
│   └── supabase/
│       └── migrations/
│           └── 001_initial_schema.sql
├── .env.example
├── .gitignore
├── pnpm-workspace.yaml
├── package.json                  # Root — scripts + devDeps
├── tsconfig.base.json
└── README.md
```

---

## 5. Database Schema

```sql
-- symptom_entries: core journal entry
create table symptom_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  symptoms    jsonb not null,     -- [{ name: string, severity: 1-10, location?: string }]
  notes       text,
  created_at  timestamptz default now()
);

-- vitals: biometric readings linked to a date
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

-- mood_logs: daily mood, energy, sleep
create table mood_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  mood        int check (mood between 1 and 5),
  energy      int check (energy between 1 and 5),
  sleep_hours numeric(3,1)
);

-- wellbeing_entries: total wellbeing journal
create table wellbeing_entries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users not null,
  date              date not null,
  gratitude_things  text[],        -- things you are grateful for today
  gratitude_people  text[],        -- people you are grateful for today
  goals_short_term  text[],        -- short-term goals (add/remove list)
  goals_long_term   text[],        -- long-term goals (add/remove list)
  tomorrow_tasks    text[],        -- things you want done tomorrow
  created_at        timestamptz default now(),
  unique (user_id, date)           -- one wellbeing entry per user per day
);

-- ai_analyses: stored Claude responses
create table ai_analyses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  entry_id    uuid references symptom_entries,
  response    jsonb not null,     -- { insights, possible_causes, recommendations, urgency_level }
  model       text,
  tokens_used int,
  created_at  timestamptz default now()
);

-- Row-Level Security: users see only their own data
alter table symptom_entries  enable row level security;
alter table vitals            enable row level security;
alter table mood_logs         enable row level security;
alter table ai_analyses       enable row level security;
alter table wellbeing_entries enable row level security;

create policy "own data only" on symptom_entries  for all using (auth.uid() = user_id);
create policy "own data only" on vitals            for all using (auth.uid() = user_id);
create policy "own data only" on mood_logs         for all using (auth.uid() = user_id);
create policy "own data only" on ai_analyses       for all using (auth.uid() = user_id);
create policy "own data only" on wellbeing_entries for all using (auth.uid() = user_id);
```

---

## 6. Web App Pages & Routing

| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Hero + CTA → redirect to `/auth` if not logged in |
| `/auth` | `AuthPage` | Supabase Auth UI — login, signup, magic link |
| `/dashboard` | `DashboardPage` | Recent entries, quick stat cards, "Log Today" CTA + wellbeing streak |
| `/journal/new` | `NewEntryPage` | Full form: symptoms, vitals, mood, notes |
| `/journal/:id` | `EntryDetailPage` | View logged entry + AI analysis (trigger/display) |
| `/journal/wellbeing` | `WellbeingPage` | Today's wellbeing journal (gratitude, goals, tomorrow tasks) |
| `/journal/wellbeing/:date` | `WellbeingDetailPage` | View a past wellbeing entry (read-only) |
| `/history` | `HistoryPage` | Paginated list of all past entries (health + wellbeing tabs) |
| `/insights` | `InsightsPage` | Recharts: vitals over time, symptom heatmap, correlation cards |

---

## 7. Journal Entry Form

The `/journal/new` form captures all health data in a single page:

**Symptoms section:**
- Tag-input: type symptom name, press Enter to add
- Each tag shows a severity slider (1–10)
- Optional symptom location (text field, e.g. "left temple")

**Vitals section (all optional):**
- Heart rate (bpm)
- Blood pressure — systolic / diastolic (mmHg)
- Temperature (°C)
- Weight (kg)

**Mood & Sleep section:**
- Mood: 1–5 emoji picker (😞 😟 😐 🙂 😄)
- Energy: 1–5 emoji picker (⚡1–5)
- Sleep hours: number input (0–24)

**Notes:** Free-text textarea

**Submission:** Single "Save Entry" button → calls `POST /api/v1/entries` (creates symptom_entry + vitals + mood_log in one request) → redirects to `/journal/:id`

---

## 7b. Total Wellbeing Journal (`/journal/wellbeing`)

A dedicated page — separate from the health journal — focused on mindset, gratitude, goals, and intentions. One entry per day; opening the page on an existing day pre-fills all fields for editing.

### Layout

```
🌿 Today's Wellbeing Journal        [date — auto-filled]
────────────────────────────────────────────────────────

🙏 Things I'm grateful for today
   ┌─────────────────────────────────┐  [+ Add]
   │ ○ Morning coffee & quiet time  [✕]│
   │ ○ Finished the project feature [✕]│
   └─────────────────────────────────┘

👥 People I'm grateful for
   ┌─────────────────────────────────┐  [+ Add]
   │ ○ Mom                          [✕]│
   │ ○ Alex (helped with review)    [✕]│
   └─────────────────────────────────┘

🎯 Short-term goals
   ┌─────────────────────────────────┐  [+ Add]
   │ ○ Ship HealthPulse MVP         [✕]│
   │ ○ Run 3x this week             [✕]│
   └─────────────────────────────────┘

🏔️ Long-term goals
   ┌─────────────────────────────────┐  [+ Add]
   │ ○ Launch my own SaaS product   [✕]│
   └─────────────────────────────────┘

✅ Things I want done tomorrow
   ┌─────────────────────────────────┐  [+ Add]
   │ ○ Write unit tests for backend [✕]│
   │ ○ Reply to recruiter email     [✕]│
   │ ○ 30-min workout               [✕]│
   └─────────────────────────────────┘

                    [ Save Wellbeing Journal ]
```

### Interaction Rules

- **Add item:** Click `+ Add` → inline text input appears → press Enter or click ✓ to confirm
- **Remove item:** Click `✕` next to any item — removes it immediately
- **Edit item:** Click the item text → becomes inline editable → blur to save
- **Date:** Always defaults to today. No past-date entry from this page (read past entries via `/journal/wellbeing/:date`)
- **Upsert:** `POST /api/v1/wellbeing` upserts on `(user_id, date)` — safe to save multiple times

### Dashboard Integration

The dashboard shows a small **Wellbeing streak card**:
- *"🌿 You've journaled X days in a row"*
- CTA: "Write today's entry →" → links to `/journal/wellbeing`
- If today's entry exists, shows a green checkmark and a preview of the first gratitude item

### History Page Integration

The `/history` page has two tabs:
- **Health** — existing symptom entries list
- **Wellbeing** — list of past wellbeing entries, each showing date + first gratitude item as preview

---

## 8. AI / RAG Pipeline

### Request Flow
1. User on `/journal/:id` clicks "Analyze with AI"
2. Frontend calls `POST /api/v1/ai/analyze` with `{ entry_id }`
3. `rateLimiter` middleware checks the user hasn't exceeded 10 AI calls/day
4. `claudeService.analyze(userId, entryId)`:
   a. Fetches target entry from `symptom_entries`
   b. Fetches the 7 most recent past entries (date-based, not vector similarity — MVP)
   c. Builds the structured prompt (system + RAG context + current entry)
   d. Calls `claude-haiku-4-5-20251001` with `max_tokens: 1024`
   e. Parses JSON response: `{ insights, possible_causes, recommendations, urgency_level }`
5. `disclaimerGuard` appends: *"This is not medical advice. Consult a healthcare professional."*
6. Response saved to `ai_analyses` table
7. Returned to frontend as `200 OK`

### Claude Prompt Structure
```
SYSTEM:
  You are a health assistant. You do NOT diagnose conditions.
  You suggest possible explanations and recommend when to see a doctor.
  Always end with: "This is not medical advice. Consult a healthcare professional."
  Respond ONLY in valid JSON: { "insights": string, "possible_causes": string[], 
  "recommendations": string[], "urgency_level": "low" | "moderate" | "high" | "emergency" }

USER CONTEXT (last 7 entries):
  [date]: [symptoms list], severity avg [n], notes: [text]
  ...

USER:
  Today ([date]): [symptoms]. Notes: [text]. Vitals: [if present]
  What could be causing this?
```

### Urgency Level Display
| Level | UI Treatment |
|---|---|
| `low` | Green badge: "No immediate concern" |
| `moderate` | Yellow badge: "Monitor symptoms" |
| `high` | Orange badge: "Consider seeing a doctor soon" |
| `emergency` | Red alert banner: "Seek immediate medical care" |

---

## 9. Charts & Insights (Recharts)

### Vitals Over Time (Line Chart)
- X-axis: date (last 30/90 days, toggle)
- Y-axis: value
- Multiple lines, each toggleable: heart rate, systolic, diastolic, temperature, weight
- Responsive container, tooltip on hover

### Symptom Frequency Heatmap (Calendar Grid)
- 90-day rolling window
- Each cell = one day; color intensity = number of symptoms logged that day
- Click a day → shows a popover with that day's symptoms

### Mood & Energy Trend (Line Chart)
- X-axis: date
- Two lines: mood (1–5) and energy (1–5)
- Overlay sleep hours as bar chart on secondary axis

### Correlation Cards (Computed on Frontend)
- Simple pattern detection from stored data:
  - *"Headaches appeared on X of Y days following < 6 hrs sleep"*
  - *"Your average mood was 2.1 on days with high-severity symptoms"*
- Maximum 3 cards shown at once

---

## 10. Backend API Routes

All routes require `Authorization: Bearer <supabase-jwt>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/entries` | Create symptom entry + vitals + mood log |
| GET | `/api/v1/entries` | List entries for user (paginated) |
| GET | `/api/v1/entries/:id` | Get single entry |
| GET | `/api/v1/vitals` | List vitals (date range filter) |
| GET | `/api/v1/mood` | List mood logs (date range filter) |
| POST | `/api/v1/wellbeing` | Upsert today's wellbeing entry (by user+date) |
| GET | `/api/v1/wellbeing` | List all wellbeing entries for user (paginated) |
| GET | `/api/v1/wellbeing/:date` | Get a single wellbeing entry by date (YYYY-MM-DD) |
| POST | `/api/v1/ai/analyze` | Trigger AI analysis for an entry |
| GET | `/api/v1/ai/analyses` | List past AI analyses for user |

---

## 11. Environment Variables

```env
# Backend
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
PORT=3001
NODE_ENV=development

# Frontend (Vite — prefix VITE_)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=http://localhost:3001
```

---

## 12. Responsibilities Split

### 🤖 Claude (me) — will build:
- All code: monorepo setup, backend, frontend, packages
- DB migration SQL files
- GitHub Actions CI workflow
- `.env.example` with all required keys documented
- Vercel / Render deployment config files

### 🧑 User (you) — will need to:
1. Create a Supabase project → paste the SQL migration I provide
2. Copy `.env.example` → `.env` and fill in your keys:
   - Supabase URL + keys (from Supabase dashboard)
   - Anthropic API key (from console.anthropic.com)
3. Push to GitHub (if deploying)
4. Connect repo to Vercel (web) and Render (backend)

---

## 13. Build Phases (Feature-by-Feature)

| Phase | What gets built | Deliverable |
|---|---|---|
| **1** | Monorepo scaffold, root config, TypeScript, ESLint, CI | `pnpm install` works |
| **2** | Backend Express app, Supabase client, auth middleware, DB migrations | API health check passes |
| **3** | Web app skeleton, auth (login/signup), protected routing, dashboard shell | Can log in, see dashboard |
| **4** | Journal entry form + POST/GET API routes + history page (health tab) | Can log symptoms |
| **5** | Wellbeing journal page + API routes + history wellbeing tab + dashboard streak card | Can log wellbeing |
| **6** | AI analysis endpoint + Claude integration + entry detail display | AI button works |
| **7** | Recharts dashboard: vitals chart, heatmap, mood trend, correlation cards | Full insights page |
| **8** | Polish: dark mode, loading states, error handling, responsive layout | Production-ready |
| **9** | Deploy: Vercel (web) + Render (backend) + GitHub Actions | Live URL |
