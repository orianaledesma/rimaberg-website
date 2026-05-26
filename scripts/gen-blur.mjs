#!/usr/bin/env node
/**
 * Genera placeholders blur (JPEG diminuto base64) para cada foto de
 * public/products y reescribe src/data/blur.ts. Da el efecto "blur-up" mientras
 * next/image carga la imagen real → mejora la velocidad percibida.
 *
 * Usa `sips` (macOS), sin dependencias. Correr: `npm run gen:blur`
 */
import { readdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(root, "public/products");
const OUT = resolve(root, "src/data/blur.ts");

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const tmp = mkdtempSync(join(tmpdir(), "rb-blur-"));

const entries = [];
for (const f of files) {
  const out = join(tmp, f + ".jpg");
  // 24px max edge, low JPEG quality → a few hundred bytes each.
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "50",
    "-Z", "24", join(SRC, f), "--out", out], { stdio: "ignore" });
  const b64 = readFileSync(out).toString("base64");
  entries.push(`  '/products/${f}': 'data:image/jpeg;base64,${b64}',`);
}
rmSync(tmp, { recursive: true, force: true });

const body = `// AUTO-GENERATED tiny blur placeholders (24px JPEGs) for next/image.
// Regenerate with \`npm run gen:blur\` if the product photos change.
export const BLUR: Record<string, string> = {
${entries.join("\n")}
};

export const blurFor = (src: string): string | undefined => BLUR[src];
`;
writeFileSync(OUT, body, "utf-8");
console.log(`✓ ${entries.length} blur placeholders → src/data/blur.ts`);
