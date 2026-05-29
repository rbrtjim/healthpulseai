import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/authMiddleware.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";
import { supabaseAdmin } from "../db/supabase.js";
import { analyzeEntry } from "../services/claudeService.js";
import { config } from "../config.js";

const analyzeSchema = z.object({ entry_id: z.string().uuid() });

export const aiRouter: Router = Router();
aiRouter.use(requireAuth);

aiRouter.post(
  "/analyze",
  aiRateLimiter(config.ai.dailyRateLimit),
  async (req, res, next) => {
    try {
      const { entry_id } = analyzeSchema.parse(req.body);
      const userId = (req as AuthedRequest).userId;
      const result = await analyzeEntry(userId, entry_id);

      const { data, error } = await supabaseAdmin()
        .from("ai_analyses")
        .insert({
          user_id: userId,
          entry_id,
          response: result.response,
          model: result.model,
          tokens_used: result.tokens_used,
        })
        .select()
        .single();
      if (error) throw error;
      res.status(200).json({ analysis: data });
    } catch (err) {
      next(err);
    }
  },
);

aiRouter.get("/analyses", async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).userId;
    const { data, error } = await supabaseAdmin()
      .from("ai_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json({ analyses: data ?? [] });
  } catch (err) {
    next(err);
  }
});
