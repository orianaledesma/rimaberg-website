import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "./session";

/**
 * Server-side admin check, used inside every mutation action as defense in
 * depth (the middleware already gates page navigation, but actions can be
 * invoked directly). Throws if the caller isn't authenticated.
 */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const ok = await verifyToken(token, Date.now());
  if (!ok) throw new Error("Unauthorized");
}
