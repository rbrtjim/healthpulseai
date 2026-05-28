import { describe, it, expect, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { aiRateLimiter, _resetRateLimit } from "./rateLimiter.js";

function appWith(userId: string) {
  const app = express();
  app.use((req, _res, next) => {
    (req as unknown as { userId: string }).userId = userId;
    next();
  });
  app.post("/x", aiRateLimiter(3), (_req, res) => res.json({ ok: true }));
  return app;
}

describe("aiRateLimiter", () => {
  beforeEach(() => _resetRateLimit());

  it("allows up to the limit then 429", async () => {
    const app = appWith("u1");
    for (let i = 0; i < 3; i++) {
      const r = await request(app).post("/x");
      expect(r.status).toBe(200);
    }
    const r = await request(app).post("/x");
    expect(r.status).toBe(429);
  });
});
