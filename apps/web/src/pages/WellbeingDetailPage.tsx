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
  if (isLoading) {
    return (
      <p className="mx-auto max-w-3xl px-6 py-12 text-muted">Loading…</p>
    );
  }
  const e = data?.entry;
  if (!e) {
    return (
      <p className="mx-auto max-w-3xl px-6 py-12 text-muted">
        No entry for {date}.
      </p>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            Wellbeing entry
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
            {new Date(e.date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h1>
        </div>
        <Link
          to="/history"
          className="text-sm text-muted transition hover:text-accent"
        >
          ← Back to history
        </Link>
      </header>
      <Section title="Grateful for" items={e.gratitude_things} />
      <Section title="People I'm grateful for" items={e.gratitude_people} />
      <Section title="Short-term goals" items={e.goals_short_term} />
      <Section title="Long-term goals" items={e.goals_long_term} />
      <Section title="Tomorrow" items={e.tomorrow_tasks} />
    </article>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm italic text-muted">— none —</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3 text-text">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
              <span className="leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
