import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";
import { supabaseAdmin } from "../db/supabase.js";
import { withDisclaimer } from "../middleware/disclaimerGuard.js";
import type { AIAnalysisResponse, SymptomEntry } from "@healthpulse/shared";

export const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `You are a health assistant. You do NOT diagnose conditions.
You suggest possible explanations and recommend when to see a doctor.
Always end with: "This is not medical advice. Consult a healthcare professional."
Respond ONLY in valid JSON: { "insights": string, "possible_causes": string[], "recommendations": string[], "urgency_level": "low" | "moderate" | "high" | "emergency" }`;

function buildUserPrompt(entry: SymptomEntry, past: SymptomEntry[]): string {
  const contextLines = past
    .map(
      (e) =>
        `[${e.date}]: ${e.symptoms
          .map((s) => `${s.name}(sev ${s.severity})`)
          .join(", ")}${e.notes ? ` notes: ${e.notes}` : ""}`,
    )
    .join("\n");
  return `USER CONTEXT (last ${past.length} entries):\n${
    contextLines || "(no prior entries)"
  }\n\nToday (${entry.date}): ${entry.symptoms
    .map(
      (s) =>
        `${s.name}(sev ${s.severity})${s.location ? ` at ${s.location}` : ""}`,
    )
    .join(", ")}${
    entry.notes ? `\nNotes: ${entry.notes}` : ""
  }\n\nWhat could be causing this?`;
}

export interface AnalyzeResult {
  response: AIAnalysisResponse;
  model: string;
  tokens_used: number;
}

export async function analyzeEntry(
  userId: string,
  entryId: string,
  client?: Anthropic,
): Promise<AnalyzeResult> {
  const sb = supabaseAdmin();
  const { data: entry, error: e1 } = await sb
    .from("symptom_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", userId)
    .single();
  if (e1 || !entry) throw new Error("entry_not_found");

  const { data: past } = await sb
    .from("symptom_entries")
    .select("*")
    .eq("user_id", userId)
    .lt("created_at", (entry as SymptomEntry).created_at)
    .order("created_at", { ascending: false })
    .limit(7);

  const anthropic = client ?? new Anthropic({ apiKey: config.anthropic.apiKey });
  const result = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(
          entry as SymptomEntry,
          (past ?? []) as SymptomEntry[],
        ),
      },
    ],
  });

  const text = result.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: Partial<AIAnalysisResponse>;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {};
  }
  const response = withDisclaimer(parsed);
  const tokens = result.usage.input_tokens + result.usage.output_tokens;

  return { response, model: MODEL, tokens_used: tokens };
}

export const _internal = { buildUserPrompt };
