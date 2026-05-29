import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SymptomEntry, WellbeingEntry } from "@healthpulse/shared";

interface Props {
  entries: SymptomEntry[];
  wellbeing: WellbeingEntry[];
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

interface DayData {
  health?: SymptomEntry;
  wellbeing?: WellbeingEntry;
}

export default function JournalCalendar({ entries, wellbeing }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => startOfMonthUTC(today));

  const byDate = useMemo(() => {
    const m = new Map<string, DayData>();
    for (const e of entries) {
      const d = m.get(e.date) ?? {};
      d.health = e;
      m.set(e.date, d);
    }
    for (const w of wellbeing) {
      const d = m.get(w.date) ?? {};
      d.wellbeing = w;
      m.set(w.date, d);
    }
    return m;
  }, [entries, wellbeing]);

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

  const monthEntries = entries.filter(
    (e) => monthKey(new Date(e.date)) === monthKey(cursor),
  );
  const monthWellbeing = wellbeing.filter(
    (w) => monthKey(new Date(w.date)) === monthKey(cursor),
  );
  const daysLogged = new Set<string>([
    ...monthEntries.map((e) => e.date),
    ...monthWellbeing.map((w) => w.date),
  ]).size;
  const daysInMonth = new Date(
    cursor.getUTCFullYear(),
    cursor.getUTCMonth() + 1,
    0,
  ).getUTCDate();

  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Journal tracker
          </p>
          <h3 className="mt-1 text-xl font-medium tracking-tight text-text">
            {formatMonth(cursor)}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {daysLogged} of {daysInMonth} days with at least one entry
          </p>
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
          const data = byDate.get(c.iso);
          const hasHealth = !!data?.health;
          const hasWellbeing = !!data?.wellbeing;
          const isToday = c.iso === todayIso;
          const target = hasHealth
            ? `/journal/${data!.health!.id}`
            : hasWellbeing
              ? `/journal/wellbeing/${c.iso}`
              : null;
          const tooltip = data
            ? `${c.iso}${hasHealth ? ` · health` : ""}${
                hasWellbeing ? ` · wellbeing` : ""
              }`
            : c.iso;
          const className = `flex aspect-square flex-col items-center justify-between rounded-md border p-1.5 transition ${
            isToday
              ? "border-accent bg-accent/5"
              : "border-border bg-surface/30 hover:border-text/20"
          } ${target ? "cursor-pointer hover:bg-surface" : ""}`;
          const inner = (
            <>
              <span
                className={`self-end text-[10px] ${
                  isToday ? "font-semibold text-accent" : "text-muted"
                }`}
              >
                {c.date.getUTCDate()}
              </span>
              <div className="flex items-center justify-center gap-1">
                {hasHealth && (
                  <span
                    aria-label="health entry"
                    title="Health entry"
                    className="h-2 w-2 rounded-full bg-accent"
                  />
                )}
                {hasWellbeing && (
                  <span
                    aria-label="wellbeing entry"
                    title="Wellbeing entry"
                    className="h-2 w-2 rounded-full bg-emerald-500"
                  />
                )}
                {!hasHealth && !hasWellbeing && (
                  <span className="h-2 w-2 rounded-full bg-border" />
                )}
              </div>
              <span className="h-0" />
            </>
          );
          if (target) {
            return (
              <Link key={c.iso} to={target} title={tooltip} className={className}>
                {inner}
              </Link>
            );
          }
          return (
            <div key={c.iso} title={tooltip} className={className}>
              {inner}
            </div>
          );
        })}
      </div>

      <footer className="mt-5 flex flex-wrap items-center justify-center gap-5 border-t border-border pt-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Health · {monthEntries.length}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Wellbeing · {monthWellbeing.length}
        </span>
      </footer>
    </section>
  );
}
