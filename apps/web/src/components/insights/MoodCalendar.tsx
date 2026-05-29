import { useMemo, useState } from "react";
import type { MoodLog } from "@healthpulse/shared";
import { moodEmoji, moodLabel } from "../../lib/moodMeta.js";

interface Props {
  mood: MoodLog[];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function startOfMonthUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function MoodCalendar({ mood }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => startOfMonthUTC(today));

  const byDate = useMemo(() => {
    const m = new Map<string, MoodLog>();
    for (const log of mood) m.set(log.date, log);
    return m;
  }, [mood]);

  const cells = useMemo(() => {
    const firstDay = startOfMonthUTC(cursor);
    const offset = firstDay.getUTCDay();
    const monthIdx = cursor.getUTCMonth();
    const result: { date: Date | null; iso: string | null }[] = [];
    for (let i = 0; i < offset; i++) result.push({ date: null, iso: null });
    const probe = new Date(firstDay);
    while (probe.getUTCMonth() === monthIdx) {
      result.push({ date: new Date(probe), iso: isoDate(probe) });
      probe.setUTCDate(probe.getUTCDate() + 1);
    }
    // pad to full weeks
    while (result.length % 7 !== 0) result.push({ date: null, iso: null });
    return result;
  }, [cursor]);

  const todayIso = isoDate(today);
  const showingThisMonth = monthKey(cursor) === monthKey(today);
  const goPrev = () =>
    setCursor(
      new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() - 1, 1)),
    );
  const goNext = () =>
    setCursor(
      new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1)),
    );

  const monthLogs = mood.filter((l) => monthKey(new Date(l.date)) === monthKey(cursor));
  const moodCounts = countMoods(monthLogs);

  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Monthly mood
          </p>
          <h3 className="mt-1 text-xl font-medium tracking-tight text-text">
            {formatMonth(cursor)}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg text-muted transition hover:border-text/30 hover:text-text"
          >
            ‹
          </button>
          {!showingThisMonth && (
            <button
              type="button"
              onClick={() => setCursor(startOfMonthUTC(today))}
              className="rounded-md border border-border bg-bg px-3 py-1 text-xs text-muted transition hover:border-text/30 hover:text-text"
            >
              Today
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg text-muted transition hover:border-text/30 hover:text-text"
          >
            ›
          </button>
        </div>
      </header>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.18em] text-muted">
        {DAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c.date || !c.iso) {
            return (
              <div
                key={`pad-${i}`}
                className="aspect-square rounded-md bg-surface/30"
              />
            );
          }
          const log = byDate.get(c.iso);
          const isToday = c.iso === todayIso;
          return (
            <div
              key={c.iso}
              title={
                log
                  ? `${c.iso}: ${moodLabel(log.mood)}${
                      log.mood_secondary
                        ? ` + ${moodLabel(log.mood_secondary)}`
                        : ""
                    }`
                  : c.iso
              }
              className={`flex aspect-square flex-col items-center justify-between rounded-md border p-1.5 transition ${
                isToday
                  ? "border-accent bg-accent/5"
                  : "border-border bg-surface/30 hover:border-text/20"
              }`}
            >
              <span
                className={`self-end text-[10px] ${
                  isToday ? "font-semibold text-accent" : "text-muted"
                }`}
              >
                {c.date.getUTCDate()}
              </span>
              {log ? (
                <div className="flex items-center justify-center gap-0.5 text-lg leading-none">
                  <span>{moodEmoji(log.mood)}</span>
                  {log.mood_secondary != null && (
                    <span className="text-base opacity-80">
                      {moodEmoji(log.mood_secondary)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="h-4" />
              )}
              <span className="h-0" />
            </div>
          );
        })}
      </div>

      <MonthSummary counts={moodCounts} total={monthLogs.length} />
    </section>
  );
}

function countMoods(logs: MoodLog[]): Record<number, number> {
  const c: Record<number, number> = {};
  for (const l of logs) {
    c[l.mood] = (c[l.mood] ?? 0) + 1;
    if (l.mood_secondary != null) {
      c[l.mood_secondary] = (c[l.mood_secondary] ?? 0) + 1;
    }
  }
  return c;
}

function MonthSummary({
  counts,
  total,
}: {
  counts: Record<number, number>;
  total: number;
}) {
  if (total === 0) {
    return (
      <p className="mt-4 text-center text-xs text-muted">
        No mood logged this month yet.
      </p>
    );
  }
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-4 text-xs text-muted">
      {[1, 2, 3, 4, 5].map((level) => (
        <span key={level} className="inline-flex items-center gap-1">
          <span className="text-base leading-none">{moodEmoji(level)}</span>
          <span className="tabular-nums">{counts[level] ?? 0}</span>
        </span>
      ))}
    </div>
  );
}
