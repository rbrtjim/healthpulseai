import type { UrgencyLevel } from "@healthpulse/shared";

const styles: Record<UrgencyLevel, { bg: string; label: string }> = {
  low: { bg: "bg-green-100 text-green-800", label: "No immediate concern" },
  moderate: { bg: "bg-yellow-100 text-yellow-800", label: "Monitor symptoms" },
  high: { bg: "bg-orange-100 text-orange-800", label: "Consider seeing a doctor soon" },
  emergency: { bg: "bg-red-600 text-white", label: "Seek immediate medical care" },
};

export default function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const s = styles[level];
  return (
    <span className={`inline-block rounded px-3 py-1 text-sm font-semibold ${s.bg}`}>
      {s.label}
    </span>
  );
}
