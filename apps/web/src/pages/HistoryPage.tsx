import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Entries, Wellbeing } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

type Tab = "health" | "wellbeing";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("health");
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <div className="mb-4 flex gap-2 border-b">
        {(["health", "wellbeing"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 ${
              tab === t ? "border-b-2 border-brand-500 font-semibold" : ""
            }`}
          >
            {t === "health" ? "Health" : "Wellbeing"}
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
  if (isLoading) return <p>Loading…</p>;
  if (!data || data.entries.length === 0)
    return <p className="text-slate-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {data.entries.map((e) => (
        <li key={e.id} className="rounded border p-3">
          <Link to={`/journal/${e.id}`} className="font-semibold">
            {e.date}
          </Link>
          <div className="text-sm text-slate-600">
            {e.symptoms.map((s) => s.name).join(", ")}
          </div>
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
  if (isLoading) return <p>Loading…</p>;
  if (!data || data.entries.length === 0)
    return <p className="text-slate-500">No entries yet.</p>;
  return (
    <ul className="space-y-2">
      {data.entries.map((e) => (
        <li key={e.id} className="rounded border p-3">
          <Link to={`/journal/wellbeing/${e.date}`} className="font-semibold">
            {e.date}
          </Link>
          <div className="text-sm text-slate-600">
            {e.gratitude_things[0] ?? "—"}
          </div>
        </li>
      ))}
    </ul>
  );
}
