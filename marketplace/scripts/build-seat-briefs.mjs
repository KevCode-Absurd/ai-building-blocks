// Deterministic facets and seat notes from saved profiles and exact existing catalogue links.
// No text model calls, synthetic biographies or inferred family labels.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseTeamFacets, generalCoordinatorMarkdown, BRAND_BRAIN_GATE } from "../src/modules/directory/team.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/modules/directory/data");
const readJson = (file, fallback) => existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback;
const approachPath = path.join(ROOT, "../site/public/data/approach-index.json");
const approaches = readJson(approachPath, { jobs: {} });
const families = Object.values(approaches.jobs ?? {}).flatMap(job => job.families ?? []);
const roles = readJson(path.join(DATA, "roles.json"), []);
const libraryRoleData = readJson(path.join(ROOT, "../site/public/data/roles-index.json"), { roles: [] });
const libraryRoles = Array.isArray(libraryRoleData) ? libraryRoleData : (libraryRoleData.roles ?? []);
const everyone = [];
const changed = [];
const write = (file, content) => {
  const before = existsSync(file) ? readFileSync(file, "utf8") : "";
  const next = content.replace(/\r?\n/g, before.includes("\r\n") ? "\r\n" : "\n");
  if (before !== next) { writeFileSync(file, next); changed.push(path.relative(ROOT, file).replaceAll("\\", "/")); }
};

for (const file of readdirSync(DATA).filter(f => /^personas-.*\.json$/.test(f)).sort()) {
  const personas = readJson(path.join(DATA, file), []);
  for (const persona of personas) {
    const facets = baseTeamFacets(persona);
    const linkedItems = new Set([
      ...persona.profile.source_roles,
      ...readJson(path.join(ROOT, "packs/roles", persona.role ?? "_missing", "library.json"), []).map(row => row.slug),
    ]);
    const linkedRoleIds = libraryRoles.filter(role => facets.roles.includes(role.id) || linkedItems.has(role.lead)).map(role => role.id);
    facets.roles = [...new Set([...facets.roles, ...linkedRoleIds])].sort().slice(0, 24);
    const linkedFamilies = families.filter(family => [...(family.items ?? []), ...(family.pickers ?? []), ...(family.checks ?? [])].some(slug => linkedItems.has(slug)));
    facets.families = [...new Set(linkedFamilies.map(f => f.id))].sort();
    facets.lenses = [...new Set([...facets.lenses, ...linkedFamilies.flatMap(f => f.lenses ?? [])])].sort();
    persona.team = facets;
    everyone.push({ id: persona.id, name: persona.name, title: persona.title, ...facets });
  }
  write(path.join(DATA, file), `${JSON.stringify(personas, null, 2)}\n`);
}

for (const role of roles) {
  const roleDir = path.join(ROOT, "packs/roles", role.id);
  if (!existsSync(roleDir)) continue;
  const members = everyone.filter(p => p.roles.includes(role.id));
  const names = members.map(p => `${p.name} (${p.id})`);
  write(path.join(roleDir, "TEAM.md"), [
    `# ${role.name} in a team`, "", role.summary, "",
    "This role is a discovery group, not a fixed place in a company hierarchy. The general coordinator assigns a task lead and working groups for each job.", "",
    BRAND_BRAIN_GATE, "",
    "## How I critique", "", "Quote the proposal and name its strongest point. Connect concerns to accepted criteria and source/check evidence, or report no material flaw. Request only a bounded repair on the current artifact/hash; full review may retain work unchanged without overriding explicit exploration, variants, redesign/rewrite or supported craft improvements. Do not rank your own proposal.", "",
    "## What I defend", "", role.summary, "",
    "## What I will concede", "", "Change the recommendation when stronger sources, failed checks or the user's limits support another path. Preserve an available CURRENT baseline or working draft at its exact hash, keep unaffected parts, rerun affected checks and compare before adopting changes. Keep useful dissent; limits are maxima, not work quotas.", "",
    "## What I never do", "", "Grade work I made, hide failed checks, invent evidence, or send, publish or spend beyond the user's granted access.", "",
    "## Named agents for this role", "", ...names.map(name => `- ${name}`), "",
    "Each agent's own TEAM.md is generated from its saved soul and playbook in its downloadable pack.", "",
  ].join("\n"));
}

const org = {
  schema: "ai-blocks-org-chart/1",
  provenance: "deterministic-existing-profiles-and-exact-library-links",
  coordinator: { role_id: "general-coordinator", persona_id: null, assignment: "per-job", pack: "packs/coordinator/TEAM.md" },
  staffing: "The coordinator scopes the job and rubric, assigns a task-specific lead and flexible working groups, then checks the final work after the lead's review.",
  departments: [...new Set(roles.map(r => r.department))].sort().map(department => ({
    id: department, name: department.replaceAll("-", " "),
    roles: roles.filter(r => r.department === department).map(role => ({
      id: role.id, name: role.name,
      persona_ids: everyone.filter(p => p.roles.includes(role.id)).map(p => p.id),
      seat_suitability: [...new Set(everyone.filter(p => p.roles.includes(role.id)).flatMap(p => p.seat_suitability))].sort(),
    })),
  })),
  personas: everyone.sort((a, b) => a.id.localeCompare(b.id)),
  coverage: { personas: everyone.length, linked_families: [...new Set(everyone.flatMap(p => p.families))].length, approach_index_available: existsSync(approachPath) },
};
const orgContent = `${JSON.stringify(org, null, 2)}\n`;
write(path.join(DATA, "team-org-chart.json"), orgContent);
write(path.join(ROOT, "../site/public/data/team-org-chart.json"), orgContent);
write(path.join(ROOT, "packs/coordinator/TEAM.md"), generalCoordinatorMarkdown());
console.log(JSON.stringify({ model_calls: 0, personas: everyone.length, roles: roles.length, files_changed: changed.length, approach_index_available: existsSync(approachPath) }));
