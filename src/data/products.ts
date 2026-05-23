import type { CategorySlug } from "./categories";
import { PRODUCTS } from "./products.generated";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * RIMA BERG — product catalogue (types + selectors)
 * ─────────────────────────────────────────────────────────────────────────
 * The piece data itself lives in ./products.generated.ts, which is produced
 * from content/products.csv by `npm run import:products`. Edit the CSV (one row
 * per piece) — never the generated file. This module owns the types and the
 * read helpers the app uses.
 */

export type PriceStatus = "onRequest" | "preOrder" | "madeToOrder" | "soldOut";

export interface LocalizedText {
  en: string;
  lt: string;
}

export interface Product {
  /** URL slug + stable id. */
  id: string;
  /** Proper name — same across locales. */
  name: string;
  /** Studio reference, e.g. "RB · 0427 · unique". */
  code: string;
  category: CategorySlug;
  status: PriceStatus;
  /** First image is the primary; a second image powers the hover swap. */
  images: string[];
  material: LocalizedText;
  stones: LocalizedText;
  sizes: LocalizedText;
  leadTime: LocalizedText;
  description: LocalizedText;
  featured?: boolean;
  isNew?: boolean;
}

export { PRODUCTS };

/* ── Selectors ──────────────────────────────────────────────────────────── */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getNew(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}

/** Related pieces: same category first, then fill from the rest. */
export function getRelated(id: string, count = 4): Product[] {
  const current = getProductById(id);
  if (!current) return PRODUCTS.slice(0, count);
  const sameCat = PRODUCTS.filter(
    (p) => p.id !== id && p.category === current.category
  );
  const others = PRODUCTS.filter(
    (p) => p.id !== id && p.category !== current.category
  );
  return [...sameCat, ...others].slice(0, count);
}
