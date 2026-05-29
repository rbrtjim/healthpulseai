import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

const symptomSchema = z.object({
  name: z.string().min(1),
  severity: z.number().int().min(1).max(10),
  location: z.string().optional(),
});

const createSchema = z.object({
  entry: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    symptoms: z.array(symptomSchema).min(1),
    notes: z.string().optional(),
  }),
  vital: z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      heart_rate: z.number().int().positive().optional(),
      systolic: z.number().int().positive().optional(),
      diastolic: z.number().int().positive().optional(),
      temp_c: z.number().optional(),
      weight_kg: z.number().optional(),
    })
    .optional(),
  mood: z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      mood: z.number().int().min(1).max(5),
      mood_secondary: z.number().int().min(1).max(5).nullable().optional(),
      energy: z.number().int().min(1).max(5),
      sleep_hours: z.number().min(0).max(24).optional(),
    })
    .optional(),
});

export const entriesRouter: Router = Router();
entriesRouter.use(requireAuth);

entriesRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.parse(req.body);
    const userId = (req as AuthedRequest).userId;
    const sb = supabaseAdmin();

    const { data: entry, error: e1 } = await sb
      .from("symptom_entries")
      .insert({
        user_id: userId,
        date: parsed.entry.date,
        symptoms: parsed.entry.symptoms,
        notes: parsed.entry.notes ?? null,
      })
      .select()
      .single();
    if (e1) throw e1;

    if (parsed.vital) {
      const { error: e2 } = await sb
        .from("vitals")
        .insert({ user_id: userId, ...parsed.vital });
      if (e2) throw e2;
    }
    if (parsed.mood) {
      const { error: e3 } = await sb
        .from("mood_logs")
        .insert({ user_id: userId, ...parsed.mood });
      if (e3) throw e3;
    }

    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
});

entriesRouter.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)));
    const userId = (req as AuthedRequest).userId;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseAdmin()
      .from("symptom_entries")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .range(from, to);
    if (error) throw error;

    res.json({ entries: data ?? [], total: count ?? 0 });
  } catch (err) {
    next(err);
  }
});

entriesRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = (req as unknown as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("symptom_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("id", req.params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json({ entry: data });
  } catch (err) {
    next(err);
  }
});
