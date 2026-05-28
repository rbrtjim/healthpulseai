import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { requireAuth } from "./authMiddleware.js";

describe("requireAuth", () => {
  it("rejects missing Authorization header with 401", async () => {
    const app = express();
    app.get("/p", requireAuth, (_req, res) => res.json({ ok: true }));
    const res = await request(app).get("/p");
    expect(res.status).toBe(401);
  });

  it("rejects malformed token with 401", async () => {
    const app = express();
    app.get("/p", requireAuth, (_req, res) => res.json({ ok: true }));
    const res = await request(app).get("/p").set("Authorization", "Bearer bad");
    expect(res.status).toBe(401);
  });
});
