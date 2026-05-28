import type { CategorySlug } from "./categories";
import { PRODUCTS as GENERATED } from "./products.generated";
import { MANUAL_PRODUCTS } from "./products.manual";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * RIMA BERG — product catalogue (types + selectors)
 * ─────────────────────────────────────────────────────────────────────────
 * The piece data itself lives in ./products.generated.ts, which is produced
 * from content/products.csv by `npm run import:products`. Edit the CSV (one row
 * per piece) — never the generated file. This module owns the types and the
 * read helpers the app uses.
 */

export type PriceStatus = "onRequest" | "madeToOrder" | "soldOut";

export interface LocalizedText {
  en: string;
  lt: string;
}

export interface Product {
  /** URL slug + stable id. */
  id: string;
  /** Localized display name (LT primary, EN secondary). */
  name: LocalizedText;
  /** Studio hallmark/reference, e.g. "Au/0133". */
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
  /** When true, the product detail page skips rendering the description block.
   *  Used by the Carrousel collection — Rima asked to suppress the captions
   *  for now while leaving them in data so a single flag flip turns them on. */
  hideDescription?: boolean;
}

/** Generated pieces (from CSV) + the manually-curated Carrousel collection. */
export const PRODUCTS: Product[] = [...GENERATED, ...MANUAL_PRODUCTS];

/**
 * A piece is "publishable" when it carries a real name AND a description in at
 * least one locale. The import script auto-fills missing names with the id, so
 * we reject names that equal the id (e.g. "earring-2", "ring-1") — those are
 * placeholders waiting on Rima's input. The public catalogue stays curated
 * even while content is in flight.
 */
function isRealName(name: string | undefined, id: string): boolean {
  const n = name?.trim();
  if (!n) return false;
  return n.toLowerCase() !== id.toLowerCase();
}
export function isPublishable(p: Product): boolean {
  const hasName = isRealName(p.name.lt, p.id) || isRealName(p.name.en, p.id);
  const hasDesc = !!(p.description.lt?.trim() || p.description.en?.trim());
  return hasName && hasDesc;
}

/* ── Selectors (public; only return publishable pieces) ─────────────────── */

export function getAllProducts(): Product[] {
  // Carrousel pieces are hero-only: they live in MANUAL_PRODUCTS so HeroPieces
  // can drive its rotation with curated photos + poetic captions, but they
  // duplicate real CSV pieces (e.g. naktine-zvaigzde ↔ earring-2). Exclude
  // them from /catalogue so the listing stays free of duplicates.
  return PRODUCTS.filter((p) => p.category !== "carrousel" && isPublishable(p));
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getByCategory(category: CategorySlug): Product[] {
  // Engagement pieces are rings too: the "rings" filter shows both, while
  // "engagement" keeps its own dedicated view (matches the old site).
  const inCategory =
    category === "rings"
      ? (p: Product) => p.category === "rings" || p.category === "engagement"
      : (p: Product) => p.category === category;
  return PRODUCTS.filter((p) => inCategory(p) && isPublishable(p));
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured && isPublishable(p));
}

export function getNew(): Product[] {
  return PRODUCTS.filter((p) => p.isNew && isPublishable(p));
}

/** A shuffled sample of pieces (random at build time). */
export function getRandom(count = 10): Product[] {
  const arr = PRODUCTS.filter(isPublishable);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

/** Related pieces: same category first, then fill from the rest. */
export function getRelated(id: string, count = 4): Product[] {
  const all = PRODUCTS.filter(isPublishable);
  const current = getProductById(id);
  if (!current) return all.slice(0, count);
  const sameCat = all.filter(
    (p) => p.id !== id && p.category === current.category
  );
  const others = all.filter(
    (p) => p.id !== id && p.category !== current.category
  );
  return [...sameCat, ...others].slice(0, count);
}
