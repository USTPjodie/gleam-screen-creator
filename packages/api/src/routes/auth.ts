import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../auth/auth.js";
import { requireAuth } from "../auth/middleware.js";
import type { AccessTokenPayload } from "../auth/auth.js";

/**
 * Session + identity routes.
 *
 * POST /auth/register
 * POST /auth/login
 * POST /auth/refresh
 * POST /auth/logout
 * POST /auth/password-reset/request
 * POST /auth/password-reset/confirm
 * GET  /auth/me             (auth required)
 */

const emailSchema = z.string().email().max(320);
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128);

const registerBody = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().max(160).optional(),
  roles: z.array(z.string()).default(["VIEWER"]),
});

const loginBody = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const refreshBody = z.object({
  refreshToken: z.string().min(1),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  /** Issue a new access/refresh pair for a validated user. */
  async function issueSession(userId: string, ip: string | null, ua: string | null) {
    const user = await app.sqlRead`
      SELECT u.id, u.email,
             COALESCE(array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL), '{}') AS roles,
             COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}') AS permissions
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      LEFT JOIN permissions p ON p.id = rp.permission_id
      WHERE u.id = ${userId} AND u.is_active = true
      GROUP BY u.id, u.email
      LIMIT 1`;
    if (user.count === 0) throw new Error("user_not_found");
    const row = user[0]!;

    const accessToken = await signAccessToken({
      sub: row.id,
      email: row.email,
      roles: row.roles as string[],
      permissions: row.permissions as string[],
    });

    const rawRefresh = generateRefreshToken();
    const refreshHash = hashRefreshToken(rawRefresh);
    const ttlMs = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 30 * 24 * 60 * 60) * 1000;
    const expiresAt = new Date(Date.now() + ttlMs);

    await app.sqlWrite`
      INSERT INTO sessions (user_id, access_token, refresh_token, refresh_expires_at, ip_address, user_agent)
      VALUES (${row.id}, ${accessToken}, ${refreshHash}, ${expiresAt.toISOString()}, ${ip}::inet, ${ua})
    `;

    await app.sqlWrite`
      UPDATE users SET last_login_at = now() WHERE id = ${row.id}
    `;

    await app.sqlWrite`
      INSERT INTO auth_audit (user_id, action, ip_address, metadata)
      VALUES (${row.id}, ${"session_issued"}, ${ip}::inet, ${app.sqlWrite.json({ userAgent: ua })})
    `;

    return {
      accessToken,
      refreshToken: rawRefresh,
      refreshExpiresAt: expiresAt.toISOString(),
      user: {
        id: row.id,
        email: row.email,
        roles: row.roles as string[],
        permissions: row.permissions as string[],
      },
    };
  }

  app.post("/register", async (request, reply) => {
    const parsed = registerBody.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
    const { email, password, fullName, roles } = parsed.data;

    const existing = await app.sqlRead`SELECT 1 FROM users WHERE email = ${email}`;
    if (existing.count > 0) return reply.code(409).send({ error: "email_taken" });

    const passwordHash = await hashPassword(password);
    const inserted = await app.sqlWrite`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName ?? null})
      RETURNING id`;
    const userId = inserted[0]!.id as string;

    if (roles.length > 0) {
      await app.sqlWrite`
        INSERT INTO user_roles (user_id, role_id)
        SELECT ${userId}, r.id FROM roles r WHERE r.code = ANY(${roles})
      `;
    }

    const session = await issueSession(userId, request.ip, request.headers["user-agent"] ?? null);
    return reply.code(201).send(session);
  });

  app.post("/login", async (request, reply) => {
    const parsed = loginBody.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "invalid_body", issues: parsed.error.issues });
    const { email, password } = parsed.data;

    const user = await app.sqlRead`
      SELECT id, password_hash, is_active FROM users WHERE email = ${email}`;
    if (user.count === 0) {
      await app.sqlWrite`
        INSERT INTO auth_audit (action, ip_address, metadata)
        VALUES (${"login_failed_unknown"}, ${request.ip}::inet, ${app.sqlWrite.json({ email })})
      `;
      return reply.code(401).send({ error: "invalid_credentials" });
    }
    const row = user[0]!;
    if (!row.is_active) return reply.code(403).send({ error: "user_disabled" });

    const ok = await verifyPassword(password, row.password_hash as string);
    if (!ok) {
      await app.sqlWrite`
        INSERT INTO auth_audit (user_id, action, ip_address, metadata)
        VALUES (${row.id}, ${"login_failed_password"}, ${request.ip}::inet, ${app.sqlWrite.json({})})
      `;
      return reply.code(401).send({ error: "invalid_credentials" });
    }

    const session = await issueSession(row.id as string, request.ip, request.headers["user-agent"] ?? null);
    return reply.send(session);
  });

  app.post("/refresh", async (request, reply) => {
    const parsed = refreshBody.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "invalid_body" });
    const hash = hashRefreshToken(parsed.data.refreshToken);

    const session = await app.sqlRead`
      SELECT id, user_id, refresh_expires_at FROM sessions
      WHERE refresh_token = ${hash}
      LIMIT 1`;
    if (session.count === 0) return reply.code(401).send({ error: "invalid_refresh" });
    const row = session[0]!;
    if (new Date(row.refresh_expires_at as string).getTime() < Date.now()) {
      await app.sqlWrite`DELETE FROM sessions WHERE id = ${row.id}`;
      return reply.code(401).send({ error: "refresh_expired" });
    }

    // Rotate: delete the old session, issue a new one.
    await app.sqlWrite`DELETE FROM sessions WHERE id = ${row.id}`;
    const fresh = await issueSession(
      row.user_id as string,
      request.ip,
      request.headers["user-agent"] ?? null,
    );
    return reply.send(fresh);
  });

  app.post("/logout", { preHandler: [requireAuth] }, async (request, reply) => {
    const header = request.headers.authorization!;
    const token = header.slice(7).trim();
    const deleted = await app.sqlWrite`
      DELETE FROM sessions WHERE access_token = ${token} RETURNING id`;
    if (deleted.count === 0) return reply.code(404).send({ error: "session_not_found" });
    await app.sqlWrite`
      INSERT INTO auth_audit (user_id, action, ip_address)
      VALUES (${request.authUser!.sub}, ${"logout"}, ${request.ip}::inet)
    `;
    return reply.code(204).send();
  });

  app.get("/me", { preHandler: [requireAuth] }, async (request) => {
    const user = request.authUser!;
    const row = await app.sqlRead`
      SELECT id, email, full_name, avatar_url, last_login_at, created_at
      FROM users WHERE id = ${user.sub}`;
    return {
      user: row[0],
      roles: user.roles,
      permissions: user.permissions,
    };
  });
}

export type { AccessTokenPayload };
