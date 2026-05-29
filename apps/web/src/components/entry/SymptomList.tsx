import { useState } from "react";
import type { Symptom } from "@healthpulse/shared";

interface Props {
  value: Symptom[];
  onChange: (next: Symptom[]) => void;
}

function severityTint(n: number): string {
  if (n <= 3) return "text-emerald-600";
  if (n <= 6) return "text-amber-600";
  if (n <= 8) return "text-orange-600";
  return "text-rose-600";
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="Type a symptom and press Enter (e.g. headache)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
        >
          Add
        </button>
      </div>
      {value.length === 0 && (
        <p className="rounded-md border border-dashed border-border bg-surface/60 px-4 py-6 text-center text-sm text-muted">
          No symptoms yet. Add one above to get started.
        </p>
      )}
      <ul className="space-y-3">
        {value.map((s, i) => (
          <li
            key={i}
            className="rounded-lg border border-border bg-surface/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-text">{s.name}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-muted">
                  Severity{" "}
                  <span className={severityTint(s.severity)}>
                    {s.severity}/10
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${s.name}`}
                className="rounded-md p-1 text-muted transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={s.severity}
              onChange={(e) => setSeverity(i, Number(e.target.value))}
              className="mt-3 w-full accent-[rgb(var(--accent))]"
            />
            <input
              type="text"
              className="mt-3 w-full rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Location (optional) — e.g. left temple"
              value={s.location ?? ""}
              onChange={(e) => setLocation(i, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
