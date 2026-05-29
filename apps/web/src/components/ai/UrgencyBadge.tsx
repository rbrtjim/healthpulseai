import type { UrgencyLevel } from "@healthpulse/shared";

const styles: Record<UrgencyLevel, { cls: string; dot: string; label: string }> = {
  low: {
    cls: "bg-emerald-500/12 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "No immediate concern",
  },
  moderate: {
    cls: "bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "Monitor symptoms",
  },
  high: {
    cls: "bg-orange-500/15 text-orange-800 border-orange-500/30 dark:text-orange-300",
    dot: "bg-orange-500",
    label: "Consider seeing a doctor soon",
  },
  emergency: {
    cls: "bg-rose-600 text-white border-rose-700",
    dot: "bg-white",
    label: "Seek immediate medical care",
  },
};

export default function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  const s = styles[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  );
}
