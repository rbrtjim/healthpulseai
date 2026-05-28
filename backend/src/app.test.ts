import { describe, it, expect } from "vitest";
import request from "supertest";
import { buildApp } from "./app.js";

describe("buildApp", () => {
  it("GET /health returns ok", async () => {
    const app = buildApp();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
