import type { Correlation } from "../../lib/correlations.js";

export default function CorrelationCards({ items }: { items: Correlation[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((c, i) => (
        <div key={i} className="rounded border bg-white p-4">
          <h4 className="font-semibold mb-1">{c.title}</h4>
          <p className="text-sm">{c.detail}</p>
        </div>
      ))}
    </div>
  );
}
