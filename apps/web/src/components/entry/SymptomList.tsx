import { useState } from "react";
import type { Symptom } from "@healthpulse/shared";

interface Props {
  value: Symptom[];
  onChange: (next: Symptom[]) => void;
}

export default function SymptomList({ value, onChange }: Props) {
  const [name, setName] = useState("");

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange([...value, { name: trimmed, severity: 5 }]);
    setName("");
  };

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const setSeverity = (i: number, severity: number) =>
    onChange(value.map((s, j) => (j === i ? { ...s, severity } : s)));
  const setLocation = (i: number, location: string) =>
    onChange(value.map((s, j) => (j === i ? { ...s, location } : s)));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Type a symptom (e.g. headache)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          className="rounded bg-brand-500 px-3 py-2 text-white"
          onClick={add}
        >
          + Add
        </button>
      </div>
      <ul className="space-y-2">
        {value.map((s, i) => (
          <li key={i} className="rounded border p-3">
            <div className="flex items-center justify-between">
              <strong>{s.name}</strong>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
            <label className="block text-sm mt-2">
              Severity: {s.severity}
              <input
                type="range"
                min={1}
                max={10}
                value={s.severity}
                onChange={(e) => setSeverity(i, Number(e.target.value))}
                className="w-full"
              />
            </label>
            <input
              className="mt-2 w-full rounded border px-2 py-1 text-sm"
              placeholder="Location (optional)"
              value={s.location ?? ""}
              onChange={(e) => setLocation(i, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
