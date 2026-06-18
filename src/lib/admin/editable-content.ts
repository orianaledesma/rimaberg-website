import en from "../../../messages/en.json";
import lt from "../../../messages/lt.json";
import type { Locale } from "@/i18n/locales";

/**
 * The /admin "Site texts" editor lets Rima override any string in the message
 * catalogue. Rather than maintain a hand-curated list, we flatten the JSON and
 * expose every leaf — grouped by its top-level namespace — so new keys show up
 * automatically. Overrides are stored per (namespace, key, locale); a value
 * equal to the JSON default is removed so the text reverts cleanly.
 */

export const MESSAGES: Record<Locale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  lt: lt as Record<string, unknown>,
};

export interface ContentLeaf {
  /** Top-level namespace, e.g. "home". */
  namespace: string;
  /** Dot-path within the namespace, e.g. "labels.metal" (often just one key). */
  key: string;
  /** Default value from messages/<locale>.json. */
  defaults: Record<Locale, string>;
}

/** Flatten an object into dot-path → string entries (skips arrays). */
function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[path] = v;
    else if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v as Record<string, unknown>, path));
    }
  }
  return out;
}

/** Default value for a (namespace, key) in a locale, or "" if unknown. */
export function defaultFor(namespace: string, key: string, locale: Locale): string {
  const ns = MESSAGES[locale][namespace];
  if (!ns || typeof ns !== "object") return "";
  const flat = flatten(ns as Record<string, unknown>);
  return flat[key] ?? "";
}

/**
 * Namespaces hidden from the texts editor — structural strings (accessibility
 * labels, header nav) the client shouldn't edit. They still work; they're just
 * not exposed for editing.
 */
const HIDDEN_NAMESPACES = new Set(["a11y", "header"]);

/** All editable leaves, grouped by namespace, derived from the EN catalogue. */
export function editableLeaves(): Record<string, ContentLeaf[]> {
  const groups: Record<string, ContentLeaf[]> = {};
  for (const [namespace, value] of Object.entries(MESSAGES.en)) {
    if (HIDDEN_NAMESPACES.has(namespace)) continue;
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const flatEn = flatten(value as Record<string, unknown>);
    const flatLt = flatten((MESSAGES.lt[namespace] ?? {}) as Record<string, unknown>);
    groups[namespace] = Object.keys(flatEn).map((key) => ({
      namespace,
      key,
      defaults: { en: flatEn[key] ?? "", lt: flatLt[key] ?? "" },
    }));
  }
  return groups;
}
