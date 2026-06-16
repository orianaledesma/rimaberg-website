"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminClient, STORAGE_BUCKET } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/guard";

/** Slugify an id/name into a safe url + storage segment. */
function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function db() {
  const client = adminClient();
  if (!client) throw new Error("Supabase is not configured (missing service role key).");
  return client;
}

/** Refresh every public surface that reads the catalogue. */
function revalidatePublic(id?: string) {
  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/about");
  if (id) revalidatePath(`/catalogue/${id}`);
}

/**
 * Upload one image to Storage and return its public URL. Called from the client
 * editor as files are added. Files are namespaced under the product id.
 */
export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  const productId = slugify(String(formData.get("productId") ?? "")) || "unsorted";
  if (!(file instanceof File) || file.size === 0) return { error: "No file" };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safe = slugify(file.name.replace(/\.[^.]+$/, "")) || "img";
  const path = `${productId}/${Date.now()}-${safe}.${ext}`;

  const { error } = await db()
    .storage.from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) return { error: error.message };

  const { data } = db().storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

/** Create or update a product from the editor form. */
export async function upsertProduct(formData: FormData) {
  await requireAdmin();

  const rawId = String(formData.get("id") ?? "").trim();
  const isNew = String(formData.get("isNewRecord") ?? "") === "1";
  const nameLt = String(formData.get("name_lt") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();

  // Derive a slug from the id field, falling back to the name.
  const id = slugify(rawId || nameEn || nameLt);
  if (!id) throw new Error("A name or id is required.");

  let images: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("images") ?? "[]"));
    if (Array.isArray(parsed)) images = parsed.filter((s) => typeof s === "string");
  } catch {
    images = [];
  }

  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  const record = {
    id,
    name_en: nameEn,
    name_lt: nameLt,
    code: String(formData.get("code") ?? "").trim(),
    category: String(formData.get("category") ?? "rings"),
    images,
    material_en: String(formData.get("material_en") ?? ""),
    material_lt: String(formData.get("material_lt") ?? ""),
    stones_en: String(formData.get("stones_en") ?? ""),
    stones_lt: String(formData.get("stones_lt") ?? ""),
    sizes_en: String(formData.get("sizes_en") ?? ""),
    sizes_lt: String(formData.get("sizes_lt") ?? ""),
    lead_time_en: String(formData.get("lead_time_en") ?? ""),
    lead_time_lt: String(formData.get("lead_time_lt") ?? ""),
    description_en: String(formData.get("description_en") ?? ""),
    description_lt: String(formData.get("description_lt") ?? ""),
    featured: formData.get("featured") === "on",
    is_new: formData.get("is_new") === "on",
    hide_description: formData.get("hide_description") === "on",
    published: formData.get("published") === "on",
    sort_order: sortOrder,
  };

  const { error } = await db().from("products").upsert(record, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePublic(id);
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

/** Delete a product. */
export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const { error } = await db().from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic(id);
  revalidatePath("/admin/products");
  redirect("/admin/products?deleted=1");
}

/** Move a product up or down in the listing order (swaps sort_order). */
export async function moveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  if (!id || (dir !== "up" && dir !== "down")) return;

  const { data } = await db()
    .from("products")
    .select("id,sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (!data) return;

  const idx = data.findIndex((p) => p.id === id);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= data.length) return;

  const a = data[idx];
  const b = data[swapIdx];
  // Reassign sequential orders to avoid ties, then swap the two.
  await db().from("products").update({ sort_order: b.sort_order }).eq("id", a.id);
  await db().from("products").update({ sort_order: a.sort_order }).eq("id", b.id);

  revalidatePublic();
  revalidatePath("/admin/products");
}
