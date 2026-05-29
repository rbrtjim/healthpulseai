import type { NewMoodLog } from "@healthpulse/shared";

export type MoodValue = Omit<NewMoodLog, "date">;

interface Props {
  value: MoodValue;
  onChange: (v: MoodValue) => void;
}

const MOOD_LABELS = ["Very low", "Low", "Neutral", "Good", "Great"];

export default function MoodFields({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Mood
        </legend>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {MOOD_LABELS.map((label, i) => {
            const n = i + 1;
            const active = value.mood === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ ...value, mood: n })}
                className={`group flex flex-col items-center rounded-md border px-2 py-3 transition ${
                  active
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border bg-bg text-muted hover:border-text/30 hover:text-text"
                }`}
              >
                <span className="text-lg font-medium">{n}</span>
                <span className="mt-1 text-[10px] uppercase tracking-wider">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Energy
          </span>
          <span className="text-sm text-text">{value.energy}/5</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={value.energy}
          onChange={(e) => onChange({ ...value, energy: Number(e.target.value) })}
          className="mt-2 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Sleep
        </span>
        <div className="mt-2 flex items-center rounded-md border border-border bg-bg focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
          <input
            type="number"
            step="0.5"
            min={0}
            max={24}
            value={value.sleep_hours ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                sleep_hours:
                  e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            className="w-full bg-transparent px-3 py-2 text-text focus:outline-none"
          />
          <span className="pr-3 text-xs uppercase tracking-wider text-muted">
            hours
          </span>
        </div>
      </label>
    </div>
  );
}
