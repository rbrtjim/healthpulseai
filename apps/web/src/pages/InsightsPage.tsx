import { useQuery } from "@tanstack/react-query";
import { Entries, Vitals, Mood } from "@healthpulse/api-client";
import { apiConfig } from "../lib/apiConfig.js";
import VitalsChart from "../components/insights/VitalsChart.js";
import SymptomHeatmap from "../components/insights/SymptomHeatmap.js";
import MoodTrendChart from "../components/insights/MoodTrendChart.js";
import CorrelationCards from "../components/insights/CorrelationCards.js";
import { computeCorrelations } from "../lib/correlations.js";

export default function InsightsPage() {
  const e = useQuery({
    queryKey: ["entries-all"],
    queryFn: () => Entries.listEntries(apiConfig, 1, 200),
  });
  const v = useQuery({
    queryKey: ["vitals-all"],
    queryFn: () => Vitals.listVitals(apiConfig),
  });
  const m = useQuery({
    queryKey: ["mood-all"],
    queryFn: () => Mood.listMood(apiConfig),
  });

  const entries = e.data?.entries ?? [];
  const vitals = v.data?.vitals ?? [];
  const mood = m.data?.mood ?? [];
  const correlations = computeCorrelations(entries, mood);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          Trends & patterns
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
          Insights
        </h1>
        <p className="mt-2 text-sm text-muted">
          Patterns drawn from your entries — no clinical interpretation, just
          your own data.
        </p>
      </header>

      <VitalsChart vitals={vitals} />
      <SymptomHeatmap entries={entries} />
      <MoodTrendChart mood={mood} />
      <CorrelationCards items={correlations} />
    </div>
  );
}
