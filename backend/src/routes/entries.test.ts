import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "../app.js";

describe("POST /api/v1/entries", () => {
  it("rejects missing Authorization with 401", async () => {
    const res = await request(buildApp())
      .post("/api/v1/entries")
      .send({
        entry: { date: "2026-05-28", symptoms: [{ name: "x", severity: 5 }] },
      });
    expect(res.status).toBe(401);
  });
});
