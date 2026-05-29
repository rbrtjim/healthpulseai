import type { SymptomEntry, MoodLog } from "@healthpulse/shared";

export interface Correlation {
  title: string;
  detail: string;
}

export function computeCorrelations(
  entries: SymptomEntry[],
  mood: MoodLog[],
): Correlation[] {
  const out: Correlation[] = [];
  const sleepByDate = new Map<string, number>();
  for (const m of mood) {
    if (m.sleep_hours != null) sleepByDate.set(m.date, m.sleep_hours);
  }

  let headacheAfterPoorSleep = 0;
  let totalPoorSleepDays = 0;
  const dates = [...sleepByDate.keys()].sort();
  for (const d of dates) {
    if ((sleepByDate.get(d) ?? 99) < 6) {
      totalPoorSleepDays += 1;
      const next = new Date(`${d}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      const nextISO = next.toISOString().slice(0, 10);
      const hadHeadache = entries.some(
        (e) =>
          e.date === nextISO &&
          e.symptoms.some((s) => /headache/i.test(s.name)),
      );
      if (hadHeadache) headacheAfterPoorSleep += 1;
    }
  }
  if (totalPoorSleepDays > 0) {
    out.push({
      title: "Sleep ↔ headaches",
      detail: `Headaches appeared on ${headacheAfterPoorSleep} of ${totalPoorSleepDays} days following < 6 hrs sleep.`,
    });
  }

  const moodByDate = new Map<string, number>(mood.map((m) => [m.date, m.mood]));
  const highSevDates = entries
    .filter((e) => e.symptoms.some((s) => s.severity >= 7))
    .map((e) => e.date);
  const moods = highSevDates
    .map((d) => moodByDate.get(d))
    .filter((x): x is number => x != null);
  if (moods.length > 0) {
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    out.push({
      title: "Mood on high-severity days",
      detail: `Your average mood was ${avg.toFixed(1)} on days with high-severity symptoms.`,
    });
  }

  return out.slice(0, 3);
}
