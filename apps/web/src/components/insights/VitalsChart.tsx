import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Vital } from "@healthpulse/shared";

const METRICS = [
  { key: "heart_rate", label: "Heart rate", color: "#1E4FA8" },
  { key: "systolic", label: "Systolic", color: "#0EA5E9" },
  { key: "diastolic", label: "Diastolic", color: "#8B5CF6" },
  { key: "temp_c", label: "Temp °C", color: "#F97316" },
  { key: "weight_kg", label: "Weight kg", color: "#059669" },
] as const;

export default function VitalsChart({ vitals }: { vitals: Vital[] }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    heart_rate: true,
    systolic: true,
    diastolic: true,
    temp_c: false,
    weight_kg: false,
  });
  const data = useMemo(() => vitals.map((v) => ({ ...v })), [vitals]);
  const isEmpty = data.length === 0;
  return (
    <ChartCard
      title="Vitals over time"
      caption="Toggle metrics to focus on what matters."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {METRICS.map((m) => {
          const on = enabled[m.key];
          return (
            <button
              type="button"
              key={m.key}
              onClick={() => setEnabled({ ...enabled, [m.key]: !on })}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                on
                  ? "border-transparent text-text"
                  : "border-border text-muted hover:border-text/30 hover:text-text"
              }`}
              style={on ? { backgroundColor: `${m.color}1A` } : undefined}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </button>
          );
        })}
      </div>
      {isEmpty ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid stroke="rgb(226 232 239)" strokeDasharray="2 4" />
            <XAxis
              dataKey="date"
              stroke="rgb(91 107 124)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgb(226 232 239)" }}
            />
            <YAxis
              stroke="rgb(91 107 124)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgb(226 232 239)" }}
            />
            <Tooltip
              contentStyle={{
                background: "rgb(255 255 255)",
                border: "1px solid rgb(226 232 239)",
                borderRadius: 8,
                fontSize: 12,
                color: "rgb(10 37 64)",
              }}
              cursor={{ stroke: "rgb(30 79 168)", strokeOpacity: 0.2 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "rgb(91 107 124)" }} />
            {METRICS.filter((m) => enabled[m.key]).map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={m.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function ChartCard({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {title}
        </p>
        {caption && <p className="mt-1 text-sm text-muted">{caption}</p>}
      </header>
      {children}
    </section>
  );
}

function EmptyChart() {
  return (
    <p className="rounded-md border border-dashed border-border bg-surface/60 px-4 py-12 text-center text-sm text-muted">
      No vitals logged yet — add some via the Log page to populate this chart.
    </p>
  );
}
