import { unstable_cache } from "next/cache";
import { publicClient } from "@/lib/supabase";
import type { Locale } from "@/i18n/locales";

/**
 * Editable-text layer. The /admin panel writes overrides to the `site_content`
 * table; here we read them (per locale) and the i18n loader merges them over
 * the static messages/*.json. Nothing in the DB → the JSON wins unchanged.
 *
 * Cached with a tag so admin saves can `revalidateTag("site-content")` for an
 * instant refresh instead of waiting out the TTL.
 */

export const CONTENT_TAG = "site-content";

export interface ContentOverride {
  namespace: string;
  key: string;
  value: string;
}

const loadOverrides = unstable_cache(
  async (locale: string): Promise<ContentOverride[]> => {
    const db = publicClient();
    if (!db) return [];
    const { data, error } = await db
      .from("site_content")
      .select("namespace, key, value")
      .eq("locale", locale);
    if (error || !data) return [];
    return data as ContentOverride[];
  },
  ["site-content"],
  { tags: [CONTENT_TAG], revalidate: 300 }
);

/** Set messages[namespace][key] = value, supporting dot-paths in `key`. */
function deepSet(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let node = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof node[k] !== "object" || node[k] === null) node[k] = {};
    node = node[k] as Record<string, unknown>;
  }
  node[parts[parts.length - 1]] = value;
}

/**
 * Merge DB overrides for `locale` onto a base messages object. Mutates a copy
 * of `base` and returns it; empty override values are ignored so a blank field
 * in the admin never wipes the JSON default.
 */
export async function mergeContent(
  base: Record<string, unknown>,
  locale: Locale
): Promise<Record<string, unknown>> {
  const overrides = await loadOverrides(locale);
  if (overrides.length === 0) return base;
  const merged = structuredClone(base);
  for (const o of overrides) {
    if (!o.value?.trim()) continue;
    const ns = (merged[o.namespace] ??= {}) as Record<string, unknown>;
    deepSet(ns, o.key, o.value);
  }
  return merged;
}
