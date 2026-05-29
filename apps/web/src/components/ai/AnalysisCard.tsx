import type { AIAnalysis } from "@healthpulse/shared";
import UrgencyBadge from "./UrgencyBadge.js";

export default function AnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  const r = analysis.response;
  return (
    <div className="rounded border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">AI Analysis</h3>
        <UrgencyBadge level={r.urgency_level} />
      </div>
      <p>{r.insights}</p>
      {r.possible_causes.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm">Possible causes</h4>
          <ul className="list-disc pl-5">
            {r.possible_causes.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
      {r.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm">Recommendations</h4>
          <ul className="list-disc pl-5">
            {r.recommendations.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-slate-500">{r.disclaimer}</p>
    </div>
  );
}
