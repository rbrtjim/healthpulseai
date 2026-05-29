import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Entries } from "@healthpulse/api-client";
import { todayISO, type Symptom } from "@healthpulse/shared";
import { apiConfig } from "../lib/apiConfig.js";
import SymptomList from "../components/entry/SymptomList.js";
import VitalsFields, { type VitalsValue } from "../components/entry/VitalsFields.js";
import MoodFields, { type MoodValue } from "../components/entry/MoodFields.js";

function hasAnyVital(v: VitalsValue): boolean {
  return Object.values(v).some((x) => x !== undefined && x !== null);
}

export default function NewEntryPage() {
  const nav = useNavigate();
  const date = todayISO();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState("");
  const [vital, setVital] = useState<VitalsValue>({});
  const [mood, setMood] = useState<MoodValue>({
    mood: 3,
    energy: 3,
    sleep_hours: undefined,
  });

  const mutation = useMutation({
    mutationFn: () =>
      Entries.createEntry(apiConfig, {
        entry: { date, symptoms, notes: notes || undefined },
        vital: hasAnyVital(vital) ? { date, ...vital } : undefined,
        mood: { date, ...mood },
      }),
    onSuccess: (data) => nav(`/journal/${data.entry.id}`),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.length === 0) return;
    mutation.mutate();
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-10 px-6 py-12">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          {date}
        </p>
        <h1 className="mt-2 text-4xl font-light tracking-tight text-text">
          Today's entry
        </h1>
        <p className="mt-2 text-sm text-muted">
          Capture symptoms, vitals and mood. Everything but symptoms is optional.
        </p>
      </header>

      <Section
        index="01"
        title="Symptoms"
        hint="Press Enter after typing to add. Use the slider to set severity."
        required
      >
        <SymptomList value={symptoms} onChange={setSymptoms} />
      </Section>

      <Section
        index="02"
        title="Vitals"
        hint="All fields optional. Leave blank if you didn't measure today."
      >
        <VitalsFields value={vital} onChange={setVital} />
      </Section>

      <Section index="03" title="Mood & sleep">
        <MoodFields value={mood} onChange={setMood} />
      </Section>

      <Section index="04" title="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else worth noting — context, triggers, what helped…"
          className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          rows={4}
        />
      </Section>

      {mutation.isError && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Could not save. Try again — your inputs are still here.
        </p>
      )}

      <div className="sticky bottom-0 -mx-6 border-t border-border bg-bg/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <p className="text-xs text-muted">
            {symptoms.length === 0
              ? "Add at least one symptom to save."
              : `${symptoms.length} symptom${symptoms.length === 1 ? "" : "s"} ready to save`}
          </p>
          <button
            type="submit"
            disabled={symptoms.length === 0 || mutation.isPending}
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Section({
  index,
  title,
  hint,
  required,
  children,
}: {
  index: string;
  title: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-bg p-6 shadow-card md:p-8">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {index}
        </p>
        <h2 className="mt-1 text-xl font-medium tracking-tight text-text">
          {title}
          {required && (
            <span className="ml-2 text-xs font-normal text-accent">
              required
            </span>
          )}
        </h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </header>
      {children}
    </section>
  );
}
