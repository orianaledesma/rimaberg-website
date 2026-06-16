import { cache } from "react";
import { publicClient, isSupabaseConfigured } from "@/lib/supabase";
import type { CategorySlug } from "./categories";
import {
  PRODUCTS as STATIC_PRODUCTS,
  isPublishable,
  type Product,
  type PriceStatus,
} from "./products";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Catalogue read layer (Supabase-backed, with static fallback)
 * ─────────────────────────────────────────────────────────────────────────
 * Server Components read pieces through these async selectors. When Supabase
 * is configured they return rows from the `products` table (managed in /admin);
 * otherwise — or on any error — they fall back to the static catalogue in
 * products.ts so the site never goes blank during the migration.
 */

/** Shape of a `products` row as returned by Supabase. */
interface ProductRow {
  id: string;
  name_en: string;
  name_lt: string;
  code: string;
  category: string;
  status: string;
  images: string[] | null;
  material_en: string;
  material_lt: string;
  stones_en: string;
  stones_lt: string;
  sizes_en: string;
  sizes_lt: string;
  lead_time_en: string;
  lead_time_lt: string;
  description_en: string;
  description_lt: string;
  featured: boolean;
  is_new: boolean;
  hide_description: boolean;
}

function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: { en: r.name_en, lt: r.name_lt },
    code: r.code,
    category: r.category as CategorySlug,
    status: r.status as PriceStatus,
    images: Array.isArray(r.images) ? r.images : [],
    material: { en: r.material_en, lt: r.material_lt },
    stones: { en: r.stones_en, lt: r.stones_lt },
    sizes: { en: r.sizes_en, lt: r.sizes_lt },
    leadTime: { en: r.lead_time_en, lt: r.lead_time_lt },
    description: { en: r.description_en, lt: r.description_lt },
    featured: r.featured,
    isNew: r.is_new,
    hideDescription: r.hide_description,
  };
}

/**
 * Load every product (deduped per request via React `cache`). Returns the
 * Supabase set when available, else the static catalogue. The result is the
 * full set — selectors below apply the same publishable/category filters the
 * static module used, so behaviour is identical when falling back.
 */
const loadProducts = cache(async (): Promise<Product[]> => {
  const db = publicClient();
  if (!db) return STATIC_PRODUCTS;
  const { data, error } = await db
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data || data.length === 0) return STATIC_PRODUCTS;
  return (data as ProductRow[]).map(rowToProduct);
});

/* ── Async selectors (mirror src/data/products.ts) ──────────────────────── */

export async function getAllProducts(): Promise<Product[]> {
  const all = await loadProducts();
  return all.filter((p) => p.category !== "carrousel" && isPublishable(p));
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await loadProducts();
  return all.find((p) => p.id === id);
}

export async function getByCategory(category: CategorySlug): Promise<Product[]> {
  const all = await loadProducts();
  const inCategory =
    category === "rings"
      ? (p: Product) => p.category === "rings" || p.category === "engagement"
      : (p: Product) => p.category === category;
  return all.filter((p) => inCategory(p) && isPublishable(p));
}

export async function getFeatured(): Promise<Product[]> {
  const all = await loadProducts();
  return all.filter((p) => p.featured && isPublishable(p));
}

export async function getNew(): Promise<Product[]> {
  const all = await loadProducts();
  return all.filter((p) => p.isNew && isPublishable(p));
}

export async function getRelated(id: string, count = 4): Promise<Product[]> {
  const pubs = (await loadProducts()).filter(isPublishable);
  const current = pubs.find((p) => p.id === id);
  if (!current) return pubs.slice(0, count);
  const sameCat = pubs.filter((p) => p.id !== id && p.category === current.category);
  const others = pubs.filter((p) => p.id !== id && p.category !== current.category);
  return [...sameCat, ...others].slice(0, count);
}

export { isPublishable };
export type { Product };
