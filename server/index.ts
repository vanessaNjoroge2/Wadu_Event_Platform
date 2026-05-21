import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import eventsRouter from "./routes/events";
import authRouter from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Registered routers
  app.use("/api/events", eventsRouter);
  app.use("/api/auth", authRouter);

  // Centralized Error Handling Middleware (must be registered last)
  app.use(errorHandler);

  return app;
}
