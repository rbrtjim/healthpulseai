import { useState } from "react";

interface Props {
  label: string;
  emoji: string;
  value: string[];
  onChange: (next: string[]) => void;
}

export default function EditableList({ label, emoji, value, onChange }: Props) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...value, t]);
    setDraft("");
  };
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const update = (i: number, next: string) =>
    onChange(value.map((v, j) => (j === i ? next : v)));

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="font-semibold mb-2">
        {emoji} {label}
      </h2>
      <ul className="space-y-1">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-slate-400">○</span>
            <input
              className="flex-1 rounded border px-2 py-1"
              value={item}
              onChange={(e) => update(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded border px-2 py-1"
          placeholder="Add an item…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="rounded bg-brand-500 px-3 py-1 text-white"
        >
          + Add
        </button>
      </div>
    </section>
  );
}
