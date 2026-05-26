/**
 * Catalogue categories. `all` and `whatsNew` are virtual filters (not stored on
 * products). Labels are translated in messages/*.json under the `categories`
 * namespace, keyed by the `key` field below.
 */
export type CategorySlug =
  | "earrings"
  | "rings"
  | "pendants"
  | "engagement";

export interface CategoryDef {
  /** URL slug + filter id. "all"/"new" are virtual. */
  slug: "all" | "new" | CategorySlug;
  /** i18n key under the `categories` namespace. */
  key: string;
}

export const CATEGORY_NAV: CategoryDef[] = [
  { slug: "all", key: "all" },
  // "What's new" hidden until there are pieces flagged as `isNew: true`.
  // Re-add `{ slug: "new", key: "whatsNew" }` when ready.
  { slug: "earrings", key: "earrings" },
  { slug: "rings", key: "rings" },
  { slug: "pendants", key: "pendants" },
  { slug: "engagement", key: "engagement" },
];

/** Real product categories (excludes the virtual "all"/"new"). */
export const PRODUCT_CATEGORIES: CategorySlug[] = [
  "earrings",
  "rings",
  "pendants",
  "engagement",
];
