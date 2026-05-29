import type { NewMoodLog } from "@healthpulse/shared";
import { MOOD_OPTIONS } from "../../lib/moodMeta.js";

export type MoodValue = Omit<NewMoodLog, "date">;

interface Props {
  value: MoodValue;
  onChange: (v: MoodValue) => void;
}

export default function MoodFields({ value, onChange }: Props) {
  const primary = value.mood;
  const secondary = value.mood_secondary ?? null;

  const togglePick = (level: number) => {
    if (level === primary) {
      // Demote primary; promote secondary if it exists, otherwise keep primary
      if (secondary != null) {
        onChange({ ...value, mood: secondary, mood_secondary: null });
      } else {
        onChange({ ...value, mood: level });
      }
      return;
    }
    if (level === secondary) {
      onChange({ ...value, mood_secondary: null });
      return;
    }
    if (secondary == null) {
      onChange({ ...value, mood_secondary: level });
    } else {
      onChange({ ...value, mood: secondary, mood_secondary: level });
    }
  };

  const setOnlyPrimary = (level: number) =>
    onChange({ ...value, mood: level });

  return (
    <div className="space-y-6">
      <fieldset>
        <div className="mb-2 flex items-baseline justify-between">
          <legend className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Mood
          </legend>
          <span className="text-xs text-muted">
            Pick up to 2 — first is primary, second is secondary.
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map((o) => {
            const isPrimary = primary === o.level;
            const isSecondary = secondary === o.level;
            const active = isPrimary || isSecondary;
            return (
              <button
                key={o.level}
                type="button"
                onClick={() =>
                  secondary == null && !isPrimary
                    ? togglePick(o.level)
                    : isPrimary || isSecondary
                      ? togglePick(o.level)
                      : togglePick(o.level)
                }
                onContextMenu={(e) => {
                  e.preventDefault();
                  setOnlyPrimary(o.level);
                }}
                className={`group relative flex flex-col items-center rounded-lg border px-2 py-3 transition ${
                  active
                    ? "border-accent bg-accent/8"
                    : "border-border bg-bg hover:border-text/30"
                }`}
                aria-pressed={active}
              >
                {isPrimary && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white">
                    1°
                  </span>
                )}
                {isSecondary && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-accent bg-bg px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-accent">
                    2°
                  </span>
                )}
                <span className="text-2xl leading-none">{o.emoji}</span>
                <span
                  className={`mt-1.5 text-[10px] uppercase tracking-wider ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted">
          Tip: tap a selected mood again to remove it.
        </p>
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
