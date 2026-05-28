import type { Request, Response, NextFunction } from "express";
import type { AuthedRequest } from "./authMiddleware.js";

interface Bucket {
  date: string;
  count: number;
}
const buckets = new Map<string, Bucket>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function _resetRateLimit() {
  buckets.clear();
}

export function aiRateLimiter(limit: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    const userId = (req as AuthedRequest).userId;
    if (!userId) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    const today = todayKey();
    const b = buckets.get(userId);
    if (!b || b.date !== today) {
      buckets.set(userId, { date: today, count: 1 });
      next();
      return;
    }
    if (b.count >= limit) {
      res.status(429).json({ error: "rate_limit_exceeded", limit });
      return;
    }
    b.count += 1;
    next();
  };
}
