// Checks every block page against docs/PAGE-FORMAT.md and docs/WRITING.md.
// Run from the repo root: node tools/lint-pages.mjs [--json]
import fs from "node:fs";
import path from "node:path";
import YAML from "../site/node_modules/yaml/dist/index.js";

const REQUIRED = ["new_slug", "name", "summary", "job", "headline", "subhead", "explain", "when", "you_give", "you_get", "how_to_use", "how_it_works", "output_shape", "example", "tweaks", "judge", "test", "improve"];
const JOBS = ["write-ad-copy", "make-image-ads", "make-video-ads", "plan-ad-tests", "check-ads", "read-ad-results", "audit-landing-page", "write-landing-page", "product-photos", "understand-customers", "brand-file", "study-competitors", "make-offer", "grow-social", "set-up-ai", "think-with-minds", "test-an-idea", "plan-strategy", "build-product", "build-software", "sell-and-negotiate", "lead-people", "speak-and-persuade", "write-and-tell-stories", "design-work", "think-and-decide", "money-and-investing", "work-with-files", "build-websites", "test-and-fix-code", "ship-and-host", "secure-code", "connect-tools", "make-skills", "make-images", "organise-work", "work-with-audio", "run-your-store", "get-found-in-search", "write-emails", "set-prices", "help-customers", "hire-people", "check-contracts", "track-numbers", "document-work", "research-topics", "teach-and-train", "plan-supply-chain", "find-products", "set-up-store", "speed-up-store", "test-store-changes", "run-google-ads", "launch-and-scale-ads", "keep-customers", "sell-on-amazon", "protect-your-store"];
const BANNED = ["delve", "foster", "leverage", "utilize", "facilitate", "empower", "streamline", "robust", "cutting-edge", "game changer", "game-changer", "unlock", "supercharge", "harness", "elevate", "seamless", "effortless", "transformative", "revolutionize", "paradigm", "synergy", "holistic", "journey", "ecosystem", "best-in-class", "world-class", "next-level", "morrow", "ledgerly", "hale studio"];
const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

const pages = [];
for (const cat of ["general", "ecommerce", "agents"]) for (const slug of fs.existsSync(`catalogue-items/${cat}`) ? fs.readdirSync(`catalogue-items/${cat}`) : []) {
  if (fs.existsSync(`catalogue-items/${cat}/${slug}/item.yaml`)) pages.push({ slug, file: `catalogue-items/${cat}/${slug}/page.yaml` });
}
const WF = "tools/orchestrator-pages";
if (fs.existsSync(WF)) for (const f of fs.readdirSync(WF).filter((f) => f.endsWith(".yaml"))) pages.push({ slug: f.replace(/\.yaml$/, ""), file: `${WF}/${f}` });

const report = [];
for (const { slug, file } of pages) {
  const issues = [];
  if (!fs.existsSync(file)) { report.push({ slug, file, issues: ["no page.yaml"] }); continue; }
  const raw = fs.readFileSync(file, "utf8");
  let p;
  try { p = YAML.parse(raw); } catch (e) { report.push({ slug, file, issues: [`bad YAML: ${e.message.split(String.fromCharCode(10))[0]}`] }); continue; }
  // Skills built from a mind's sources (item.yaml has minds:) have no worked example yet (docs/SOURCE-SKILLS-PRD.md).
  const itemFile = file.endsWith("/page.yaml") ? file.replace(/page\.yaml$/, "item.yaml") : `catalogue-items/orchestrators/${slug}/item.yaml`;
  // Skills rebuilt from sources (with minds or credits) get their example in a later test round.
  const itemText = fs.existsSync(itemFile) ? fs.readFileSync(itemFile, "utf8") : "";
  const fromMinds = /^minds:/m.test(itemText) || /^generated_from:/m.test(itemText) || (/^type: (agent|prompt)/m.test(itemText) && /^example_pending: true/m.test(itemText)) || (/^origin: rebuilt/m.test(itemText) && /^credits:/m.test(itemText) && /^example_pending: true/m.test(itemText));
  for (const f of REQUIRED) if ((f !== "example" || !fromMinds) && (p[f] == null || (Array.isArray(p[f]) && !p[f].length))) issues.push(`missing ${f}`);
  for (const f of ["when", "you_give", "you_get", "how_to_use", "judge", "test", "improve"]) if (Array.isArray(p[f]) && p[f].some((x) => typeof x !== "string")) issues.push(`${f} has an item that is not plain text (quote lines containing ": ")`);
  if (p.job && !JOBS.includes(p.job)) issues.push(`unknown job "${p.job}"`);
  if (p.example && p.example.business !== "sprout") issues.push(`example uses "${p.example.business}", not sprout`);
  // The example is test data now (tools/test-blocks.mjs runs its input); the page shows output_shape instead (docs/MINDS-PRD.md §2).
  if (p.example && !String(p.example.input ?? "").trim()) issues.push("empty example input");
  if (words(p.headline) > 18) issues.push(`headline ${words(p.headline)} words`);
  if (words(p.subhead) > 60) issues.push(`subhead ${words(p.subhead)} words`);
  if (words(p.summary) > 22) issues.push(`summary ${words(p.summary)} words`);
  if (words(p.name) > 10) issues.push(`name ${words(p.name)} words`);
  if (/—/.test(raw)) issues.push("em dash");
  const low = raw.toLowerCase();
  for (const w of BANNED) if (new RegExp(`(^|[^a-z])${w.replace(/[-]/g, "\\-")}([^a-z]|$)`).test(low)) issues.push(`banned word "${w}"`);
  if (issues.length) report.push({ slug, file, issues });
}

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 1));
else {
  for (const r of report) console.log(`${r.slug}: ${r.issues.join("; ")}`);
  console.log(`\n${pages.length} pages, ${pages.length - report.length} clean, ${report.length} with issues`);
}
