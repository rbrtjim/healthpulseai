import type { WellbeingEntry } from "@healthpulse/shared";

export function computeStreak(entries: WellbeingEntry[], todayISO: string): number {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const cursor = new Date(`${todayISO}T00:00:00Z`);
  for (let i = 0; i < 366; i++) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!dates.has(iso)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
