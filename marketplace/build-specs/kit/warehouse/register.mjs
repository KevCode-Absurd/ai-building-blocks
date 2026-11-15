// register.mjs: builds the creative register from the job board, so results join back to what was made.
// For each creative job it reads <folder>/tags.json (written at final review) and writes one line to
// warehouse/data/creative_register.jsonl. Run it after any sign-off, and in the daily sync.
//   node warehouse/register.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = process.env.AGENT_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
export function build() {
  const dir = path.join(ROOT, "board"), out = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(x => x.endsWith(".json")) : []) {
    const job = read(path.join(dir, f), null);
    if (!job || job.parent) continue; // launch and results jobs share the creative job's folder and id lineage
    const tags = read(path.join(ROOT, job.folder, "tags.json"), null);
    if (!tags) continue;
    out.push({ job_id: job.id, process: job.process, title: job.title, ...tags, signed_off: Object.keys(job.signoffs ?? {}) });
  }
  const file = path.join(ROOT, "warehouse", "data", "creative_register.jsonl");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out.map(r => JSON.stringify(r)).join("\n") + (out.length ? "\n" : ""));
  return out;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(`${build().length} creatives in the register.`);
