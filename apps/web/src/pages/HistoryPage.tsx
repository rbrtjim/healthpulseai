import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Entries, Wellbeing } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

type Tab = "health" | "wellbeing";

const TABS: { id: Tab; label: string }[] = [
  { id: "health", label: "Health" },
  { id: "wellbeing", label: "Wellbeing" },
];

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("health");
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Past entries
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
          History
        </h1>
      </header>
      <div className="flex gap-8 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative -mb-px pb-3 text-sm transition ${
              tab === t.id
                ? "text-text"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-accent"
              />
            )}
          </button>
        ))}
      </div>
      {tab === "health" ? <HealthList /> : <WellbeingList />}
    </div>
  );
}

function HealthList() {
  const { data, isLoading } = useQuery({
    queryKey: ["entries"],
    queryFn: () => Entries.listEntries(apiConfig, 1, 50),
  });
  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (!data || data.entries.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border bg-surface/60 px-4 py-8 text-center text-sm text-muted">
        No entries yet.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-bg shadow-card">
      {data.entries.map((e) => (
        <li key={e.id}>
          <Link
            to={`/journal/${e.id}`}
            className="group flex items-baseline justify-between gap-4 px-6 py-4 transition hover:bg-surface/50"
          >
            <div className="min-w-0">
              <p className="font-medium text-text group-hover:text-accent">
                {e.symptoms.map((s) => s.name).join(", ")}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                {e.symptoms.length} symptom{e.symptoms.length === 1 ? "" : "s"}
              </p>
            </div>
            <time className="whitespace-nowrap text-xs uppercase tracking-wider text-muted">
              {e.date}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function WellbeingList() {
  const { data, isLoading } = useQuery({
    queryKey: ["wellbeing"],
    queryFn: () => Wellbeing.listWellbeing(apiConfig, 1, 50),
  });
  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (!data || data.entries.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border bg-surface/60 px-4 py-8 text-center text-sm text-muted">
        No entries yet.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-bg shadow-card">
      {data.entries.map((e) => (
        <li key={e.id}>
          <Link
            to={`/journal/wellbeing/${e.date}`}
            className="group flex items-baseline justify-between gap-4 px-6 py-4 transition hover:bg-surface/50"
          >
            <div className="min-w-0">
              <p className="font-medium text-text group-hover:text-accent">
                {e.gratitude_things[0] ?? "Saved entry"}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                {e.gratitude_things.length +
                  e.gratitude_people.length +
                  e.goals_short_term.length +
                  e.goals_long_term.length +
                  e.tomorrow_tasks.length}{" "}
                items
              </p>
            </div>
            <time className="whitespace-nowrap text-xs uppercase tracking-wider text-muted">
              {e.date}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
