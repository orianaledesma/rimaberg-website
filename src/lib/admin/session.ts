/**
 * Admin session — a single shared password gates /admin.
 *
 * On login we mint a signed token (`<expiry>.<hmac>`) and drop it in an
 * httpOnly cookie. Both the middleware (edge runtime) and server actions
 * (node) verify it with Web Crypto, so there is no per-user store to manage.
 *
 * Security knobs come from env: ADMIN_PASSWORD (the shared secret typed at
 * login) and ADMIN_SESSION_SECRET (HMAC signing key — set a long random value).
 */

export const ADMIN_COOKIE = "rb-admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function enc(s: string): BufferSource {
  return new TextEncoder().encode(s) as unknown as BufferSource;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc(message));
  return toHex(sig);
}

/** Constant-time string compare. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function sessionSecret(): string {
  // Fall back to the password if a dedicated signing secret wasn't set, so the
  // gate still works in a minimal setup (less ideal — prefer ADMIN_SESSION_SECRET).
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

/** Mint a signed session token valid for MAX_AGE_SECONDS. */
export async function createToken(nowMs: number): Promise<string> {
  const exp = Math.floor(nowMs / 1000) + MAX_AGE_SECONDS;
  const sig = await hmac(String(exp), sessionSecret());
  return `${exp}.${sig}`;
}

/** Verify a token's signature and expiry. */
export async function verifyToken(
  token: string | undefined,
  nowMs: number
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) * 1000 < nowMs) return false;
  const expected = await hmac(exp, sessionSecret());
  return safeEqual(sig, expected);
}

/** Check a typed password against ADMIN_PASSWORD (constant-time). */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return safeEqual(input, expected);
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
