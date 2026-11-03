// Specialists on the prerendered pages: "Specialists who do this" on item pages and job hubs. Item pages read the
// same files as the app (public/data/role-links/<first character>.json, written by build-roles.mjs), so the page
// reads the same before and after the app opens.
import fs from "node:fs";
import path from "node:path";
import { roleHeading } from "../../src/roles/role-copy.mjs";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const SPECIALISTS_TITLE = "Specialists who do this";
export const SPECIALISTS_NOTE = "Each one uses this as one of its methods for a bigger job. Hire one for free and give it the job in your own AI.";

/** slug -> [[roleId, roleName], ...] from every role-links file. */
export function loadRoleLinks(dataDir = "public/data") {
  const dir = path.join(dataDir, "role-links"), out = new Map();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (data.schema !== "ai-blocks-role-links/1") throw Error(`Unexpected role links file ${f}`);
    for (const [slug, rows] of Object.entries(data.items)) out.set(slug, rows);
  }
  return out;
}

const rowsHtml = (rows) => `<ul>${rows.map(([id, name]) => `<li><a href="/roles/${esc(id)}">${esc(roleHeading(name))}</a></li>`).join("")}</ul>`;

/** The block on a skill, prompt, agent or workflow page; empty when no specialist uses the item. */
export function specialistsSection(rows) {
  if (!rows?.length) return "";
  return `<section id="specialists" class="bp-next specialists-block"><h2>${SPECIALISTS_TITLE}</h2><p>${SPECIALISTS_NOTE}</p>${rowsHtml(rows)}</section>`;
}

/** The roles for one job hub: featured first, then by name, up to `max`. Rows of the roles index. */
export function hubSpecialists(index, task, max = 6) {
  const rows = index.roles.filter((r) => r.family === task).sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  if (!rows.length) return "";
  return `<h2 class="hub-h2">${SPECIALISTS_TITLE}</h2><p>Hire a specialist for the whole job. Each one bundles several of these skills and runs in your own AI, for free.</p>${rowsHtml(rows.slice(0, max).map((r) => [r.id, r.name]))}${rows.length > max ? `<p><a href="/roles">See all ${index.roles.length.toLocaleString("en-US")} specialists</a></p>` : ""}`;
}
