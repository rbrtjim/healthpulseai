import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MoodLog } from "@healthpulse/shared";
import { useTheme } from "../../lib/theme.js";
import { chartTheme } from "../../lib/chartTheme.js";

export default function MoodTrendChart({ mood }: { mood: MoodLog[] }) {
  const isEmpty = mood.length === 0;
  const { theme } = useTheme();
  const ct = chartTheme(theme);
  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Mood, energy & sleep
        </p>
        <p className="mt-1 text-sm text-muted">
          Lines track mood and energy on a 1–5 scale. Bars show sleep hours.
        </p>
      </header>
      {isEmpty ? (
        <p className="rounded-md border border-dashed border-border bg-surface/60 px-4 py-12 text-center text-sm text-muted">
          No mood entries yet.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={mood} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
            <CartesianGrid stroke={ct.grid} strokeDasharray="2 4" />
            <XAxis
              dataKey="date"
              stroke={ct.axis}
              tick={{ fontSize: 11, fill: ct.axis }}
              tickLine={false}
              axisLine={{ stroke: ct.axisLine }}
            />
            <YAxis
              yAxisId="left"
              domain={[1, 5]}
              stroke={ct.axis}
              tick={{ fontSize: 11, fill: ct.axis }}
              tickLine={false}
              axisLine={{ stroke: ct.axisLine }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={ct.axis}
              tick={{ fontSize: 11, fill: ct.axis }}
              tickLine={false}
              axisLine={{ stroke: ct.axisLine }}
            />
            <Tooltip
              contentStyle={{
                background: ct.tooltipBg,
                border: `1px solid ${ct.tooltipBorder}`,
                borderRadius: 8,
                fontSize: 12,
                color: ct.tooltipText,
              }}
              cursor={{ stroke: ct.cursor, strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: ct.axis }} />
            <Bar
              yAxisId="right"
              dataKey="sleep_hours"
              fill="rgb(30 79 168 / 0.16)"
              name="Sleep (h)"
            />
            <Line
              yAxisId="left"
              dataKey="mood"
              stroke="rgb(30 79 168)"
              strokeWidth={2}
              dot={false}
              name="Mood"
            />
            <Line
              yAxisId="left"
              dataKey="energy"
              stroke="rgb(5 150 105)"
              strokeWidth={2}
              dot={false}
              name="Energy"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
