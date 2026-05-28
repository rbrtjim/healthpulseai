export interface Vital {
  id: string;
  user_id: string;
  date: string;
  heart_rate?: number;
  systolic?: number;
  diastolic?: number;
  temp_c?: number;
  weight_kg?: number;
}

export interface NewVital {
  date: string;
  heart_rate?: number;
  systolic?: number;
  diastolic?: number;
  temp_c?: number;
  weight_kg?: number;
}
