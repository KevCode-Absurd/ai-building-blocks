// Writes public/data/item-agents/<first character>.json: for each library item, up to four named agents
// (agents.useaiblocks.com) whose job role lists the item in its toolbox. Item pages show them as "Agents who use this".
// Reads marketplace/packs/roles/*/toolbox.json and the agents app's persona files (scripts/lib/item-agents.mjs).
// With no toolbox files it writes empty files, and the pages show nothing. Run from site/, after build-index.mjs.
import fs from "node:fs";
import path from "node:path";
import { itemAgents, writeItemAgents } from "./lib/item-agents.mjs";

const MARKETPLACE = path.resolve(process.env.MARKETPLACE_ROOT || "../marketplace");
const blocksFile = "public/data/blocks.json";
// Only items that have a page get links. Without the catalogue (a bare checkout) every listed slug is kept.
const known = fs.existsSync(blocksFile) ? new Set(JSON.parse(fs.readFileSync(blocksFile, "utf8")).blocks.filter((b) => b.headline !== "").map((b) => b.slug)) : null;
const { links, problems, roles } = itemAgents({ rolesDir: path.join(MARKETPLACE, "packs/roles"), personasDir: path.join(MARKETPLACE, "src/modules/directory/data"), known });
writeItemAgents(links, "public/data/item-agents");
console.log(`Item agents: ${links.size} items link to agents, from ${roles} role toolboxes.${problems.length ? `\n  ${problems.join("\n  ")}` : ""}`);
if (problems.length) process.exitCode = 1;
