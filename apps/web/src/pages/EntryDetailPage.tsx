import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Entries, AI } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";
import AnalysisCard from "../components/ai/AnalysisCard.js";

function severityTint(n: number): string {
  if (n <= 3) return "text-emerald-600";
  if (n <= 6) return "text-amber-600";
  if (n <= 8) return "text-orange-600";
  return "text-rose-600";
}

export default function EntryDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => Entries.getEntry(apiConfig, id),
    enabled: !!id,
  });

  const analyze = useMutation({
    mutationFn: () => AI.analyzeEntry(apiConfig, id),
  });
  const analysis = analyze.data?.analysis;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-muted">Loading…</div>
    );
  }
  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-rose-600">
        Could not load entry.
      </div>
    );
  }

  const e = data.entry;
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            Journal entry
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

      <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
          Symptoms
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {e.symptoms.map((s, i) => (
            <li
              key={i}
              className="flex items-baseline justify-between gap-4 py-3"
            >
              <div>
                <p className="font-medium text-text">{s.name}</p>
                {s.location && (
                  <p className="mt-0.5 text-xs text-muted">at {s.location}</p>
                )}
              </div>
              <span
                className={`text-sm font-medium ${severityTint(s.severity)}`}
              >
                {s.severity}/10
              </span>
            </li>
          ))}
        </ul>
      </section>

      {e.notes && (
        <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted">
            Notes
          </h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-text">
            {e.notes}
          </p>
        </section>
      )}

      <section className="space-y-3">
        {analysis ? (
          <AnalysisCard analysis={analysis} />
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-surface/60 p-6">
            <p className="text-sm text-muted">
              Get a Claude-powered read on this entry, with retrieval-augmented
              context from your recent history.
            </p>
            <button
              onClick={() => analyze.mutate()}
              disabled={analyze.isPending}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyze.isPending ? "Analyzing…" : "Analyze with AI"}
            </button>
          </div>
        )}
        {analyze.isError && (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Could not analyze. {(analyze.error as Error).message}
          </p>
        )}
      </section>
    </article>
  );
}
