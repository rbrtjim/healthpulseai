export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  energy: number;
  sleep_hours?: number;
}

export interface NewMoodLog {
  date: string;
  mood: number;
  energy: number;
  sleep_hours?: number;
}
