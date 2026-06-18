"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { upsertProduct, uploadImage } from "../../product-actions";
import { PendingOverlay } from "../PendingOverlay";
import type { AdminProductRow } from "@/lib/admin/products";

const CATEGORIES = ["earrings", "rings", "pendants", "engagement", "carrousel"] as const;

const EMPTY: AdminProductRow = {
  id: "",
  name_en: "", name_lt: "",
  code: "", category: "rings", status: "onRequest",
  images: [],
  material_en: "", material_lt: "",
  stones_en: "", stones_lt: "",
  sizes_en: "", sizes_lt: "",
  lead_time_en: "", lead_time_lt: "",
  description_en: "", description_lt: "",
  featured: false, is_new: false, hide_description: false,
  published: true, sort_order: 0,
};

/** Localized text pair (LT + EN) in one row. */
function LocalizedField({
  label, base, defaults, textarea,
}: {
  label: string;
  base: string;
  defaults: { lt: string; en: string };
  textarea?: boolean;
}) {
  const Field = textarea ? "textarea" : "input";
  return (
    <div className="adm-row2">
      <div className="adm-field">
        <label>{label} · LT</label>
        <Field className={textarea ? "adm-textarea" : "adm-input"} name={`${base}_lt`} defaultValue={defaults.lt} />
      </div>
      <div className="adm-field">
        <label>{label} · EN</label>
        <Field className={textarea ? "adm-textarea" : "adm-input"} name={`${base}_en`} defaultValue={defaults.en} />
      </div>
    </div>
  );
}

export default function ProductForm({
  product,
  isNewRecord,
}: {
  product: AdminProductRow;
  isNewRecord: boolean;
}) {
  const p = product ?? EMPTY;
  const [images, setImages] = useState<string[]>(p.images);
  const [idValue, setIdValue] = useState<string>(p.id);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("productId", idValue || "unsorted");
        const res = await uploadImage(fd);
        if ("error" in res) setError(res.error);
        else setImages((prev) => [...prev, res.url]);
      }
    } finally {
      setUploading(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function remove(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }
  function makePrimary(i: number) {
    setImages((prev) => {
      if (i === 0) return prev;
      const next = [...prev];
      const [img] = next.splice(i, 1);
      next.unshift(img);
      return next;
    });
  }

  return (
    <form
      action={(fd) => {
        fd.set("images", JSON.stringify(images));
        startTransition(() => {
          upsertProduct(fd);
        });
      }}
    >
      <input type="hidden" name="isNewRecord" value={isNewRecord ? "1" : "0"} />
      <input type="hidden" name="sort_order" value={p.sort_order} />

      <PendingOverlay
        show={isPending || uploading}
        label={uploading ? "Uploading… · Įkeliama…" : "Saving… · Išsaugoma…"}
      />

      {error && <div className="adm-notice error">{error}</div>}

      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-row2">
          <div className="adm-field">
            <label>Id / slug {isNewRecord ? "" : "(careful — changing this changes the URL)"}</label>
            <input
              className="adm-input"
              name="id"
              value={idValue}
              onChange={(e) => setIdValue(e.target.value)}
              placeholder="e.g. aurora-ring"
            />
          </div>
          <div className="adm-field">
            <label>Code / hallmark</label>
            <input className="adm-input" name="code" defaultValue={p.code} placeholder="Au/0133" />
          </div>
        </div>
        <div className="adm-field">
          <label>Category</label>
          <select className="adm-select" name="category" defaultValue={p.category}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Images ──────────────────────────────────────────── */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.6 }}>
          Images · first is the cover
        </label>
        <div className="adm-imgrid" style={{ margin: "14px 0" }}>
          {images.map((src, i) => (
            <div key={src + i} className={`adm-imgcell ${i === 0 ? "primary" : ""}`}>
              {i === 0 && <span className="adm-imgbadge">Cover</span>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
              <div className="adm-imgbar">
                <button type="button" className="adm-iconbtn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">←</button>
                <button type="button" className="adm-iconbtn" onClick={() => makePrimary(i)} disabled={i === 0} aria-label="Set as cover">★</button>
                <button type="button" className="adm-iconbtn" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move right">→</button>
                <button type="button" className="adm-iconbtn" onClick={() => remove(i)} aria-label="Remove">✕</button>
              </div>
            </div>
          ))}
        </div>
        <label className="adm-btn adm-btn-ghost adm-btn-sm" style={{ cursor: "pointer" }}>
          {uploading ? "Uploading…" : "+ Add images"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {!idValue && (
          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 8 }}>
            Tip: set the id/slug first so uploads are filed under it.
          </p>
        )}
      </div>

      {/* ── Text ────────────────────────────────────────────── */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <LocalizedField label="Name" base="name" defaults={{ lt: p.name_lt, en: p.name_en }} />
        <LocalizedField label="Material" base="material" defaults={{ lt: p.material_lt, en: p.material_en }} />
        <LocalizedField label="Stones" base="stones" defaults={{ lt: p.stones_lt, en: p.stones_en }} />
        <LocalizedField label="Sizes" base="sizes" defaults={{ lt: p.sizes_lt, en: p.sizes_en }} />
        <LocalizedField label="Lead time" base="lead_time" defaults={{ lt: p.lead_time_lt, en: p.lead_time_en }} />
        <LocalizedField label="Description" base="description" defaults={{ lt: p.description_lt, en: p.description_en }} textarea />
      </div>

      {/* ── Flags ───────────────────────────────────────────── */}
      <div className="adm-card" style={{ marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="published" defaultChecked={p.published} /> Published (visible on site)
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="featured" defaultChecked={p.featured} /> Featured
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="is_new" defaultChecked={p.is_new} /> New
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="hide_description" defaultChecked={p.hide_description} /> Hide description
        </label>
      </div>

      <div className="adm-toolbar">
        <button type="submit" className="adm-btn" disabled={isPending || uploading}>
          {isPending ? "Saving…" : "Save product"}
        </button>
        <Link href="/admin/products" className="adm-btn adm-btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
