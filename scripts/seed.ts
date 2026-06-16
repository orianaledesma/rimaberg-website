/**
 * One-off seed: migrate the static catalogue (products.generated + manual) into
 * the Supabase `products` table so /admin has something to manage. Idempotent —
 * upserts by id, so re-running won't duplicate. Existing /public image paths are
 * preserved; new uploads from the admin go to Supabase Storage.
 *
 * Run:  npx tsx --env-file=.env.local scripts/seed.ts
 */
import ws from "ws";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/data/products";
import { isPublishable } from "../src/data/products";

// supabase-js eagerly builds its realtime client, which needs a global
// WebSocket — absent on Node < 22. We don't use realtime; just provide one.
if (!(globalThis as { WebSocket?: unknown }).WebSocket) {
  (globalThis as { WebSocket?: unknown }).WebSocket = ws;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const db = createClient(url, service, { auth: { persistSession: false } });

const rows = PRODUCTS.map((p, i) => ({
  id: p.id,
  name_en: p.name.en,
  name_lt: p.name.lt,
  code: p.code,
  category: p.category,
  status: p.status,
  images: p.images,
  material_en: p.material.en,
  material_lt: p.material.lt,
  stones_en: p.stones.en,
  stones_lt: p.stones.lt,
  sizes_en: p.sizes.en,
  sizes_lt: p.sizes.lt,
  lead_time_en: p.leadTime.en,
  lead_time_lt: p.leadTime.lt,
  description_en: p.description.en,
  description_lt: p.description.lt,
  featured: !!p.featured,
  is_new: !!p.isNew,
  hide_description: !!p.hideDescription,
  // Non-publishable placeholders start as drafts so the admin list reflects
  // what's actually live; publishable pieces go live exactly as before.
  published: isPublishable(p),
  sort_order: i,
}));

async function main() {
  console.log(`Seeding ${rows.length} products…`);
  const { error } = await db.from("products").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log("Done.");
}

main();
