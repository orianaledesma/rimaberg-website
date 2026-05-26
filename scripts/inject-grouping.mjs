#!/usr/bin/env node
/**
 * Pre-carga en builder.html las agrupaciones foto→pieza que hizo Claude
 * (clasificación visual de las 128 fotos). Edita la constante SEED y bumpea
 * la KEY de localStorage para que el builder abra mostrando estas asignaciones.
 *
 * Es una PROPUESTA: Oriana revisa en el builder y corrige lo que no coincide.
 * Re-ejecutable: editá MAP y volvé a correr `node scripts/inject-grouping.mjs`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = resolve(root, "content/builder.html");

// Fotos cuyo archivo real es .JPEG (el resto son .JPG)
const JPEGS = new Set(["BSDS0387","CKFL0423","DKIV8831","DRAB4844","EWAG4701",
  "GHUB9190","GOWJ1319","GWOR7535","IHOL5031","JPBJ3789","JTPU1824","NOLG9703",
  "OMDC8888","TBNH6232","TKVA0382","XLYU1213"]);
const ext = (f) => f + (JPEGS.has(f) ? ".JPEG" : ".JPG");

// id del CSV  →  fotos (1ª = primaria, 2ª = hover). Solo asignaciones razonables;
// los clusters dudosos quedan sueltos para que Ori los ubique a ojo.
const MAP = {
  // ── RINGS / ENGAGEMENT ──
  "uogos-peridotai": ["CSTK9172","EKST5959","EYAJ0530","IQFE9915","VUPW8859","YHBO0847"],
  "uogos-naktyje": ["OHJDE7035","OMDC8888","TKVA0382"],
  "bundanti-gamta": ["HMKZ3041","UQMZ0328"],
  "uogos-oniksai-ametistai-turmalinai": ["AYDJ8153","GULR0741","PALR1784"],
  "uogos-ametistai-peridotai": ["CQTQ7819","MHLO8123"],
  "trys-pasirinkimai": ["MYTG1376","PHRI5100","POMT3567","UTQC4256"],
  "serdis": ["HTNH7002","LMQU4182","MIVI4604","NEIV8493"],
  "barokas": ["VGWS2741","WOWN8142","RENJ5883"],
  "bangose": ["LAHVE6558","LBWC5844","MNGZ5751","NPLH0546"],
  "vakaro-dangus": ["EKRE0353","LWRJ7149","XQUZ2394"],
  "spalvotos-mintys-topazas": ["DXWH5141"],
  "bangose-ametista": ["DEVK4155","PCUU1560"],
  "gele": ["IMG_E6484","JHJY1419"],
  "ekscentriskas": ["CSOZE2730","GOWJ1319","IQGEE5703","NOLG9703"],
  "siekiai": ["IHOL5031"],
  "spalvotos-mintys-rozinis-rodolitas": ["BFYI7056","RCTJ3400"],
  "kitaip": ["BSDS0387","GHUB9190","EXZCE7021","SADDE6936","UCIJE1970"],
  "besiskleidziantis-pavasaris": ["JPBJ3789","PYBYE4944","TBNH6232"],
  "spalvotos-mintys": ["KKWP1933"],
  "svajones": ["ERGF9671","OVYC2621"],
  // ── EARRINGS ──
  "drugelis-mieste-su-akmenimis": ["AQHK3944","DXLX7939"],
  "dvi-geles": ["BZZC2577","GJRT7554","GWDF6528"],
  "sodas": ["DZFA6344","JTLD7370","UHOU4089"],
  "mieste": ["GJOJ5082","KEIF2650"],
  "debesys": ["HYXK1951","UNXI7718"],
  "dangaus-zydryne": ["EVMC6579","QHYS4544"],
  "beribis": ["FFQB5036","XDDP7218"],
  "primityvai": ["EWAG4701","XLYU1213"],
  "po-vandeniu": ["GQDB0230","GZTQ4339"],
  // ── PENDANTS ──
  "spalvotos-uogos": ["TDYK1987"],
};

let html = readFileSync(FILE, "utf-8");

// 1) Extraer y parsear el SEED
const m = html.match(/const SEED = (\[[\s\S]*?\]);/);
if (!m) { console.error("✗ No encontré la constante SEED en builder.html"); process.exit(1); }
const seed = JSON.parse(m[1]);
const byId = new Map(seed.map((p) => [p.id, p]));

// 2) Validar y aplicar
const errs = [];
let assignedPieces = 0, assignedPhotos = 0;
for (const [id, photos] of Object.entries(MAP)) {
  const p = byId.get(id);
  if (!p) { errs.push(`id desconocido en MAP: "${id}"`); continue; }
  p.images = photos.map(ext);
  assignedPieces++; assignedPhotos += photos.length;
}
if (errs.length) { console.error("✗ Errores:\n  - " + errs.join("\n  - ")); process.exit(1); }

// 3) Reescribir SEED (compacto, igual que el original) + bumpear KEY
html = html.replace(/const SEED = \[[\s\S]*?\];/, "const SEED = " + JSON.stringify(seed) + ";");
html = html.replace(/const KEY = "rb-builder-v1";/, 'const KEY = "rb-builder-v2";');

writeFileSync(FILE, html, "utf-8");
console.log(`✓ Inyectadas ${assignedPhotos} fotos en ${assignedPieces} piezas. KEY → rb-builder-v2.`);
console.log("  Abrí content/builder.html (si tenías estado viejo, ya no se carga).");
