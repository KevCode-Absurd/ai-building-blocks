// Builds the Claude Code plugin marketplace from the built agent packs. Runs after build-packs.mjs (npm run build).
//
//   node scripts/build-claude-plugins.mjs [--packs=dist/packs] [--origin=https://agents.useaiblocks.com]
//
// One plugin per role kit, so people install only the teams they want (every installed agent's description costs
// context in every Claude Code session). Each plugin is a zip with:
//   .claude-plugin/plugin.json
//   agents/<agent-id>.md     the agent Claude Code lists under "Custom agents" as <role-id>:<agent-id>; its body is the
//                            pack's AGENTS.md, with the pack folder named, so nothing else loads until it runs
//   packs/<agent-id>/...     the agent's whole pack, exactly as in "Download this agent"
//   README.md, LICENSE.md
//
// Output, served as static files next to the packs (wrangler.jsonc serves /packs/* without the Worker):
//   dist/packs/claude/marketplace.json   `/plugin marketplace add https://agents.useaiblocks.com/packs/claude/marketplace.json`
//   dist/packs/claude/<role-id>.zip      each entry's "archive" source, pinned with sha256
//
// The zips are byte-identical while their packs are unchanged (writeZip is deterministic and the date comes from the
// packs), so a deploy uploads only plugins that changed, and the entry version (newest pack date plus a hash of the
// zip) moves only when the plugin's content does. That version is what tells Claude Code an update is out.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { housePersonas } from "../src/modules/directory/index.ts";
import { getRole } from "../src/modules/directory/roles.ts";
import { readZip, writeZip } from "../src/modules/packs/zip.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(process.argv.slice(2).map(a => { const m = /^--([a-z-]+)(?:=(.*))?$/.exec(a); return m ? [m[1], m[2] ?? "true"] : [a, "true"]; }));
const PACKS = path.resolve(ROOT, args.packs ?? "dist/packs");
const ORIGIN = (args.origin ?? "https://agents.useaiblocks.com").replace(/\/+$/, "");
const OUT = path.join(PACKS, "claude");
const MARKETPLACE = "ai-blocks";
const LICENSE_ID = "LicenseRef-AI-Blocks-Pack-1.0";
// Claude Code's own limits on an archive plugin (host-marketplace docs): 256 MiB download, 1 GiB unzipped,
// 100,000 entries. Our zip writer has no zip64, so 65,534 entries is the real ceiling. Stay far inside both.
const MAX_ZIP_BYTES = 24 * 1024 * 1024; // also under the Workers static asset limit (25 MiB per file)
const MAX_ENTRIES = 60000;
const READ_LIMITS = { maxEntries: 20000, maxTotalBytes: 512 * 1024 * 1024 };

function fatal(message) {
  console.error(`build-claude-plugins: ${message}`);
  process.exit(1);
}

const indexFile = path.join(PACKS, "index.json");
if (!existsSync(indexFile)) fatal(`${path.relative(ROOT, indexFile)} is missing: run scripts/build-packs.mjs first`);
const index = JSON.parse(readFileSync(indexFile, "utf8"));
const personas = new Map(housePersonas().map(p => [p.id, p]));

/** YAML double-quoted scalar: JSON string syntax is valid YAML. Keeps ": " and "#" in descriptions safe. */
const yamlString = s => JSON.stringify(s);
const oneLine = s => String(s ?? "").replace(/\s+/g, " ").trim();
const sentence = s => { const t = oneLine(s); return !t || /[.!?]$/.test(t) ? t : `${t}.`; };

/** What Claude reads to decide when to hand work to this agent. Short: it sits in context in every session. */
function agentDescription(persona, pack) {
  const outcomes = (persona?.profile?.outcomes ?? []).map(o => oneLine(o.title)).filter(Boolean).slice(0, 4);
  // "E-commerce SEO specialist" reads "e-commerce SEO specialist" mid-sentence; "SEO strategist" stays as it is.
  const title = /^[A-Z][a-z]/.test(pack.title) ? pack.title[0].toLowerCase() + pack.title.slice(1) : pack.title;
  const parts = [`${pack.name}, ${title} from AI Blocks. ${sentence(persona?.tagline)}`];
  if (outcomes.length) parts.push(`Use for: ${outcomes.join("; ")}.`);
  return oneLine(parts.join(" "));
}

function agentFile(pack, persona, agentsMd) {
  const dir = `\${CLAUDE_PLUGIN_ROOT}/packs/${pack.id}`;
  const work = `ai-blocks/${pack.id}`;
  return [
    "---",
    `name: ${pack.id}`,
    `description: ${yamlString(agentDescription(persona, pack))}`,
    "---",
    "",
    "## Where your files are",
    "",
    `Your pack is the folder \`${dir}/\`. Every file this brief names (METHOD.md, toolbox.md, knowledge.md, skills/, prompts/, workflows/, tools/ and the rest) is in that folder: read it from there. The pack is read-only, and a plugin update replaces it.`,
    "",
    `Do the work in the user's project. Keep your working files, including everything the pack says to put in \`context/\`, in \`${work}/\` there (create it), and run the pack's scripts from that folder, for example \`node "${dir}/tools/prepare-job.mjs" context/brief.md\`. The scripts find the pack themselves and read and write \`context/\` where you run them.`,
    "",
    "You run as a Claude Code sub-agent: the person you work for sees only your final message, so put your questions, assumptions and the finished work there.",
    "",
    agentsMd.replace(/^﻿/, "").trim(),
    "",
  ].join("\n");
}

function pluginReadme(role, agents, version) {
  return [
    `# ${role.name} (AI Blocks)`,
    "",
    sentence(role.summary),
    "",
    "## Agents",
    "",
    ...agents.map(({ pack, persona }) => `- **${pack.name}, ${pack.title}** (\`${role.id}:${pack.id}\`): ${sentence(persona?.tagline)} Profile: ${ORIGIN}/agents/${pack.id}`),
    "",
    "## Use",
    "",
    `Ask Claude Code for the work, and it hands the job to the agent that fits. Or name one: "use ${role.id}:${agents[0].pack.id} to ...". Each agent's whole pack is in \`packs/<agent-id>/\`.`,
    "",
    `Version ${version}. Free to use and change, including commercially in your own work, but not to sell or resell: see LICENSE.md.`,
    "",
  ].join("\n");
}

const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

// ---------- Build ----------

const started = Date.now();
const byRole = new Map();
for (const pack of index.packs ?? []) {
  if (!pack.role || !pack.agent_zip?.url) continue;
  if (!byRole.has(pack.role)) byRole.set(pack.role, []);
  byRole.get(pack.role).push(pack);
}
if (!byRole.size) fatal("the pack index lists no agents with a role");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const entries = [];
let totalBytes = 0;
for (const roleId of [...byRole.keys()].sort()) {
  const role = getRole(roleId);
  if (!role) fatal(`role ${roleId} is in the pack index but not in roles.json`);
  const agents = byRole.get(roleId)
    .map(pack => ({ pack, persona: personas.get(pack.id) }))
    .sort((a, b) => (a.persona?.sort ?? 1e9) - (b.persona?.sort ?? 1e9) || a.pack.id.localeCompare(b.pack.id));

  const files = [];
  let license = null;
  for (const { pack, persona } of agents) {
    const zipPath = path.join(PACKS, `${pack.id}.zip`);
    if (!existsSync(zipPath)) fatal(`${pack.id}.zip is missing from ${path.relative(ROOT, PACKS)}`);
    const unpacked = await readZip(new Uint8Array(readFileSync(zipPath)), READ_LIMITS);
    let agentsMd = null;
    for (const e of unpacked) {
      const rel = e.path.startsWith(`${pack.id}/`) ? e.path.slice(pack.id.length + 1) : e.path;
      files.push({ path: `packs/${pack.id}/${rel}`, data: e.data });
      if (rel === "AGENTS.md") agentsMd = new TextDecoder().decode(e.data);
      if (rel === "LICENSE.md" && !license) license = e.data;
    }
    if (!agentsMd) fatal(`${pack.id}.zip has no AGENTS.md`);
    files.push({ path: `agents/${pack.id}.md`, data: agentFile(pack, persona, agentsMd) });
  }

  const updated = agents.map(a => a.pack.updated).filter(Boolean).sort().at(-1);
  const manifest = {
    name: roleId,
    displayName: `${role.name} (AI Blocks)`,
    description: oneLine(`${sentence(role.summary)} Agents: ${agents.map(a => `${a.pack.name} (${a.pack.title})`).join(", ")}.`),
    author: { name: "AI Blocks", url: ORIGIN },
    homepage: `${ORIGIN}/agents?${new URLSearchParams({ role: roleId })}`,
    license: LICENSE_ID,
    keywords: [...new Set([roleId, ...(role.aliases ?? [])].map(k => oneLine(k).toLowerCase()).filter(Boolean))].slice(0, 12),
  };
  files.push({ path: ".claude-plugin/plugin.json", data: `${JSON.stringify(manifest, null, 2)}\n` });
  if (license) files.push({ path: "LICENSE.md", data: license });

  // The version needs the zip's hash, and the README names the version, so hash the zip without the README first.
  const body = await writeZip(files, { date: updated });
  // Valid semver (no leading zeros): 2026-11-04 gives 2026.11.4-<hash>.
  const version = `${updated.split("-").map(Number).join(".")}-${sha256(body).slice(0, 8)}`;
  files.push({ path: "README.md", data: pluginReadme(role, agents, version) });
  if (files.length > MAX_ENTRIES) fatal(`${roleId}: ${files.length} files, over the ${MAX_ENTRIES} limit for one plugin`);
  const zip = await writeZip(files, { date: updated });
  if (zip.byteLength > MAX_ZIP_BYTES) fatal(`${roleId}.zip is ${(zip.byteLength / 1048576).toFixed(1)} MiB, over the ${MAX_ZIP_BYTES / 1048576} MiB limit`);
  writeFileSync(path.join(OUT, `${roleId}.zip`), zip);
  totalBytes += zip.byteLength;

  entries.push({
    name: roleId,
    displayName: manifest.displayName,
    description: manifest.description,
    version,
    category: role.department,
    tags: manifest.keywords,
    author: manifest.author,
    homepage: manifest.homepage,
    license: LICENSE_ID,
    source: { source: "archive", url: `${ORIGIN}/packs/claude/${roleId}.zip`, sha256: sha256(zip) },
  });
}

const marketplace = {
  $schema: "https://json.schemastore.org/claude-code-marketplace.json",
  name: MARKETPLACE,
  description: "AI Blocks agents for Claude Code: one plugin per role, each with named expert agents and their full packs. Free to use; not for resale.",
  owner: { name: "AI Blocks", url: ORIGIN },
  plugins: entries,
};
const marketplaceText = `${JSON.stringify(marketplace, null, 2)}\n`;
if (Buffer.byteLength(marketplaceText) > 4 * 1024 * 1024) fatal("marketplace.json is over 4 MiB (Claude Code reads at most 5 MiB)");
writeFileSync(path.join(OUT, "marketplace.json"), marketplaceText);

const agentCount = entries.reduce((n, e) => n + byRole.get(e.name).length, 0);
console.log(`build-claude-plugins: ${entries.length} plugins, ${agentCount} agents, ${(totalBytes / 1048576).toFixed(1)} MiB of zips in ${path.relative(ROOT, OUT)}; ${((Date.now() - started) / 1000).toFixed(1)}s`);
