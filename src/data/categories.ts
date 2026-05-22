/**
 * Catalogue categories. `all` and `whatsNew` are virtual filters (not stored on
 * products). Labels are translated in messages/*.json under the `categories`
 * namespace, keyed by the `key` field below.
 */
export type CategorySlug =
  | "earrings"
  | "rings"
  | "pendants"
  | "bracelets"
  | "engagement";

export interface CategoryDef {
  /** URL slug + filter id. "all"/"new" are virtual. */
  slug: "all" | "new" | CategorySlug;
  /** i18n key under the `categories` namespace. */
  key: string;
}

export const CATEGORY_NAV: CategoryDef[] = [
  { slug: "all", key: "all" },
  { slug: "new", key: "whatsNew" },
  { slug: "earrings", key: "earrings" },
  { slug: "rings", key: "rings" },
  { slug: "pendants", key: "pendants" },
  { slug: "bracelets", key: "bracelets" },
  { slug: "engagement", key: "engagement" },
];

/** Real product categories (excludes the virtual "all"/"new"). */
export const PRODUCT_CATEGORIES: CategorySlug[] = [
  "earrings",
  "rings",
  "pendants",
  "bracelets",
  "engagement",
];
