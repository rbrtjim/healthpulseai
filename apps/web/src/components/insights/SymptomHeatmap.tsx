import { useMemo } from "react";
import type { SymptomEntry } from "@healthpulse/shared";

const DAYS = 90;

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
  if (n === 0) return "#e2e8f0";
  if (n === 1) return "#bae6fd";
  if (n === 2) return "#60a5fa";
  if (n <= 4) return "#2563eb";
  return "#1e3a8a";
}

export default function SymptomHeatmap({ entries }: { entries: SymptomEntry[] }) {
  const grid = useMemo(() => buildGrid(entries), [entries]);
  return (
    <div className="rounded border bg-white p-4">
      <h3 className="font-semibold mb-2">Last 90 days</h3>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(15, 1fr)" }}
      >
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
