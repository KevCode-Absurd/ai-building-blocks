// Writes src/modules/directory/data/mega-traction.json: the channel team a traction mega agent's profile shows.
// Source: packs/mega/traction/kit.json (channels: id, name, book_chapter, in order) and, for each channel,
// packs/mega/traction/agents/<id>.md, whose frontmatter `description:` becomes the one-line job (read with the pack
// builder's agentFrontmatter, so it matches the team descriptions in files.json).
// Run by `npm run build` before vite build. While kit.json does not exist yet, it leaves the file as it is (the 19
// channels from the spec). A broken kit stops the build with the reason.
//   node scripts/mega-team.mjs           write the file when the kit changed it
//   node scripts/mega-team.mjs --check   exit 1 if the file is out of date
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// The same frontmatter reader the pack builder uses, so the site's job lines match files.json's team descriptions.
import { agentFrontmatter } from "../src/modules/packs/mega.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const KIT = path.join(ROOT, "packs", "mega", "traction");
const OUT = path.join(ROOT, "src", "modules", "directory", "data", "mega-traction.json");
const check = process.argv.includes("--check");

function fatal(message) {
  console.error(`mega-team: ${message}`);
  process.exit(1);
}

const kitFile = path.join(KIT, "kit.json");
if (!existsSync(kitFile)) {
  console.log("mega-team: packs/mega/traction/kit.json is not there yet; keeping the channel list from the spec.");
  process.exit(0);
}
let kit;
try { kit = JSON.parse(readFileSync(kitFile, "utf8")); } catch (e) { fatal(`packs/mega/traction/kit.json is not valid JSON: ${e.message}`); }
if (!Array.isArray(kit.channels) || !kit.channels.length) fatal("packs/mega/traction/kit.json has no channels list");
const seen = new Set();
const channels = kit.channels.map((c, n) => {
  if (!c || typeof c.id !== "string" || !/^[a-z][a-z0-9-]{1,59}$/.test(c.id)) fatal(`channel ${n + 1} in kit.json needs a kebab-case id`);
  if (typeof c.name !== "string" || !c.name.trim()) fatal(`channel ${c.id} in kit.json needs a name`);
  if (seen.has(c.id)) fatal(`channel ${c.id} is listed twice in kit.json`);
  seen.add(c.id);
  const agentFile = path.join(KIT, "agents", `${c.id}.md`);
  const job = existsSync(agentFile) ? agentFrontmatter(readFileSync(agentFile, "utf8")).description?.replace(/\s+/g, " ").trim() || null : null;
  return { id: c.id, name: c.name.trim(), book_chapter: typeof c.book_chapter === "string" ? c.book_chapter : null, job: job ? job.slice(0, 300) : null };
});

const next = `${JSON.stringify({ kit: "traction", source: "packs/mega/traction", channels }, null, 2)}\n`;
const current = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
if (current === next) { console.log(`mega-team: ${channels.length} channels, up to date.`); process.exit(0); }
if (check) fatal("src/modules/directory/data/mega-traction.json is out of date; run node scripts/mega-team.mjs");
writeFileSync(OUT, next);
console.log(`mega-team: wrote ${channels.length} channels (${channels.filter(c => c.job).length} with a job line).`);
