import type { FastifyInstance, preHandlerHookHandler } from "fastify";
import { verifyAccessToken } from "./auth.js";

/**
 * Pre-handler that requires a valid bearer JWT. Sets `request.authUser` for
 * downstream handlers.
 *
 * Wire it per-route or per-prefix:
 *   fastify.get("/protected", { preHandler: [requireAuth] }, handler)
 */
export const requireAuth: preHandlerHookHandler = async (
  request,
  reply,
) => {
  const header = request.headers.authorization;
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return reply.code(401).send({ error: "missing_bearer" });
  }
  const token = header.slice(7).trim();
  try {
    const payload = await verifyAccessToken(token);
    if (!payload.sub || !payload.email || !Array.isArray(payload.roles)) {
      throw new Error("malformed_payload");
    }
    request.authUser = {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles as string[],
      permissions: (payload.permissions ?? []) as string[],
    };
  } catch (err) {
    return reply.code(401).send({
      error: "invalid_token",
      message: err instanceof Error ? err.message : "verification failed",
    });
  }
};

/**
 * Optional auth: populates `request.authUser` when a valid bearer is present
 * but allows the request through without one.
 */
export const optionalAuth: preHandlerHookHandler = async (request) => {
  const header = request.headers.authorization;
  if (!header || !header.toLowerCase().startsWith("bearer ")) return;
  try {
    const payload = await verifyAccessToken(header.slice(7).trim());
    if (payload.sub && payload.email && Array.isArray(payload.roles)) {
      request.authUser = {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles as string[],
        permissions: (payload.permissions ?? []) as string[],
      };
    }
  } catch {
    // Anonymous requests are fine under optional auth.
  }
};

/**
 * Returns a pre-handler that enforces at least one of the given roles. Must be
 * applied *after* `requireAuth` so `request.authUser` is populated.
 */
export function requireRole(...roles: string[]): preHandlerHookHandler {
  const set = new Set(roles);
  return async (request, reply) => {
    const user = request.authUser as
      | { sub: string; email: string; roles: string[]; permissions: string[] }
      | undefined;
    if (!user) return reply.code(401).send({ error: "missing_bearer" });
    if (!user.roles.some((r: string) => set.has(r))) {
      return reply.code(403).send({ error: "insufficient_role" });
    }
  };
}

/**
 * Returns a pre-handler that enforces at least one of the given permissions.
 * Permission codes are stored in lowercase (e.g. `facilities.read`).
 */
export function requirePermission(...codes: string[]): preHandlerHookHandler {
  const set = new Set(codes.map((c) => c.toLowerCase()));
  return async (request, reply) => {
    const user = request.authUser as
      | { sub: string; email: string; roles: string[]; permissions: string[] }
      | undefined;
    if (!user) return reply.code(401).send({ error: "missing_bearer" });
    const hasAdmin = user.roles.includes("ADMIN");
    const hasPermission = user.permissions.some((p: string) => set.has(p.toLowerCase()));
    if (!hasAdmin && !hasPermission) {
      return reply.code(403).send({ error: "insufficient_permission" });
    }
  };
}

// The import below only exists so `FastifyInstance` is referenced — it is
// used by type augmentation in `db/types.ts` and keeps the module graph live.
export type _F = FastifyInstance;
