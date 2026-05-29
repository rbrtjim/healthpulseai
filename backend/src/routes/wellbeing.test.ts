import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../app.js";

describe("POST /api/v1/wellbeing", () => {
  it("rejects unauthenticated 401", async () => {
    const res = await request(buildApp())
      .post("/api/v1/wellbeing")
      .send({ date: "2026-05-28", gratitude_things: ["x"] });
    expect(res.status).toBe(401);
  });
});
