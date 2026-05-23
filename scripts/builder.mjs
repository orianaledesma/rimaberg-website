#!/usr/bin/env node
/**
 * Content builder — generates an interactive page to assemble the catalogue:
 * group photos into a piece, fill its data, and export content/products.csv.
 *
 *   npm run builder   →   content/builder.html   (open in a browser)
 *
 * It embeds the current photo list (public/products) and the existing CSV rows
 * so you can keep editing. Work is saved to localStorage; "Export CSV" produces
 * a file in the exact schema `npm run import:products` expects.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(root, "public/products");
const CSV = resolve(root, "content/products.csv");
const OUT = resolve(root, "content/builder.html");

const photos = readdirSync(DIR)
  .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
  .sort();

// ── parse the existing CSV into seed objects (same minimal RFC-4180 parser) ──
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\r") {}
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
let seed = [];
if (existsSync(CSV)) {
  const rows = parseCSV(readFileSync(CSV, "utf-8")).filter((r) => r.some((c) => c.trim()));
  const header = rows.shift().map((h) => h.trim());
  seed = rows.map((cells) => {
    const o = {};
    header.forEach((h, i) => (o[h] = (cells[i] ?? "").trim()));
    o.images = (o.images || "").split("|").map((s) => s.trim()).filter(Boolean);
    o.featured = /^(yes|true|1)$/i.test(o.featured || "");
    o.new = /^(yes|true|1)$/i.test(o.new || "");
    return o;
  });
}

const html = String.raw`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rima Berg — content builder</title>
<style>
  :root { --ink:#0a0a0a; --bg:#fafaf8; --line:rgba(0,0,0,.12); --accent:#c96442; --ok:#2e7d32; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:14px/1.45 system-ui,sans-serif; }
  header { position:sticky; top:0; z-index:5; background:var(--bg); border-bottom:1px solid var(--line);
    padding:12px 20px; display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
  header h1 { font-size:14px; font-weight:600; margin:0; letter-spacing:.04em; }
  .muted { opacity:.55; }
  button { font:inherit; cursor:pointer; border:1px solid var(--ink); background:transparent; color:var(--ink);
    padding:8px 14px; border-radius:6px; }
  button.primary { background:var(--ink); color:var(--bg); }
  button.ghost { border-color:var(--line); }
  button.danger { border-color:#b3261e; color:#b3261e; }
  input, select, textarea { font:inherit; padding:7px 10px; border:1px solid var(--line); border-radius:6px;
    width:100%; background:#fff; color:var(--ink); }
  textarea { resize:vertical; min-height:54px; }
  label { display:block; font-size:11px; letter-spacing:.04em; text-transform:uppercase; opacity:.6; margin:10px 0 4px; }
  .layout { display:grid; grid-template-columns:1fr 420px; gap:0; align-items:start; }
  .photos { padding:16px 20px; }
  .pgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px; }
  figure { margin:0; position:relative; border:2px solid transparent; border-radius:8px; overflow:hidden; cursor:pointer; background:#fff; }
  figure img { display:block; width:100%; aspect-ratio:1/1; object-fit:cover; background:#eee; }
  figure figcaption { font:10px/1.2 ui-monospace,monospace; padding:4px 6px; word-break:break-all; }
  figure.sel { border-color:var(--accent); }
  figure.sel .order { position:absolute; top:4px; left:4px; background:var(--accent); color:#fff;
    width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font:11px/1 system-ui; }
  figure .badge { position:absolute; top:4px; right:4px; background:var(--ok); color:#fff; font:9px/1 system-ui;
    padding:3px 5px; border-radius:4px; max-width:90%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .panel { position:sticky; top:53px; height:calc(100vh - 53px); overflow:auto; border-left:1px solid var(--line); padding:16px 18px; background:#fff; }
  .row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
  .chip { font:10px/1 ui-monospace,monospace; background:#f0efe9; padding:5px 7px; border-radius:5px; }
  .plist { margin-top:6px; }
  .pitem { display:flex; gap:8px; align-items:center; padding:7px 8px; border:1px solid var(--line); border-radius:6px; margin-bottom:6px; }
  .pitem b { font-weight:600; }
  .pitem .sp { flex:1; }
  .pitem img { width:34px; height:34px; object-fit:cover; border-radius:4px; }
  .hidden { display:none; }
  .hint { font-size:12px; opacity:.6; margin:4px 0 12px; }
</style>
</head><body>
<header>
  <h1>Rima Berg · content builder</h1>
  <span class="muted" id="counts"></span>
  <span style="flex:1"></span>
  <input id="q" type="search" placeholder="Filter photos…" style="width:200px">
  <button class="ghost" id="onlyFree">Show unassigned</button>
  <button class="primary" id="export">Export CSV ⬇</button>
  <button class="ghost" id="copy">Copy CSV</button>
  <button class="danger" id="reset">Reset</button>
</header>

<div class="layout">
  <div class="photos">
    <p class="hint">Click photos to add them to the piece on the right (number = order; first photo is the primary). Green badge = already in a piece.</p>
    <div class="pgrid" id="pgrid"></div>
  </div>

  <aside class="panel">
    <div style="display:flex; gap:8px; align-items:center">
      <strong id="formTitle">New piece</strong>
      <span class="sp" style="flex:1"></span>
      <button class="ghost" id="clear">Clear</button>
    </div>
    <label>Selected photos (click a chip to remove)</label>
    <div class="chips" id="chips"><span class="muted">none yet</span></div>

    <div class="row2">
      <div><label>Name</label><input id="f_name" placeholder="Žinija"></div>
      <div><label>id (slug)</label><input id="f_id" placeholder="auto from name"></div>
    </div>
    <div class="row2">
      <div><label>Category</label>
        <select id="f_category">
          <option value="earrings">earrings · Auskarai</option>
          <option value="rings">rings · Žiedai</option>
          <option value="pendants">pendants · Pakabukai</option>
          <option value="bracelets">bracelets · Apyrankės</option>
          <option value="engagement">engagement · Sužadėtuvėms</option>
        </select>
      </div>
      <div><label>Status</label>
        <select id="f_status">
          <option value="onRequest">onRequest</option>
          <option value="preOrder">preOrder</option>
          <option value="madeToOrder">madeToOrder</option>
        </select>
      </div>
    </div>
    <div class="row2">
      <div><label>Code</label><input id="f_code" placeholder="RB · 0411 · unique"></div>
      <div style="display:flex; gap:14px; align-items:flex-end; padding-bottom:7px">
        <label style="margin:0; display:flex; gap:6px; align-items:center; text-transform:none"><input type="checkbox" id="f_featured" style="width:auto"> featured</label>
        <label style="margin:0; display:flex; gap:6px; align-items:center; text-transform:none"><input type="checkbox" id="f_new" style="width:auto"> new</label>
      </div>
    </div>

    <div class="row2">
      <div><label>Material LT</label><input id="f_material_lt"></div>
      <div><label>Material EN</label><input id="f_material_en"></div>
    </div>
    <div class="row2">
      <div><label>Stones LT</label><input id="f_stones_lt"></div>
      <div><label>Stones EN</label><input id="f_stones_en"></div>
    </div>
    <div class="row2">
      <div><label>Sizes LT</label><input id="f_sizes_lt"></div>
      <div><label>Sizes EN</label><input id="f_sizes_en"></div>
    </div>
    <div class="row2">
      <div><label>Lead time LT</label><input id="f_leadtime_lt"></div>
      <div><label>Lead time EN</label><input id="f_leadtime_en"></div>
    </div>
    <label>Description LT</label><textarea id="f_description_lt"></textarea>
    <label>Description EN</label><textarea id="f_description_en"></textarea>

    <div style="display:flex; gap:8px; margin-top:14px">
      <button class="primary" id="save" style="flex:1">Save piece</button>
    </div>

    <hr style="margin:18px 0; border:none; border-top:1px solid var(--line)">
    <strong>Pieces (<span id="pcount">0</span>)</strong>
    <div class="plist" id="plist"></div>
  </aside>
</div>

<script>
const PHOTOS = ${JSON.stringify(photos)};
const SEED = ${JSON.stringify(seed)};
const FIELDS = ["id","category","images","name","code","status","featured","new",
  "material_lt","material_en","stones_lt","stones_en","sizes_lt","sizes_en",
  "leadtime_lt","leadtime_en","description_lt","description_en"];
const KEY = "rb-builder-v1";

let products = load();
let selected = [];        // ordered filenames for the piece being edited
let editingId = null;     // id when editing an existing piece
let filterText = "";
let onlyFree = false;

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(s)) return s; } catch {}
  return SEED.map(clone);
}
function persist() { localStorage.setItem(KEY, JSON.stringify(products)); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function slugify(s) {
  return (s||"").normalize("NFD").replace(/[̀-ͯ]/g,"")
    .toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
function assignedMap() {
  const m = {};
  products.forEach(p => { if (p.id !== editingId) (p.images||[]).forEach(f => m[f] = p.name || p.id); });
  return m;
}

const $ = id => document.getElementById(id);

function renderPhotos() {
  const used = assignedMap();
  const q = filterText.toLowerCase();
  $("pgrid").innerHTML = PHOTOS.map(f => {
    if (q && !f.toLowerCase().includes(q)) return "";
    if (onlyFree && (used[f] || selected.includes(f))) return "";
    const order = selected.indexOf(f);
    const badge = used[f] ? '<span class="badge" title="'+used[f]+'">'+used[f]+'</span>' : "";
    return '<figure class="'+(order>=0?"sel":"")+'" data-f="'+f+'">'+
      (order>=0?'<span class="order">'+(order+1)+'</span>':'')+ badge +
      '<img loading="lazy" src="../public/products/'+f+'"><figcaption>'+f+'</figcaption></figure>';
  }).join("");
  $("counts").textContent = PHOTOS.length+" photos · "+Object.keys(used).length+" assigned";
}
function renderChips() {
  $("chips").innerHTML = selected.length
    ? selected.map(f => '<span class="chip" data-f="'+f+'">'+(selected.indexOf(f)+1)+' · '+f+' ✕</span>').join("")
    : '<span class="muted">none yet</span>';
}
function renderForm() {
  $("formTitle").textContent = editingId ? "Editing: "+editingId : "New piece";
}
function renderList() {
  $("pcount").textContent = products.length;
  $("plist").innerHTML = products.map(p =>
    '<div class="pitem"><img src="../public/products/'+(p.images?.[0]||"")+'">'+
    '<div class="sp"><b>'+(p.name||p.id)+'</b> <span class="muted">'+p.category+' · '+(p.images?.length||0)+' ph</span></div>'+
    '<button class="ghost" data-edit="'+p.id+'">Edit</button>'+
    '<button class="danger" data-del="'+p.id+'">✕</button></div>'
  ).join("");
}
function renderAll() { renderPhotos(); renderChips(); renderForm(); renderList(); }

function readForm() {
  const o = { images: selected.slice() };
  ["name","id","category","status","code","material_lt","material_en","stones_lt","stones_en",
   "sizes_lt","sizes_en","leadtime_lt","leadtime_en","description_lt","description_en"]
    .forEach(k => o[k] = $("f_"+k).value.trim());
  o.featured = $("f_featured").checked;
  o.new = $("f_new").checked;
  if (!o.id) o.id = slugify(o.name);
  return o;
}
function fillForm(p) {
  ["name","id","category","status","code","material_lt","material_en","stones_lt","stones_en",
   "sizes_lt","sizes_en","leadtime_lt","leadtime_en","description_lt","description_en"]
    .forEach(k => $("f_"+k).value = p[k] || "");
  $("f_featured").checked = !!p.featured;
  $("f_new").checked = !!p.new;
  selected = (p.images||[]).slice();
}
function clearForm() {
  editingId = null; selected = [];
  fillForm({ category:"earrings", status:"onRequest" });
  $("f_category").value = "earrings"; $("f_status").value = "onRequest";
  renderAll();
}

// ── events ──
$("pgrid").addEventListener("click", e => {
  const fig = e.target.closest("figure"); if (!fig) return;
  const f = fig.dataset.f;
  const i = selected.indexOf(f);
  if (i >= 0) selected.splice(i,1); else selected.push(f);
  renderPhotos(); renderChips();
});
$("chips").addEventListener("click", e => {
  const chip = e.target.closest(".chip"); if (!chip) return;
  selected = selected.filter(f => f !== chip.dataset.f);
  renderPhotos(); renderChips();
});
$("save").addEventListener("click", () => {
  const p = readForm();
  if (!p.name) return alert("Name is required.");
  if (!p.images.length) return alert("Select at least one photo.");
  const existingIdx = products.findIndex(x => x.id === (editingId || p.id));
  if (existingIdx >= 0) products[existingIdx] = p;
  else {
    if (products.some(x => x.id === p.id)) return alert("id \""+p.id+"\" already exists. Change the name/id.");
    products.push(p);
  }
  persist(); clearForm();
});
$("clear").addEventListener("click", clearForm);
$("plist").addEventListener("click", e => {
  const ed = e.target.dataset.edit, del = e.target.dataset.del;
  if (ed) { const p = products.find(x => x.id === ed); editingId = ed; fillForm(p);
    $("f_category").value = p.category||"earrings"; $("f_status").value = p.status||"onRequest"; renderAll();
    window.scrollTo({top:0,behavior:"smooth"}); }
  if (del) { if (confirm("Delete "+del+"?")) { products = products.filter(x => x.id !== del); persist(); if (editingId===del) clearForm(); renderAll(); } }
});
$("q").addEventListener("input", e => { filterText = e.target.value; renderPhotos(); });
$("onlyFree").addEventListener("click", () => { onlyFree = !onlyFree; $("onlyFree").classList.toggle("primary", onlyFree); renderPhotos(); });
$("reset").addEventListener("click", () => { if (confirm("Discard all builder changes and reload the seed from the CSV?")) { products = SEED.map(clone); persist(); clearForm(); } });

function toCSV() {
  const esc = v => { v = String(v ?? ""); return /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; };
  const head = FIELDS.join(",");
  const lines = products.map(p => FIELDS.map(k => {
    if (k === "images") return esc((p.images||[]).join("|"));
    if (k === "featured" || k === "new") return p[k] ? "yes" : "";
    return esc(p[k]);
  }).join(","));
  return [head, ...lines].join("\n") + "\n";
}
$("export").addEventListener("click", () => {
  const blob = new Blob([toCSV()], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "products.csv"; a.click();
});
$("copy").addEventListener("click", async () => { await navigator.clipboard.writeText(toCSV()); $("copy").textContent = "Copied!"; setTimeout(()=>$("copy").textContent="Copy CSV",1200); });

clearForm();
</script>
</body></html>
`;

writeFileSync(OUT, html, "utf-8");
console.log(`✓ Builder: content/builder.html (${photos.length} photos, ${seed.length} seeded pieces)`);
