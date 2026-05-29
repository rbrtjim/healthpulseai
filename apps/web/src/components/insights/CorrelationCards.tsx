import type { Correlation } from "../../lib/correlations.js";

export default function CorrelationCards({ items }: { items: Correlation[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Correlations
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((c, i) => (
          <article
            key={i}
            className="rounded-xl border border-border bg-bg p-5 shadow-card transition hover:border-accent/40 hover:shadow-cardHover"
          >
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-xs font-medium text-accent">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-3 text-base font-medium tracking-tight text-text">
              {c.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
