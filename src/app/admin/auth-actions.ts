"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  createToken,
  passwordMatches,
} from "@/lib/admin/session";

/** Login: check the shared password, set the session cookie, redirect on. */
export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!passwordMatches(password)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createToken(Date.now());
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, ADMIN_COOKIE_OPTIONS);

  // Only allow internal redirects.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

/** Logout: clear the session cookie. */
export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
