"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { adminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/guard";
import { defaultFor } from "@/lib/admin/editable-content";
import { CONTENT_TAG } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/locales";

/**
 * Save text overrides. Each field is named `${locale}|${namespace}|${key}`.
 * A value equal to the JSON default (or blank) drops the override so the text
 * reverts to the catalogue; anything else is upserted.
 */
export async function saveTexts(formData: FormData) {
  await requireAdmin();
  const db = adminClient();
  if (!db) throw new Error("Supabase is not configured (missing service role key).");

  const upserts: { namespace: string; key: string; locale: string; value: string }[] = [];
  const deletes: { namespace: string; key: string; locale: string }[] = [];

  for (const [name, raw] of formData.entries()) {
    const parts = name.split("|");
    if (parts.length < 3) continue;
    const [locale, namespace, ...keyParts] = parts;
    const key = keyParts.join("|");
    if (!isLocale(locale)) continue;

    const value = String(raw);
    const def = defaultFor(namespace, key, locale as Locale);
    if (!value.trim() || value.trim() === def.trim()) {
      deletes.push({ namespace, key, locale });
    } else {
      upserts.push({ namespace, key, locale, value });
    }
  }

  if (upserts.length > 0) {
    const { error } = await db
      .from("site_content")
      .upsert(upserts, { onConflict: "namespace,key,locale" });
    if (error) throw new Error(error.message);
  }

  // Remove overrides that now equal the default. Done per row (composite key).
  for (const d of deletes) {
    await db
      .from("site_content")
      .delete()
      .match({ namespace: d.namespace, key: d.key, locale: d.locale });
  }

  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  redirect("/admin/texts?saved=1");
}
