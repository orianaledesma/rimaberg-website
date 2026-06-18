import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients for Rima Berg.
 *
 * · `publicClient()`  — anon key, used by Server Components to read the
 *   catalogue and content overrides. Safe to run on every request.
 * · `adminClient()`   — service role key, used ONLY inside server actions
 *   guarded by the admin session. Bypasses RLS; never imported client-side.
 *
 * Both return `null` when the env vars are absent so the site can fall back to
 * the static data (the catalogue keeps working before Supabase is wired up).
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const STORAGE_BUCKET = "product-images";

/** True when reads/writes against Supabase are possible. */
export function isSupabaseConfigured(): boolean {
  return !!(URL && ANON);
}

let _public: SupabaseClient | null = null;
export function publicClient(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  _public ??= createClient(URL, ANON, { auth: { persistSession: false } });
  return _public;
}

let _admin: SupabaseClient | null = null;
export function adminClient(): SupabaseClient | null {
  if (!URL || !SERVICE) return null;
  _admin ??= createClient(URL, SERVICE, { auth: { persistSession: false } });
  return _admin;
}
