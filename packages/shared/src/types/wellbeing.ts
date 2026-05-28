export interface WellbeingEntry {
  id: string;
  user_id: string;
  date: string;
  gratitude_things: string[];
  gratitude_people: string[];
  goals_short_term: string[];
  goals_long_term: string[];
  tomorrow_tasks: string[];
  created_at: string;
}

export interface NewWellbeingEntry {
  date: string;
  gratitude_things: string[];
  gratitude_people: string[];
  goals_short_term: string[];
  goals_long_term: string[];
  tomorrow_tasks: string[];
}
