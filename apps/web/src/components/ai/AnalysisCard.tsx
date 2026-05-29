import type { AIAnalysis } from "@healthpulse/shared";
import UrgencyBadge from "./UrgencyBadge.js";

export default function AnalysisCard({ analysis }: { analysis: AIAnalysis }) {
  const r = analysis.response;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg shadow-card">
      <header className="flex items-center justify-between border-b border-border bg-surface/60 px-6 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Claude analysis
          </p>
          <h3 className="mt-0.5 text-lg font-medium tracking-tight text-text">
            {analysis.model}
          </h3>
        </div>
        <UrgencyBadge level={r.urgency_level} />
      </header>
      <div className="space-y-6 px-6 py-6">
        <p className="leading-relaxed text-text">{r.insights}</p>
        {r.possible_causes.length > 0 && (
          <Block title="Possible causes" items={r.possible_causes} />
        )}
        {r.recommendations.length > 0 && (
          <Block title="Recommendations" items={r.recommendations} />
        )}
      </div>
      <footer className="border-t border-border bg-surface/60 px-6 py-3">
        <p className="text-xs italic text-muted">{r.disclaimer}</p>
      </footer>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((c, i) => (
          <li key={i} className="flex gap-3 text-text">
            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
            <span className="leading-relaxed">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
