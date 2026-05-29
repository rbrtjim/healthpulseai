import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

const upsertSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gratitude_things: z.array(z.string()).default([]),
  gratitude_people: z.array(z.string()).default([]),
  goals_short_term: z.array(z.string()).default([]),
  goals_long_term: z.array(z.string()).default([]),
  tomorrow_tasks: z.array(z.string()).default([]),
});

export const wellbeingRouter: Router = Router();
wellbeingRouter.use(requireAuth);

wellbeingRouter.post("/", async (req, res, next) => {
  try {
    const body = upsertSchema.parse(req.body);
    const userId = (req as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("wellbeing_entries")
      .upsert(
        { user_id: userId, ...body },
        { onConflict: "user_id,date" },
      )
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ entry: data });
  } catch (err) {
    next(err);
  }
});

wellbeingRouter.get("/", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabaseAdmin()
      .from("wellbeing_entries")
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

wellbeingRouter.get("/:date", async (req, res, next) => {
  try {
    const date = req.params.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "bad_date" });
      return;
    }
    const userId = (req as unknown as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("wellbeing_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle();
    if (error) throw error;
    res.json({ entry: data });
  } catch (err) {
    next(err);
  }
});
