import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { z } from "zod";
import { entriesRouter } from "./routes/entries.js";
import { vitalsRouter } from "./routes/vitals.js";
import { moodRouter } from "./routes/mood.js";
import { wellbeingRouter } from "./routes/wellbeing.js";
import { aiRouter } from "./routes/ai.js";

export function buildApp(): Express {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/v1/entries", entriesRouter);
  app.use("/api/v1/vitals", vitalsRouter);
  app.use("/api/v1/mood", moodRouter);
  app.use("/api/v1/wellbeing", wellbeingRouter);
  app.use("/api/v1/ai", aiRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "validation_error", issues: err.issues });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "internal_error" });
  });

  return app;
}
