// Runs tools/import-skills.mjs for every repo in tools/import-sources.yaml, one after another (so NOTICE.md is written by one run at a time).
// Run from the repo root: node tools/import-all.mjs [--write] [--clones <dir>] [--only-repo owner/name]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import YAML from "../site/node_modules/yaml/dist/index.js";

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const CLONES = arg("clones", "C:/Users/kevin/ab-sources");
const ONLY = arg("only-repo");
const sources = YAML.parse(fs.readFileSync(path.join(import.meta.dirname, "import-sources.yaml"), "utf8"));
for (const s of sources) {
  if (ONLY && s.repo !== ONLY) continue;
  const from = path.join(CLONES, s.clone);
  if (!fs.existsSync(from)) { console.log(`${s.repo}: no clone at ${from}, skipped`); continue; }
  const args = [path.join(import.meta.dirname, "import-skills.mjs"), "--from", from, "--by", s.by, "--repo", s.repo];
  for (const k of ["path", "exclude", "only"]) if (s[k]) args.push(`--${k}`, String(s[k]));
  if (process.argv.includes("--write")) args.push("--write");
  const out = execFileSync(process.execPath, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  console.log(`${s.repo}: ${out.trim().split("\n").pop()}`);
  for (const l of out.split("\n")) if (l.startsWith("not written")) console.log(`  ${l}`);
}
