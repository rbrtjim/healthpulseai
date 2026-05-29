-- 002_mood_secondary.sql
-- Allow logging a secondary mood per day

alter table mood_logs
  add column if not exists mood_secondary int
  check (mood_secondary is null or (mood_secondary between 1 and 5));
