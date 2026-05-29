import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Vital } from "@healthpulse/shared";

const METRICS = [
  { key: "heart_rate", label: "Heart rate", color: "#dc2626" },
  { key: "systolic", label: "Systolic", color: "#2563eb" },
  { key: "diastolic", label: "Diastolic", color: "#7c3aed" },
  { key: "temp_c", label: "Temp °C", color: "#ea580c" },
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
  const data = useMemo(
    () => vitals.map((v) => ({ ...v })),
    [vitals],
  );
  return (
    <div className="rounded border bg-white p-4">
      <div className="flex flex-wrap gap-3 mb-2">
        {METRICS.map((m) => (
          <label key={m.key} className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={enabled[m.key]}
              onChange={(e) =>
                setEnabled({ ...enabled, [m.key]: e.target.checked })
              }
            />
            <span style={{ color: m.color }}>{m.label}</span>
          </label>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {METRICS.filter((m) => enabled[m.key]).map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              stroke={m.color}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
