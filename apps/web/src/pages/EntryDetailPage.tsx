import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Entries, AI } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";
import AnalysisCard from "../components/ai/AnalysisCard.js";

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

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error || !data) return <div className="p-6 text-red-600">Could not load entry.</div>;

  const e = data.entry;
  return (
    <article className="mx-auto max-w-2xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{e.date}</h1>
        <Link to="/history" className="text-sm text-brand-600">
          ← Back
        </Link>
      </header>
      <section>
        <h2 className="font-semibold">Symptoms</h2>
        <ul className="mt-1 space-y-1">
          {e.symptoms.map((s, i) => (
            <li key={i}>
              <strong>{s.name}</strong> — severity {s.severity}
              {s.location && <> at {s.location}</>}
            </li>
          ))}
        </ul>
      </section>
      {e.notes && (
        <section>
          <h2 className="font-semibold">Notes</h2>
          <p className="whitespace-pre-wrap">{e.notes}</p>
        </section>
      )}
      <section className="space-y-3">
        {analysis ? (
          <AnalysisCard analysis={analysis} />
        ) : (
          <button
            onClick={() => analyze.mutate()}
            disabled={analyze.isPending}
            className="rounded bg-brand-500 px-4 py-2 text-white disabled:opacity-50"
          >
            {analyze.isPending ? "Analyzing…" : "🤖 Analyze with AI"}
          </button>
        )}
        {analyze.isError && (
          <p className="text-red-600 text-sm">
            Could not analyze. {(analyze.error as Error).message}
          </p>
        )}
      </section>
    </article>
  );
}
