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
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          {date}
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
          Wellbeing journal
        </h1>
        <p className="mt-2 text-sm text-muted">
          Gratitude, goals, and tomorrow's intentions. Save as many times as you
          like — the entry upserts per day.
        </p>
      </header>

      <EditableList
        index="01"
        label="Things I'm grateful for today"
        value={form.gratitude_things}
        onChange={(v) => update("gratitude_things", v)}
      />
      <EditableList
        index="02"
        label="People I'm grateful for"
        value={form.gratitude_people}
        onChange={(v) => update("gratitude_people", v)}
      />
      <EditableList
        index="03"
        label="Short-term goals"
        hint="Things you want to land this week."
        value={form.goals_short_term}
        onChange={(v) => update("goals_short_term", v)}
      />
      <EditableList
        index="04"
        label="Long-term goals"
        hint="Bigger arcs — months and years."
        value={form.goals_long_term}
        onChange={(v) => update("goals_long_term", v)}
      />
      <EditableList
        index="05"
        label="Things I want done tomorrow"
        value={form.tomorrow_tasks}
        onChange={(v) => update("tomorrow_tasks", v)}
      />

      <div className="sticky bottom-0 -mx-6 border-t border-border bg-bg/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          {save.isSuccess ? (
            <p className="text-sm text-emerald-600">Saved.</p>
          ) : (
            <p className="text-xs text-muted">Changes save when you click.</p>
          )}
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {save.isPending ? "Saving…" : "Save journal"}
          </button>
        </div>
      </div>
    </div>
  );
}
