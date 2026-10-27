// Index only already-published assets. Never read source libraries, credentials or user data.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';
import YAML from 'yaml';
import { inspectSkillArchive, referenceFixtureExclusions, safePackagePath, verifyLocalReferences } from '../src/lib/workflow-execution.ts';
import { blockSearchIndex, catalogueItems, extraSearchIndex, stepLibrary } from '../src/server/public-catalogue.ts';
import { searchIndexFor } from '../src/lib/goal.ts';
import { taskIdsOf } from '../src/lib/catalogue-taxonomy.mjs';
import { acquireBuildLock } from './lib/build-lock.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const mime = name => /\.(md|txt|py|js|ts|sh|csv|ya?ml)$/i.test(name) ? 'text/plain' : /\.json$/i.test(name) ? 'application/json' : 'application/octet-stream';
/** SKILL.md's YAML frontmatter, unchanged, when it has the name and description the MCP Skills extension needs. An
 *  imported skill keeps its original name, which can differ from our slug; the Worker serves it under that name. */
function frontmatter(text) {
  const match = text.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return undefined;
  try { const value = YAML.parse(match[1]); return value && typeof value === 'object' && !Array.isArray(value) && typeof value.name === 'string' && typeof value.description === 'string' ? value : undefined; }
  catch { return undefined; }
}

export function buildPublicApiManifest(publicDir) {
  const cataloguePath = path.join(publicDir, 'data', 'blocks.json');
  const catalogueBytes = fs.readFileSync(cataloguePath);
  const catalogue = JSON.parse(catalogueBytes);
  const resources = {}, unavailable = [];
  const asset = (file, url) => { const bytes = fs.readFileSync(file); return { path: url, sha256: digest(bytes), bytes: bytes.length }; };
  for (const block of catalogue.blocks) {
    const slug = block.slug;
    if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug)) throw Error('Invalid published slug.');
    try {
      const instruction = asset(path.join(publicDir, 'skills', slug, 'SKILL.md'), `/skills/${slug}/SKILL.md`);
      const instructionBytes = fs.readFileSync(path.join(publicDir, 'skills', slug, 'SKILL.md'));
      const pageFile = path.join(publicDir, 'data', 'pages', `${slug}.json`);
      const page = fs.existsSync(pageFile) ? asset(pageFile, `/data/pages/${slug}.json`) : undefined;
      let archive;
      let packageFiles = { [`${slug}/SKILL.md`]: instructionBytes };
      if (block.hasFiles) {
        const archiveFile = path.join(publicDir, 'skills', `${slug}.zip`);
        const archiveBytes = new Uint8Array(fs.readFileSync(archiveFile));
        inspectSkillArchive(archiveBytes, slug);
        packageFiles = unzipSync(archiveBytes);
        archive = asset(archiveFile, `/skills/${slug}.zip`);
      }
      const files = Object.entries(packageFiles).filter(([name]) => !name.endsWith('/')).sort(([a], [b]) => a.localeCompare(b)).map(([name, bytes]) => {
        if (!safePackagePath(name) || !name.startsWith(`${slug}/`)) throw Error('Unsafe published package path.');
        return { path: name, sha256: digest(bytes), bytes: bytes.length, content_type: mime(name) };
      });
      // Check the raw instructions that the API serves plus all actual packaged references.
      const referenceFiles = Object.fromEntries(Object.entries(packageFiles).filter(([name]) => !name.endsWith('/')).map(([name, bytes]) => [`skills/${name}`, bytes]));
      referenceFiles[`skills/${slug}/SKILL.md`] = instructionBytes;
      let reference_validation = { status: 'PASS' };
      try { verifyLocalReferences(referenceFiles); } catch { reference_validation = { status: 'BLOCKED', error: 'Concrete supporting-file links are unresolved. Retrieve and review this package before use.' }; }
      const exclusions = referenceFixtureExclusions(referenceFiles);
      if (exclusions.length) reference_validation.negative_fixture_exclusions = exclusions;
      const revision_sha256 = digest(JSON.stringify({ instruction: instruction.sha256, archive: archive?.sha256 ?? null, metadata: digest(JSON.stringify(block)), page: page?.sha256 ?? null }));
      // Not part of the revision: the page's "Updated" day (search_library since) and the frontmatter (skills/list).
      let updated;
      try { if (page) updated = JSON.parse(fs.readFileSync(pageFile)).added; } catch { /* no date; the item still publishes */ }
      const front = frontmatter(instructionBytes.toString('utf8'));
      resources[slug] = { revision_sha256, instruction, ...(archive ? { archive } : {}), ...(page ? { page } : {}), files, reference_validation, ...(typeof updated === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(updated) ? { updated } : {}), ...(front ? { frontmatter: front } : {}) };
    } catch {
      unavailable.push({ slug, reason: 'Published package is missing or failed package safety validation.' });
    }
  }
  if (!fs.readFileSync(cataloguePath).equals(catalogueBytes)) throw Error('Catalogue changed while building the API manifest; retry on a stable snapshot.');
  return { schema: 'abb-public-catalogue/1', catalogue_sha256: digest(catalogueBytes), resources, unavailable };
}

const SITE = 'https://useaiblocks.com';
const kindPath = b => b.type === 'mind' ? 'minds' : b.type === 'agent' ? 'agents' : b.category === 'orchestrator' || b.type === 'workflow' || b.type === 'routine' ? 'workflows' : b.type === 'prompt' ? 'prompts' : 'skills';
const strings = value => Array.isArray(value) ? value.filter(v => typeof v === 'string') : [];

/** AI tools (data/ai-tools.json) and mini tools (mini-tools/tools.json) as API items, plus search_library's and
 *  plan_workflow's search indexes built ahead (the Worker builds the same ones when this file is missing). Reads only
 *  published files; either tool file may be absent. */
export function buildApiExtras(publicDir, manifest) {
  const catalogue = JSON.parse(fs.readFileSync(path.join(publicDir, 'data', 'blocks.json')));
  const items = catalogueItems(catalogue.blocks), bySlug = new Map(catalogue.blocks.map(b => [b.slug, b]));
  // A linked block as a row to cite and load; links to unpublished blocks are dropped.
  const link = slug => { const b = bySlug.get(slug); return b && manifest.resources[slug] ? { id: slug, type: kindPath(b).slice(0, -1), title: b.name, url: `${SITE}/${kindPath(b)}/${slug}` } : null; };
  const jobsOf = slugs => [...new Set(slugs.flatMap(s => bySlug.has(s) && manifest.resources[s] ? taskIdsOf(bySlug.get(s)) : []))];
  const read = file => fs.existsSync(path.join(publicDir, file)) ? JSON.parse(fs.readFileSync(path.join(publicDir, file))) : null;
  const extras = [];
  const ai = read('data/ai-tools.json');
  if (ai) {
    const useCases = new Map((ai.useCases ?? []).map(u => [u.id, u.name])), categories = new Map((ai.categories ?? []).map(c => [c.id, c.name]));
    const names = new Map(ai.tools.map(t => [t.slug, t.name]));
    for (const t of ai.tools) extras.push({
      key: `aitool-${t.slug}`, id: t.slug, type: 'ai_tool', title: t.name, one_line: t.promise, url: `${SITE}/ai-tools/${t.slug}`, updated: t.lastChecked,
      jobs: jobsOf(strings(t.blocks)), categories: strings(t.categories),
      search: { description: [...strings(t.useCases).map(id => useCases.get(id) ?? id), ...strings(t.categories).map(id => categories.get(id) ?? id)].join(' '), extra: [t.maker, ...strings(t.does), ...strings(t.bestFor)].join(' ') },
      detail: {
        maker: t.maker, product_url: t.url, does: strings(t.does), best_for: strings(t.bestFor), not_for: strings(t.notFor), pricing: t.pricing ?? null,
        works_with: (t.worksWith ?? []).map(w => w.name), runs_in: strings(t.runsIn), related: strings(t.blocks).map(link).filter(Boolean),
        alternatives: strings(t.alternatives).filter(s => names.has(s)).map(s => ({ id: s, type: 'ai_tool', title: names.get(s), url: `${SITE}/ai-tools/${s}` })),
        not_verified: strings(t.notVerified), sources: strings(t.sources), use_cases: strings(t.useCases).map(id => useCases.get(id) ?? id),
        needs: strings(t.needs), first_result: t.firstResult ?? [], example: t.example ?? null,
      },
    });
  }
  const mini = read('mini-tools/tools.json');
  if (mini) for (const t of mini.tools) {
    const file = name => `${SITE}/mini-tools/${t.slug}/${name}`;
    extras.push({
      key: `minitool-${t.slug}`, id: t.slug, type: 'mini_tool', title: t.name, one_line: t.summary, url: `${SITE}/tools/${t.slug}`, updated: t.updated,
      jobs: jobsOf((t.next ?? []).map(n => n.slug)), categories: t.category ? [t.category] : [],
      search: { description: t.question ?? '', extra: [...(t.inputs ?? []), ...(t.outputs ?? [])].map(p => p.label).join(' ') },
      detail: {
        question: t.question ?? null,
        inputs: (t.inputs ?? []).map(p => ({ id: p.id, label: p.label, unit: p.unit, example: p.example, ...(p.help ? { help: p.help } : {}) })),
        outputs: (t.outputs ?? []).map(p => ({ id: p.id, label: p.label, unit: p.unit, ...(p.means ? { means: p.means } : {}) })),
        downloads: { page: file(`${t.slug}.html`), spreadsheet: file(`${t.slug}.xlsx`), skill_md: file('SKILL.md'), prompt: file('prompt.txt'), python: file(`${t.slug}.py`) },
        next: (t.next ?? []).map(n => { const row = link(n.slug); return row && { ...row, why: n.why }; }).filter(Boolean),
        notes: strings(t.notes), sources: t.sources ?? [], formulas: (t.outputs ?? []).map(p => ({ id: p.id, formula: p.formula })),
      },
    });
  }
  // Index keys must stay apart from block slugs (the two rankings merge on them).
  const keys = new Set(items.map(b => b.slug)), kept = extras.filter(e => !keys.has(e.key) && keys.add(e.key));
  return {
    schema: 'abb-api-extras/1', catalogue_sha256: manifest.catalogue_sha256, items: kept,
    indexes: { search: blockSearchIndex(items, manifest.catalogue_sha256), extras: extraSearchIndex(kept, manifest.catalogue_sha256), steps: searchIndexFor(stepLibrary(items, manifest.resources)) },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await acquireBuildLock('.index-build.lock');
  const publicDir = path.resolve('public');
  const manifest = buildPublicApiManifest(publicDir);
  const extras = Buffer.from(JSON.stringify(buildApiExtras(publicDir, manifest)));
  fs.writeFileSync(path.join(publicDir, 'data', 'api-extras.json'), extras);
  manifest.extras = { path: '/data/api-extras.json', sha256: digest(extras), bytes: extras.length };
  fs.writeFileSync(path.join(publicDir, 'data', 'public-api-manifest.json'), JSON.stringify(manifest));
  // The connection guide has one source, src/content/api-mcp.html, which scripts/prerender.mjs renders to
  // dist/api-and-mcp.html. The old standalone copy (docs/public-mcp) described the first MCP tools and is gone.
  fs.rmSync(path.join(publicDir, 'api-and-mcp.html'), { force: true });
  console.log(`Public API: ${Object.keys(manifest.resources).length} published packages indexed; ${manifest.unavailable.length} withheld; ${JSON.parse(extras).items.length} AI tools and mini tools; ${Object.values(manifest.resources).filter(r => r.frontmatter).length} skills with frontmatter. No models called.`);
}
