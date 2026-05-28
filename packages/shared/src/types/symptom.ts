export interface Symptom {
  name: string;
  severity: number;
  location?: string;
}

export interface SymptomEntry {
  id: string;
  user_id: string;
  date: string;
  symptoms: Symptom[];
  notes?: string;
  created_at: string;
}

export interface NewSymptomEntry {
  date: string;
  symptoms: Symptom[];
  notes?: string;
}
