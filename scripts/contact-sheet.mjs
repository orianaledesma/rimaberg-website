#!/usr/bin/env node
/**
 * Visual contact sheet — scans /public/products and writes an HTML page with
 * every photo as a labelled thumbnail. Open it to map photos → pieces and to
 * fill content/products.csv (the `images` column takes the filenames).
 *
 * Run with:  npm run contact-sheet   →   content/contact-sheet.html
 */
import { readdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(root, "public/products");
const OUT = resolve(root, "content/contact-sheet.html");

const files = readdirSync(DIR)
  .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
  .sort();

// Filenames already assigned to a piece in the CSV, to flag what's left to do.
const used = new Set();
const csvPath = resolve(root, "content/products.csv");
if (existsSync(csvPath)) {
  const csv = readFileSync(csvPath, "utf-8");
  for (const m of csv.matchAll(/([A-Za-z0-9_]+\.(?:jpe?g|png|webp|avif))/gi)) {
    used.add(m[1]);
  }
}

const cards = files
  .map((f) => {
    const isUsed = used.has(f);
    return `<figure class="card${isUsed ? " used" : ""}" data-name="${f.toLowerCase()}">
      <img loading="lazy" src="../public/products/${f}" alt="${f}">
      <figcaption>${f}${isUsed ? " ✓" : ""}</figcaption>
    </figure>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rima Berg — contact sheet (${files.length} photos)</title>
<style>
  :root { --ink:#0a0a0a; --bg:#fafaf8; --line:rgba(0,0,0,.1); }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:14px/1.4 system-ui, sans-serif; }
  header { position:sticky; top:0; background:var(--bg); border-bottom:1px solid var(--line); padding:16px 24px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; z-index:1; }
  header h1 { font-size:15px; font-weight:600; margin:0; letter-spacing:.04em; }
  header .muted { opacity:.55; }
  input { padding:8px 12px; border:1px solid var(--line); border-radius:6px; font:inherit; min-width:220px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(150px,1fr)); gap:14px; padding:24px; }
  .card { margin:0; border:1px solid var(--line); background:#fff; border-radius:8px; overflow:hidden; }
  .card.used { outline:2px solid #2e7d32; }
  .card img { display:block; width:100%; aspect-ratio:1/1; object-fit:cover; background:#eee; }
  figcaption { font:11px/1.3 ui-monospace, monospace; padding:6px 8px; word-break:break-all; }
  .hidden { display:none; }
</style>
</head>
<body>
<header>
  <h1>Rima Berg · contact sheet</h1>
  <span class="muted">${files.length} photos · <span style="color:#2e7d32">✓ = already in products.csv</span></span>
  <input id="q" type="search" placeholder="Filter by filename…" autofocus>
</header>
<div class="grid" id="grid">
${cards}
</div>
<script>
  const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('.card')];
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    cards.forEach((c) => c.classList.toggle('hidden', v && !c.dataset.name.includes(v)));
  });
</script>
</body>
</html>
`;

writeFileSync(OUT, html, "utf-8");
console.log(`✓ Contact sheet: content/contact-sheet.html (${files.length} photos, ${used.size} already assigned)`);
