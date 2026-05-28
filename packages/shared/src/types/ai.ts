export type UrgencyLevel = "low" | "moderate" | "high" | "emergency";

export interface AIAnalysisResponse {
  insights: string;
  possible_causes: string[];
  recommendations: string[];
  urgency_level: UrgencyLevel;
  disclaimer: string;
}

export interface AIAnalysis {
  id: string;
  user_id: string;
  entry_id: string;
  response: AIAnalysisResponse;
  model: string;
  tokens_used: number;
  created_at: string;
}
