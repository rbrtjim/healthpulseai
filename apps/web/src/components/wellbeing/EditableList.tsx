import { useState } from "react";

interface Props {
  index: string;
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
}

export default function EditableList({
  index,
  label,
  hint,
  value,
  onChange,
}: Props) {
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
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card">
      <header className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {index}
        </p>
        <h2 className="mt-1 text-lg font-medium tracking-tight text-text">
          {label}
        </h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </header>
      {value.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface/60 px-4 py-5 text-center text-sm text-muted">
          Nothing here yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {value.map((item, i) => (
            <li
              key={i}
              className="group flex items-center gap-2 rounded-md border border-border bg-surface/40 px-2 py-1.5 transition focus-within:border-accent"
            >
              <span
                aria-hidden
                className="ml-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/60"
              />
              <input
                className="flex-1 bg-transparent px-1 py-1 text-text focus:outline-none"
                value={item}
                onChange={(e) => update(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove item"
                className="rounded p-1 text-muted opacity-60 transition hover:bg-rose-50 hover:text-rose-600 hover:opacity-100"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
          className="rounded-md border border-border bg-bg px-4 py-2 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
        >
          Add
        </button>
      </div>
    </section>
  );
}
