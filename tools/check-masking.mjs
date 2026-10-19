// Fails if a word that could identify the client behind an example app appears in the app pages.
// The blocked words are stored only as SHA-256 hashes, so this file never names the client (docs/APPS-PRD.md §5).
// Usage: node tools/check-masking.mjs   (exit 1 on a hit)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BLOCKED = new Set([
  "0e1fd29630b7f5177c19b745ce41d9ffcfd444af2a6364929a4c1edce7da0d4f",
  "c1b5e32160f25b26692cc0dfafd4becea9a4b0bbb7d87113ce8233a442774a48",
]);
// The example apps are priced in dollars (Sprout is a US business); another currency would be a leak from the real data.
const PLAIN = ["₹", "rupee", " rs.", "inr "];
const SCAN = ["site/src/apps", "app-starter", "docs/APPS-PRD.md"];
// The saved example app (tools/example-app) is a real brand's study data, so only the client words are checked there.
const WORDS_ONLY = ["site/public/example-app"];

const walk = (p) => {
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) return [];
  return fs.statSync(abs).isDirectory() ? fs.readdirSync(abs).flatMap((f) => walk(path.join(p, f))) : [p];
};
const TEXT = /\.(html?|js|css|json|md|ts|tsx|txt|svg)$/i;
const files = SCAN.flatMap(walk);
const wordsOnly = new Set(WORDS_ONLY.flatMap(walk).filter((f) => TEXT.test(f)));
files.push(...wordsOnly);
const hits = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(ROOT, f), "utf8").toLowerCase();
  for (const w of new Set(text.split(/[^a-z0-9]+/))) {
    if (w && BLOCKED.has(crypto.createHash("sha256").update(w).digest("hex"))) hits.push(`${f}: a blocked word (${w.length} letters)`);
  }
  if (!wordsOnly.has(f)) for (const w of PLAIN) if (text.includes(w)) hits.push(`${f}: "${w.trim()}"`);
}
if (hits.length) { console.error("Masking check failed:\n  " + hits.join("\n  ")); process.exit(1); }
console.log(`Masking check: ${files.length} files clean`);
