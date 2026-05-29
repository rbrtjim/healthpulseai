import { useMemo } from "react";
import type { SymptomEntry } from "@healthpulse/shared";

const DAYS = 91;
const COLS = 13;

interface Cell {
  date: string;
  count: number;
}

function buildGrid(entries: SymptomEntry[]): Cell[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    counts.set(e.date, (counts.get(e.date) ?? 0) + e.symptoms.length);
  }
  const today = new Date();
  const cells: Cell[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ date: iso, count: counts.get(iso) ?? 0 });
  }
  return cells;
}

function colorFor(n: number): string {
  if (n === 0) return "rgb(var(--surface))";
  if (n === 1) return "rgb(var(--accent) / 0.22)";
  if (n === 2) return "rgb(var(--accent) / 0.45)";
  if (n <= 4) return "rgb(var(--accent) / 0.75)";
  return "rgb(var(--accent))";
}

export default function SymptomHeatmap({ entries }: { entries: SymptomEntry[] }) {
  const grid = useMemo(() => buildGrid(entries), [entries]);
  const total = grid.reduce((acc, c) => acc + c.count, 0);
  const activeDays = grid.filter((c) => c.count > 0).length;
  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <header className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Symptom frequency · 90 days
          </p>
          <p className="mt-1 text-sm text-muted">
            {total} symptom{total === 1 ? "" : "s"} across {activeDays} day
            {activeDays === 1 ? "" : "s"}.
          </p>
        </div>
        <Legend />
      </header>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {grid.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.count} symptom${cell.count === 1 ? "" : "s"}`}
            className="aspect-square rounded-[3px]"
            style={{ background: colorFor(cell.count) }}
          />
        ))}
      </div>
    </section>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <span>Less</span>
      {[0, 1, 2, 4, 5].map((n) => (
        <span
          key={n}
          className="h-3 w-3 rounded-[3px]"
          style={{ background: colorFor(n) }}
        />
      ))}
      <span>More</span>
    </div>
  );
}
