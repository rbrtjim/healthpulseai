import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wellbeing } from "@healthpulse/api-client";
import { todayISO, type NewWellbeingEntry } from "@healthpulse/shared";
import { apiConfig } from "../lib/apiConfig.js";
import EditableList from "../components/wellbeing/EditableList.js";

const EMPTY: NewWellbeingEntry = {
  date: "",
  gratitude_things: [],
  gratitude_people: [],
  goals_short_term: [],
  goals_long_term: [],
  tomorrow_tasks: [],
};

export default function WellbeingPage() {
  const date = todayISO();
  const qc = useQueryClient();
  const [form, setForm] = useState<NewWellbeingEntry>({ ...EMPTY, date });

  const existing = useQuery({
    queryKey: ["wellbeing", date],
    queryFn: () => Wellbeing.getWellbeingByDate(apiConfig, date),
  });

  useEffect(() => {
    if (existing.data?.entry) {
      const e = existing.data.entry;
      setForm({
        date: e.date,
        gratitude_things: e.gratitude_things ?? [],
        gratitude_people: e.gratitude_people ?? [],
        goals_short_term: e.goals_short_term ?? [],
        goals_long_term: e.goals_long_term ?? [],
        tomorrow_tasks: e.tomorrow_tasks ?? [],
      });
    }
  }, [existing.data]);

  const save = useMutation({
    mutationFn: () => Wellbeing.upsertWellbeing(apiConfig, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellbeing"] });
      qc.invalidateQueries({ queryKey: ["wellbeing-streak"] });
    },
  });

  const update = (k: keyof NewWellbeingEntry, v: string[]) =>
    setForm({ ...form, [k]: v });

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🌿 Today's Wellbeing Journal</h1>
        <span className="text-slate-500">{date}</span>
      </header>

      <EditableList
        label="Things I'm grateful for today"
        emoji="🙏"
        value={form.gratitude_things}
        onChange={(v) => update("gratitude_things", v)}
      />
      <EditableList
        label="People I'm grateful for"
        emoji="👥"
        value={form.gratitude_people}
        onChange={(v) => update("gratitude_people", v)}
      />
      <EditableList
        label="Short-term goals"
        emoji="🎯"
        value={form.goals_short_term}
        onChange={(v) => update("goals_short_term", v)}
      />
      <EditableList
        label="Long-term goals"
        emoji="🏔️"
        value={form.goals_long_term}
        onChange={(v) => update("goals_long_term", v)}
      />
      <EditableList
        label="Things I want done tomorrow"
        emoji="✅"
        value={form.tomorrow_tasks}
        onChange={(v) => update("tomorrow_tasks", v)}
      />

      <button
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="rounded bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
      >
        {save.isPending ? "Saving…" : "Save Wellbeing Journal"}
      </button>
      {save.isSuccess && <p className="text-green-600">Saved ✓</p>}
    </div>
  );
}
