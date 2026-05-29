import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MoodLog } from "@healthpulse/shared";

export default function MoodTrendChart({ mood }: { mood: MoodLog[] }) {
  return (
    <div className="rounded border bg-white p-4">
      <h3 className="font-semibold mb-2">Mood & energy</h3>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={mood}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" domain={[1, 5]} />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" dataKey="mood" stroke="#1A56DB" />
          <Line yAxisId="left" dataKey="energy" stroke="#059669" />
          <Bar yAxisId="right" dataKey="sleep_hours" fill="#fde68a" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
