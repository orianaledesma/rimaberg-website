#!/usr/bin/env node
/**
 * apply-rima-descriptions.mjs
 *
 * Patch content/products.csv with the LT/EN names + descriptions Rima sent
 * back via the product-review worksheet. The payload below is the JSON the
 * worksheet exported (one "<id>.<field>" key per cell); we group by id, then
 * rewrite the matching CSV row.
 *
 * Material/stones come from Rima as a single value — we copy it into both
 * the LT and EN columns for now (they read the same in Lithuanian inventory
 * shorthand). She can split them later in the worksheet if she wants.
 *
 * Run with:
 *   node scripts/apply-rima-descriptions.mjs
 * Then regenerate the TS catalogue:
 *   npm run import:products
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "..", "content", "products.csv");

// Rima's payload (2026-05-29 worksheet export).
const PAYLOAD = {
  "unassigned1": {
    name_lt: "Spalvos naktyje",
    name_en: "Colors at night",
    description_lt:
      "Dienos mintys virsta spalvotais sapnais, šį kartą paslėptais ametisto gilume.",
    description_en:
      "Daytime thoughts turn into colorful dreams, this time hidden in the depth of amethyst.",
  },
  "earring-7": {
    name_lt: "Pavasario vaiskumas",
    name_en: "The clearness of spring",
    description_lt: "Organiška forma ir peridoto gaivus vaiskumas.",
    description_en: "Organic shape and the fresh brightness of peridot.",
    material: "Silver 925",
    stones: "Peridot",
  },
  "ring-1": {
    name_lt: "Paslėptos svajonės",
    name_en: "Hidden dreams",
    description_lt:
      "Besikeičianti, įvairialypė asmenybė, įamžinta keičiančiame spalvą akmenyje.",
    description_en:
      "A changing, multifaceted personality, immortalized in a color-changing stone.",
    material: "Silver 925, gold",
    stones: "Ametrine",
  },
  "ring-2": {
    name_lt: "Pumpurėliai",
    name_en: "Buds",
    description_lt:
      "Pabirę ir chaotiški, tarsi pumpurėliai apkibę iš po žiemos bundantį medį.",
    description_en:
      "Scattered and chaotic, like little buds clinging to a tree awakening from winter.",
    material: "Silver 925, gold",
    stones: "Iolite",
  },
  "ring-3": {
    name_lt: "Spalvų vainikėlis",
    name_en: "Wreath of colors",
    description_lt: "Žaismingai pabirę akmenėliai.",
    description_en: "Playfully scattered pebbles.",
    material: "Silver 925",
    stones: "Topaz, iolite or tourmaline",
  },
  "ring-5": {
    name_lt: "Spalvų vainikėlis",
    name_en: "Wreath of colors",
    description_lt: "Žaismingai pabirę akmenėliai.",
    description_en: "Playfully scattered pebbles.",
    material: "Silver 925",
    stones: "Topaz or tourmaline",
  },
  "ring-6": {
    name_lt: "Medžio siela",
    name_en: "The soul of the tree",
    description_lt: "Grubioje medžio tekstūroje pasislėpęs tyrumas.",
    description_en: "Purity hidden in the rough texture of wood.",
    material: "Silver 925, gold",
    stones: "Ametrine",
  },
  "ring-7": {
    name_lt: "Spalvotos pasakos",
    name_en: "Colorful fairy tales",
    description_lt:
      "Chaotiškai pabirę opalo akmenys, spalvoti ir paslaptingi kaip užmiršta pasaka.",
    description_en:
      "Chaotically scattered opal stones, colorful and mysterious like a forgotten fairy tale.",
    material: "Silver 925, gold",
    stones: "Opal",
  },
  "earring-2": {
    name_lt: "Naktinė žvaigždė",
    name_en: "Night star",
    description_lt: "Šilkine naktimi apvilkta svajonė...",
    description_en: "A dream dressed in a silky night...",
    material: "Silver 925, gold",
    stones: "Amethyst",
  },
  "earring-3": {
    name_lt: "Spalvos",
    name_en: "Colors",
    description_lt: "Įvairūs, žaismingi ir pilni džiaugsmo.",
    description_en: "Various, playful, and full of joy.",
    material: "Silver 925, gold",
    stones: "Onyx, labradorite",
  },
  "earring-4": {
    name_lt: "Įvairiaspalvės gėlės",
    name_en: "Multicolored flowers",
    description_lt:
      "Subtili ir neįpareigojanti įvairiaspalvių gėlių kompozicija.",
    description_en: "A subtle and unassuming composition of colorful flowers.",
    material: "Silver 925",
    stones: "Rhodolite, topaz or other",
  },
  "ring-8": {
    name_lt: "Spalvos ir tekstūra",
    name_en: "Colors and texture",
    description_lt: "Spalvos ir tekstūrų sankirta.",
    description_en: "The intersection of colors and textures.",
    material: "Silver 925, gold",
    stones: "Garnet",
  },
  "ring-9": {
    name_lt: "Pasirinkimai",
    name_en: "Choices",
    description_lt: "Nedidelis, spalvotas akcentas.",
    description_en: "A small, colorful accent.",
    material: "Silver 925, gold",
    stones: "Various",
  },
  "pendants-1": {
    name_lt: "Šeima",
    name_en: "Family",
    description_lt: "Šeima - tai meilės ryšys.",
    description_en: "Family is a bond of love.",
    material: "Silver, gold",
    stones: "Various",
  },
  "ring-10": {
    name_lt: "Pasirinkimas būti",
    name_en: "The choice to be",
    description_lt: "Pasirinkimas būti čia ir dabar...",
    description_en: "The choice to be here and now.",
    material: "Silver 925, gold",
    stones: "Garnet or other",
  },
  "ring-11": {
    name_lt: "Pabirę burbulai",
    name_en: "Scattered bubbles",
    description_lt:
      "Pabirę, žaismingi burbulai, dovanojantys šypseną kiekvieną dieną.",
    description_en:
      "Scattered, playful bubbles, giving a smile every day.",
    material: "Silver 925, gold",
    // Rima did not send stones for this one.
  },
  "earring-5": {
    name_lt: "Trys pasirinkimai",
    name_en: "Three choices",
    description_lt:
      "Pasirinkimas bendrauti, pasirinkimas būti su savimi, pasirinkimas jausti...",
    description_en:
      "The choice to communicate, the choice to be with oneself, the choice to feel...",
    material: "Silver 925, gold",
    stones: "Iolite",
  },
  "ring-12": {
    name_lt: "Žiežirba vėjyje",
    name_en: "Spark in the wind",
    description_lt:
      "Netikėta mintis, blykstelėjusi idėja, naujai užgimęs jausmas...",
    description_en: "An unexpected thought, a flashed idea, a newly born feeling...",
    material: "Silver 925, gold",
    stones: "Garnet",
  },
};

// ── Minimal CSV parser that respects RFC quoting (double-quote escapes). ────
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  // Trailing field/row (no terminating newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function serializeCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const v = value ?? "";
          if (/[",\n\r]/.test(v)) {
            return '"' + v.replace(/"/g, '""') + '"';
          }
          return v;
        })
        .join(",")
    )
    .join("\n");
}

const raw = fs.readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(raw);
const header = rows[0];
const colOf = Object.fromEntries(header.map((h, i) => [h, i]));

let patched = 0;
const unknown = new Set(Object.keys(PAYLOAD));

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (!row.length || !row[colOf.id]) continue;
  const id = row[colOf.id];
  const patch = PAYLOAD[id];
  if (!patch) continue;
  unknown.delete(id);

  const set = (col, val) => {
    if (val == null) return;
    while (row.length <= colOf[col]) row.push("");
    row[colOf[col]] = val;
  };

  if (patch.name_lt) set("name_lt", patch.name_lt);
  if (patch.name_en) set("name_en", patch.name_en);
  if (patch.description_lt) set("description_lt", patch.description_lt);
  if (patch.description_en) set("description_en", patch.description_en);
  // Material / stones from Rima come as a single value — copy to both
  // language columns so the publishable filter is satisfied immediately.
  if (patch.material) {
    set("material_lt", patch.material);
    set("material_en", patch.material);
  }
  if (patch.stones) {
    set("stones_lt", patch.stones);
    set("stones_en", patch.stones);
  }

  patched++;
}

fs.writeFileSync(CSV_PATH, serializeCsv(rows) + "\n", "utf8");

console.log(`Patched ${patched} rows in ${path.relative(process.cwd(), CSV_PATH)}.`);
if (unknown.size) {
  console.log("\nNot found in CSV (left untouched):");
  for (const id of unknown) console.log("  -", id);
}
console.log("\nNext: run `npm run import:products` to regenerate products.generated.ts.");
