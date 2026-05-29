export interface MoodOption {
  level: 1 | 2 | 3 | 4 | 5;
  emoji: string;
  label: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { level: 1, emoji: "😢", label: "Very low" },
  { level: 2, emoji: "😕", label: "Low" },
  { level: 3, emoji: "😐", label: "Neutral" },
  { level: 4, emoji: "🙂", label: "Good" },
  { level: 5, emoji: "😄", label: "Great" },
];

export function moodEmoji(level: number | null | undefined): string {
  if (level == null) return "";
  return MOOD_OPTIONS.find((m) => m.level === level)?.emoji ?? "";
}

export function moodLabel(level: number | null | undefined): string {
  if (level == null) return "";
  return MOOD_OPTIONS.find((m) => m.level === level)?.label ?? "";
}
