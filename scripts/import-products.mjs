#!/usr/bin/env node
/**
 * Content importer — turns the human-edited catalogue spreadsheet into the
 * typed data the app consumes.
 *
 *   content/products.csv  ──►  src/data/products.generated.ts
 *
 * Run with:  npm run import:products
 *
 * The CSV is the source of truth (one row per piece); the generated .ts file is
 * never edited by hand. Selectors and types live in src/data/products.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CSV = resolve(root, "content/products.csv");
const OUT = resolve(root, "src/data/products.generated.ts");

const CATEGORIES = ["earrings", "rings", "pendants", "engagement"];
const STATUSES = ["onRequest", "madeToOrder", "soldOut"];

/** Minimal RFC-4180 CSV parser: handles quoted fields, commas and newlines. */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\r") { /* ignore */ }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const raw = readFileSync(CSV, "utf-8");
const rows = parseCSV(raw).filter((r) => r.some((c) => c.trim() !== ""));
const header = rows.shift().map((h) => h.trim());
const idx = (name) => header.indexOf(name);

const errors = [];
const seen = new Set();
const products = [];
let drafts = 0;

rows.forEach((cells, n) => {
  const line = n + 2; // header is line 1
  const get = (k) => (idx(k) >= 0 ? (cells[idx(k)] ?? "").trim() : "");
  const id = get("id");
  const category = get("category");
  const status = get("status");
  const images = get("images").split("|").map((s) => s.trim()).filter(Boolean);

  if (!id) errors.push(`L${line}: missing id`);
  else if (seen.has(id)) errors.push(`L${line}: duplicate id "${id}"`);
  seen.add(id);
  if (!CATEGORIES.includes(category)) errors.push(`L${line} (${id}): invalid category "${category}" — use ${CATEGORIES.join("|")}`);
  if (!STATUSES.includes(status)) errors.push(`L${line} (${id}): invalid status "${status}" — use ${STATUSES.join("|")}`);

  // Pieces with no photo yet are drafts: kept in the CSV for the builder but
  // skipped from the live data (the app needs at least a primary image).
  if (images.length === 0) { drafts++; return; }

  products.push({
    id,
    category,
    status,
    name: { lt: get("name_lt") || id, en: get("name_en") || get("name_lt") || id },
    code: get("code"),
    images: images.map((f) => `/products/${f}`),
    material: { lt: get("material_lt"), en: get("material_en") },
    stones: { lt: get("stones_lt"), en: get("stones_en") },
    sizes: { lt: get("sizes_lt"), en: get("sizes_en") },
    leadTime: { lt: get("leadtime_lt"), en: get("leadtime_en") },
    description: { lt: get("description_lt"), en: get("description_en") },
    featured: /^(yes|true|1)$/i.test(get("featured")),
    isNew: /^(yes|true|1)$/i.test(get("new")),
  });
});

if (errors.length) {
  console.error(`\n✗ ${errors.length} content error(s) in content/products.csv:\n`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}

const s = (v) => JSON.stringify(v);
const loc = (o) => `{ lt: ${s(o.lt)}, en: ${s(o.en)} }`;
const body = products
  .map((p) => {
    const lines = [
      `    id: ${s(p.id)},`,
      `    category: ${s(p.category)},`,
      `    status: ${s(p.status)},`,
      `    name: ${loc(p.name)},`,
      `    code: ${s(p.code)},`,
      `    images: [${p.images.map(s).join(", ")}],`,
      `    material: ${loc(p.material)},`,
      `    stones: ${loc(p.stones)},`,
      `    sizes: ${loc(p.sizes)},`,
      `    leadTime: ${loc(p.leadTime)},`,
      `    description: ${loc(p.description)},`,
    ];
    if (p.featured) lines.push(`    featured: true,`);
    if (p.isNew) lines.push(`    isNew: true,`);
    return `  {\n${lines.join("\n")}\n  },`;
  })
  .join("\n");

const out = `// AUTO-GENERATED — do not edit by hand.
// Source: content/products.csv · regenerate with \`npm run import:products\`.
// Types and selectors live in ./products.ts.
import type { Product } from "./products";

export const PRODUCTS: Product[] = [
${body}
];
`;

writeFileSync(OUT, out, "utf-8");
console.log(
  `✓ Imported ${products.length} live pieces → src/data/products.generated.ts` +
    (drafts ? ` (${drafts} draft${drafts > 1 ? "s" : ""} without photos skipped)` : "")
);
