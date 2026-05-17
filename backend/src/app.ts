import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "x-admin-secret"],
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRouter);

app.use(errorHandler);

export { app };
