import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Wellbeing } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";

export default function WellbeingDetailPage() {
  const { date = "" } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["wellbeing", date],
    queryFn: () => Wellbeing.getWellbeingByDate(apiConfig, date),
  });
  if (isLoading) return <p className="p-6">Loading…</p>;
  const e = data?.entry;
  if (!e) return <p className="p-6">No entry for {date}.</p>;

  return (
    <article className="mx-auto max-w-2xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🌿 Wellbeing — {e.date}</h1>
        <Link to="/history" className="text-sm text-brand-600">
          ← Back
        </Link>
      </header>
      <Section title="🙏 Grateful for" items={e.gratitude_things} />
      <Section title="👥 People grateful for" items={e.gratitude_people} />
      <Section title="🎯 Short-term goals" items={e.goals_short_term} />
      <Section title="🏔️ Long-term goals" items={e.goals_long_term} />
      <Section title="✅ Tomorrow" items={e.tomorrow_tasks} />
    </article>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded border bg-white p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">— none —</p>
      ) : (
        <ul className="list-disc pl-5">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
