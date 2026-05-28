import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../db/supabase.js";

export interface AuthedRequest extends Request {
  userId: string;
  accessToken: string;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.header("authorization") ?? req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  try {
    const { data, error } = await supabaseAdmin().auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    (req as AuthedRequest).userId = data.user.id;
    (req as AuthedRequest).accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}
