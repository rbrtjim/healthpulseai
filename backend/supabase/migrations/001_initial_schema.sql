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
