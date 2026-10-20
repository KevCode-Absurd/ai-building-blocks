// Moves imported skills onto the jobs added on 2026-10-21 (help-customers, hire-people, check-contracts, document-work, track-numbers, run-your-store, get-found-in-search, write-emails, set-prices),
// by clear rules on the skill's folder and its current job. Comments and layout in the map files are kept.
// Run from the repo root: node tools/retask-import-maps.mjs [--dry]
import fs from "node:fs";
import path from "node:path";
import YAML from "../site/node_modules/yaml/dist/index.js";

const DRY = process.argv.includes("--dry");
const DIR = path.join(import.meta.dirname, "import-map");
const files = [path.join(import.meta.dirname, "import-map.yaml"), ...fs.readdirSync(DIR).filter((f) => f.endsWith(".yaml")).map((f) => path.join(DIR, f))];
const STORE_REPOS = /^(40rty-ai\/shopify-admin-skills|nexscope-ai\/eCommerce-Skills)$/;
const FROM_STORE = new Set(["organise-work", "money-and-investing", "understand-customers", "plan-strategy", "build-software"]);

function newTask(key, e) {
  const [repo, folder] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1).toLowerCase()];
  const leaf = folder.split("/").pop();
  const words = `${leaf} ${e.name ?? ""}`.toLowerCase();
  // Jobs added later on 2026-10-21: help your customers, hire people, contracts and rules, numbers, how work gets done.
  const kwp = repo === "anthropics/knowledge-work-plugins" ? folder.split("/")[0] : "";
  const CODE = new Set(["build-software", "build-websites", "test-and-fix-code", "ship-and-host", "secure-code", "check-ads"]);
  if (kwp === "customer-support" || repo === "nbashaw/claude-cs" || /ticket|help-?desk|support-repl|customer-support|refund-and|review-reputation|kb-article|escalation/.test(words) && !CODE.has(e.task) && !/linear|to-tickets/.test(leaf)) return "help-customers";
  if (/^(tuanductran\/hr-skills|carlopezzuto\/recruiting)$/.test(repo) || kwp === "human-resources" || /hiring|recruit|interview|onboard|job-post|offboard|payroll-prep|succession|performance-review|pay-band|candidate/.test(words) && ["lead-people", "organise-work", "money-and-investing", "write-and-tell-stories"].includes(e.task)) return "hire-people";
  if (kwp === "legal" || /contract|\bnda\b|nda-|compliance|gdpr|privacy-polic|terms-of|legal|ai-act|soc-?2|hipaa/.test(words) && !CODE.has(e.task)) return "check-contracts";
  if (/runbook|process-doc|\bsop\b|sop-|standard-operating|change-request|status-report/.test(words) && ["organise-work", "work-with-files"].includes(e.task)) return "document-work";
  if (kwp === "finance" || kwp === "data" || /dashboard|\bkpi|analytics|bookkeep|reconcil|ledger|journal|month-end|cash-flow|ap-processor|invoice|business-pulse|growth-pulse|report-builder|sql-query|statistic|explore-data|validate-data|data-anal/.test(words) && ["money-and-investing", "work-with-files", "think-and-decide", "organise-work", "build-software"].includes(e.task) && !/valuation|dcf|lbo|stock|option|bond|portfolio|matlab|snowflake|postgres|nosql/.test(`${words} ${repo}`)) return "track-numbers";
  if (/\b(seo|aeo|geo)\b|seo-|-seo|schema-markup|sitemap|keyword|search-console|serp|llms-txt|ai-search|programmatic/.test(words) && !/site search|search basics/.test(words)) return "get-found-in-search";
  if (!repo.startsWith("matlab/") && /(^|-)(pric|repric)|price/.test(leaf) || /\bpric(e|ing)\b/.test(e.name?.toLowerCase() ?? "")) return "set-prices";
  if (/(^|-)(email|newsletter|sms|cold-email|drip)/.test(leaf) && ["write-ad-copy", "make-offer", "grow-social", "sell-and-negotiate", "organise-work"].includes(e.task) && !/inbox|triag|rules/.test(words)) return "write-emails";
  if (STORE_REPOS.test(repo) && FROM_STORE.has(e.task)) return "run-your-store";
  return null;
}

let moved = 0;
const counts = {};
for (const f of files) {
  const doc = YAML.parseDocument(fs.readFileSync(f, "utf8"));
  let changed = false;
  for (const item of doc.contents?.items ?? []) {
    const key = String(item.key?.value ?? item.key);
    const e = item.value?.toJSON?.() ?? {};
    if (e.skip || !e.task) continue;
    const t = newTask(key, e);
    if (!t || t === e.task) continue;
    item.value.set("task", t);
    counts[t] = (counts[t] ?? 0) + 1;
    moved++;
    changed = true;
    if (DRY) console.log(`${key}: ${e.task} -> ${t} (${e.name})`);
  }
  if (changed && !DRY) fs.writeFileSync(f, doc.toString({ lineWidth: 0 }));
}
console.log(`${moved} moved${DRY ? " (dry run)" : ""}:`, counts);
