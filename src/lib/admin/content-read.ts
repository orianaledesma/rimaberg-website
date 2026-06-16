import { adminClient } from "@/lib/supabase";
import type { Locale } from "@/i18n/locales";

/**
 * Current text overrides, keyed `${locale}|${namespace}|${key}` → value, for
 * prefilling the admin editor. Uses the service role so it works regardless of
 * RLS. Returns {} when Supabase isn't configured.
 */
export async function loadOverrideMap(): Promise<Record<string, string>> {
  const db = adminClient();
  if (!db) return {};
  const { data, error } = await db.from("site_content").select("namespace,key,locale,value");
  if (error || !data) return {};
  const map: Record<string, string> = {};
  for (const r of data as { namespace: string; key: string; locale: Locale; value: string }[]) {
    map[`${r.locale}|${r.namespace}|${r.key}`] = r.value;
  }
  return map;
}
