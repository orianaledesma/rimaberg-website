import { adminClient } from "@/lib/supabase";

/** Full product row as stored in Supabase (admin view — includes drafts). */
export interface AdminProductRow {
  id: string;
  name_en: string;
  name_lt: string;
  code: string;
  category: string;
  status: string;
  images: string[];
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
  published: boolean;
  sort_order: number;
}

const FIELDS =
  "id,name_en,name_lt,code,category,status,images,material_en,material_lt,stones_en,stones_lt,sizes_en,sizes_lt,lead_time_en,lead_time_lt,description_en,description_lt,featured,is_new,hide_description,published,sort_order";

function normalize(row: Record<string, unknown>): AdminProductRow {
  return {
    ...(row as unknown as AdminProductRow),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
  };
}

/** All products ordered for the admin list. Returns [] if Supabase is absent. */
export async function listProducts(): Promise<AdminProductRow[]> {
  const db = adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("products")
    .select(FIELDS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(normalize);
}

/** A single product by id, including draft fields. */
export async function getProductRow(id: string): Promise<AdminProductRow | null> {
  const db = adminClient();
  if (!db) return null;
  const { data, error } = await db.from("products").select(FIELDS).eq("id", id).single();
  if (error || !data) return null;
  return normalize(data);
}
