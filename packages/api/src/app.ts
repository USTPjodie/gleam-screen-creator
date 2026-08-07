/**
 * Fastify application factory.
 *
 * Registers the DB plugin, CORS, cookie support and the route modules, then
 * exports the configured instance for the bootstrap in `server.ts`.
 *
 * The factory is intentionally separated from the bootstrap so tests can
 * `await buildApp()` without binding a socket.
 */

import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { env } from "./config.js";
import { dbPlugin } from "./db/index.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerOperationsRoutes } from "./routes/operations.js";
import { registerGrowthRoutes } from "./routes/growth.js";
import { registerVisualRoutes } from "./routes/visual.js";
import { registerIntelligenceRoutes } from "./routes/intelligence.js";
import { registerAlertRoutes } from "./routes/alerts.js";
import { registerIncidentRoutes } from "./routes/incidents.js";
import { registerReportRoutes } from "./routes/reports.js";
import { registerNotificationRoutes } from "./routes/notifications.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: env.LOG_LEVEL },
    trustProxy: true,
  });

  await app.register(cors, {
    origin: env.API_CORS_ORIGINS,
    credentials: true,
  });
  await app.register(cookie, { secret: env.JWT_SECRET });
  await app.register(dbPlugin);

  // Health + meta.
  app.get("/health", async () => ({ status: "ok", uptime: process.uptime() }));
  app.get("/", async () => ({ service: "farm-os-api", version: "0.1.0" }));

  await app.register(registerAuthRoutes, { prefix: "/auth" });
  await app.register(registerOperationsRoutes, { prefix: "/operations" });
  await app.register(registerGrowthRoutes, { prefix: "/growth" });
  await app.register(registerVisualRoutes, { prefix: "/visual" });
  await app.register(registerIntelligenceRoutes, { prefix: "/intelligence" });
  await app.register(registerAlertRoutes, { prefix: "/alerts" });
  await app.register(registerIncidentRoutes, { prefix: "/incidents" });
  await app.register(registerReportRoutes, { prefix: "/reports" });
  await app.register(registerNotificationRoutes, { prefix: "/notifications" });

  return app;
}
