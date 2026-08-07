import { compare, hash } from "bcrypt";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { createHash, randomBytes } from "node:crypto";
import { env } from "../config.js";

/**
 * Authentication primitives — bcrypt for passwords, HS256 JWT for access
 * tokens, opaque random strings for refresh tokens.
 *
 * The refresh token is deliberately *not* a JWT: it is stored hashed in the
 * `sessions` table, and the raw value is returned to the client exactly once.
 * This keeps the server in control of the refresh lifecycle (rotation,
 * revocation on logout) without leaking expiry semantics into the client.
 */

const BCRYPT_ROUNDS = 12;

const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hashStr: string): Promise<boolean> {
  return compare(plain, hashStr);
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(now + env.JWT_ACCESS_TTL_SECONDS)
    .sign(jwtSecret);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, jwtSecret);
  return payload as AccessTokenPayload;
}

/** Opaque refresh token — the client stores this raw, the server hashes it. */
export function generateRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

export function hashRefreshToken(raw: string): string {
  // A fast, deterministic hash is fine for refresh tokens because the raw
  // value is high-entropy (48 bytes).
  return createHash("sha256").update(raw).digest("hex");
}
