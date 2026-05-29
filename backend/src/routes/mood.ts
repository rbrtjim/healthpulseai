import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { supabaseAdmin } from "../db/supabase.js";

export const moodRouter: Router = Router();
moodRouter.use(requireAuth);

moodRouter.get("/", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    let q = supabaseAdmin().from("mood_logs").select("*").eq("user_id", userId);
    if (from) q = q.gte("date", from);
    if (to) q = q.lte("date", to);
    const { data, error } = await q.order("date", { ascending: true });
    if (error) throw error;
    res.json({ mood: data ?? [] });
  } catch (err) {
    next(err);
  }
});
