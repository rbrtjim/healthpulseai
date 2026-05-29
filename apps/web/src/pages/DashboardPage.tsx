import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Entries, Wellbeing } from "@healthpulse/api-client";
import { todayISO } from "@healthpulse/shared";
import { apiConfig } from "../lib/apiConfig.js";
import { computeStreak } from "../lib/wellbeingStreak.js";

export default function DashboardPage() {
  const today = todayISO();
  const { data } = useQuery({
    queryKey: ["entries", "recent"],
    queryFn: () => Entries.listEntries(apiConfig, 1, 5),
  });
  const wb = useQuery({
    queryKey: ["wellbeing-streak"],
    queryFn: () => Wellbeing.listWellbeing(apiConfig, 1, 60),
  });
  const streak = wb.data ? computeStreak(wb.data.entries, today) : 0;
  const todayEntry = wb.data?.entries.find((e) => e.date === today);

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/journal/new"
          className="rounded bg-brand-500 px-4 py-2 text-white"
        >
          + Log Today
        </Link>
      </div>

      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-2">Recent entries</h2>
        {!data || data.entries.length === 0 ? (
          <p className="text-slate-500">No entries yet — log your first one!</p>
        ) : (
          <ul className="space-y-1">
            {data.entries.map((e) => (
              <li key={e.id}>
                <Link to={`/journal/${e.id}`} className="text-brand-600">
                  {e.date}
                </Link>{" "}
                — {e.symptoms.map((s) => s.name).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded border bg-emerald-50 p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">
            🌿 You've journaled {streak} day{streak === 1 ? "" : "s"} in a row
          </p>
          {todayEntry ? (
            <p className="text-sm text-emerald-700">
              ✓ Today: {todayEntry.gratitude_things[0] ?? "saved"}
            </p>
          ) : (
            <p className="text-sm text-slate-600">No entry today yet.</p>
          )}
        </div>
        <Link
          to="/journal/wellbeing"
          className="rounded bg-emerald-600 px-3 py-2 text-white"
        >
          Write today's entry →
        </Link>
      </section>
    </div>
  );
}
