import type { NewMoodLog } from "@healthpulse/shared";

export type MoodValue = Omit<NewMoodLog, "date">;

interface Props {
  value: MoodValue;
  onChange: (v: MoodValue) => void;
}

const MOODS = ["😞", "😟", "😐", "🙂", "😄"];

export default function MoodFields({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm mb-1">Mood</div>
        <div className="flex gap-2">
          {MOODS.map((emoji, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange({ ...value, mood: i + 1 })}
              className={`text-2xl rounded px-2 py-1 ${
                value.mood === i + 1 ? "bg-brand-50 ring-2 ring-brand-500" : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm mb-1">Energy ({value.energy})</div>
        <input
          type="range"
          min={1}
          max={5}
          value={value.energy}
          onChange={(e) => onChange({ ...value, energy: Number(e.target.value) })}
          className="w-full"
        />
      </div>
      <label className="block text-sm">
        Sleep hours
        <input
          type="number"
          step="0.5"
          min={0}
          max={24}
          value={value.sleep_hours ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              sleep_hours: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </label>
    </div>
  );
}
