import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../auth/middleware.js";

/**
 * Alert stream + acknowledge/dismiss mutations.
 *
 * GET    /alerts                       — list (filters: severity, acknowledged)
 * GET    /alerts/:id                   — single
 * POST   /alerts/:id/acknowledge       — marks the alert read + audit
 * POST   /alerts/:id/dismiss           — soft-close action + audit
 */
export async function registerAlertRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const { severity, acknowledged, limit = "50" } = request.query as Record<string, string>;
    const filters: string[] = [];
    const params: (string | number | boolean)[] = [];
    if (severity) {
      params.push(severity);
      filters.push(`severity = $${params.length}`);
    }
    if (acknowledged !== undefined) {
      params.push(acknowledged === "true");
      filters.push(`acknowledged = $${params.length}`);
    }
    params.push(Number(limit) || 50);
    const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const rows = await app.sqlRead.unsafe(
      `SELECT id, kind, severity, message, raised_at AS "raisedAt",
              acknowledged, acknowledged_at AS "acknowledgedAt",
              source_incident_id AS "sourceIncidentId"
       FROM alerts ${where}
       ORDER BY raised_at DESC
       LIMIT $${params.length}`,
      params,
    );
    return reply.send(rows);
  });

  app.get("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const rows = await app.sqlRead`
      SELECT id, kind, severity, message, raised_at AS "raisedAt",
             acknowledged, acknowledged_at AS "acknowledgedAt",
             source_incident_id AS "sourceIncidentId"
      FROM alerts WHERE id = ${id}`;
    if (rows.count === 0) return reply.code(404).send({ error: "not_found" });

    const history = await app.sqlRead`
      SELECT action, at::text AS at, by_user_id AS "byUserId", metadata
      FROM alert_history WHERE alert_id = ${id} ORDER BY at DESC`;

    return reply.send({ alert: rows[0], history });
  });

  const mutate = async (app: FastifyInstance, request: any, action: "acknowledge" | "dismiss") => {
    const { id } = request.params as { id: string };
    const userId = request.authUser!.sub;
    const ts = new Date().toISOString();
    const updated = await app.sqlWrite`
      UPDATE alerts
      SET acknowledged = true, acknowledged_at = ${ts}, acknowledged_by = ${userId}
      WHERE id = ${id} AND acknowledged = false
      RETURNING id`;
    if (updated.count === 0) {
      return { updated: false, reason: "already_acknowledged_or_missing" };
    }
    await app.sqlWrite`
      INSERT INTO alert_history (alert_id, action, by_user_id)
      VALUES (${id}, ${action}, ${userId})`;
    await app.sqlWrite`
      INSERT INTO audit_log (user_id, action, resource_type, resource_id)
      VALUES (${userId}, ${`alert.${action}`}, ${"alert"}, ${id})`;
    return { updated: true, id };
  };

  app.post("/:id/acknowledge", { preHandler: [requireAuth] }, async (request, reply) => {
    const result = await mutate(app, request, "acknowledge");
    return reply.send(result);
  });

  app.post("/:id/dismiss", { preHandler: [requireAuth] }, async (request, reply) => {
    const result = await mutate(app, request, "dismiss");
    return reply.send(result);
  });
}

void z;
