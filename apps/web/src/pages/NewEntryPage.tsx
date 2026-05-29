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
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Log today — {date}</h1>

      <section>
        <h2 className="font-semibold mb-2">Symptoms</h2>
        <SymptomList value={symptoms} onChange={setSymptoms} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Vitals (optional)</h2>
        <VitalsFields value={vital} onChange={setVital} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Mood & Sleep</h2>
        <MoodFields value={mood} onChange={setMood} />
      </section>

      <section>
        <h2 className="font-semibold mb-2">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={4}
        />
      </section>

      {mutation.isError && (
        <p className="text-red-600 text-sm">Failed to save. Try again.</p>
      )}

      <button
        type="submit"
        disabled={symptoms.length === 0 || mutation.isPending}
        className="rounded bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
}
