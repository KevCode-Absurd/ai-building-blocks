// Compare selected source files without executing upstream scripts. Run from the repository root.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import YAML from '../site/node_modules/yaml/dist/index.js';

const base = process.argv[2];
if (!base) throw new Error('Pass the folder containing the six source clones.');
const clones = {
  'jacquardlabs/study-skills': 'jacquardlabs_study-skills',
  'artificialguybr/resume-ats-linkedin-optimizer': 'artificialguybr_resume-ats-linkedin-optimizer',
  'agent-blueprint/agent-blueprint-skills': 'agent-blueprint_agent-blueprint-skills',
  'Calvinkub/super_subagent_skill_Hackathon': 'Calvinkub_super_subagent_skill_Hackathon',
  'vedraut/slidesage': 'vedraut_slidesage',
  'evilhill/equity-research-skill': 'evilhill_equity-research-skill',
};
const map = YAML.parse(fs.readFileSync('tools/import-map/audience-expansion.yaml', 'utf8'));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const problems = [], entries = [];
// Reviewed launch entrypoints replace only the published routing file. The
// pinned upstream bytes remain in SKILL.upstream.md and are compared in full.
const launchEntrypoints = new Set(['case-competition-slide-deck-builder', 'storyboard-to-powerpoint-deck-builder', 'equity-research-valuation-report-builder']);
function walk(dir, rel = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.name === '.git' || e.name === 'node_modules') return [];
    if (e.isSymbolicLink()) throw new Error(`Source symlink requires review: ${rel}${e.name}`);
    return e.isDirectory() ? walk(path.join(dir, e.name), `${rel}${e.name}/`) : [`${rel}${e.name}`];
  });
}
for (const [key, entry] of Object.entries(map)) {
  const [repo, rel] = key.split(':');
  const clone = path.join(base, clones[repo]), source = path.join(clone, rel);
  const target = `catalogue-items/imported/${entry.slug}`;
  const item = YAML.parse(fs.readFileSync(`${target}/item.yaml`, 'utf8'));
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: clone, encoding: 'utf8' }).trim();
  const files = walk(source).map(file => {
    const original = fs.readFileSync(path.join(source, file));
    const retainedPath = file === 'SKILL.md' && launchEntrypoints.has(entry.slug) ? 'SKILL.upstream.md' : file;
    if (retainedPath !== file && (item.version !== '1.0.1' || !(item.credits ?? []).some(c => c.title === 'Launch compatibility additions') || !fs.readFileSync(path.join(target, 'SKILL.md'), 'utf8').includes('launch-tools/USAGE.md'))) problems.push(`${entry.slug}: undocumented entrypoint overlay`);
    if (!fs.existsSync(path.join(target, retainedPath)) || !original.equals(fs.readFileSync(path.join(target, retainedPath)))) problems.push(`${entry.slug}: changed or missing ${retainedPath}`);
    return { file, ...(retainedPath !== file ? { retainedPath } : {}), sha256: sha(original) };
  });
  const licence = fs.readFileSync(path.join(clone, 'LICENSE'));
  if (!licence.equals(fs.readFileSync(path.join(target, item.source.licence_file)))) problems.push(`${entry.slug}: license differs`);
  if (item.source.repo !== repo || item.source.path !== rel || !commit.startsWith(item.source.commit)) problems.push(`${entry.slug}: provenance differs`);
  if (item.tested) problems.push(`${entry.slug}: unearned model-test claim`);
  entries.push({ slug: entry.slug, repo, path: rel, commit, licence: item.source.licence, files });
}
const report = { checkedOn: '2026-10-22', method: 'Byte comparison against pinned Git clones at explicit retained paths; license comparison; SHA-256 manifest. This verifier does not execute programs. Four artifact executions and compatibility overlays are recorded separately in reports/2026-10-22-artifact-e2e.md; this is not a model benchmark.', skills: entries.length, sourceFiles: entries.reduce((n, e) => n + e.files.length, 0), problems, entries };
fs.writeFileSync('reports/audience-import-verification.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ skills: report.skills, sourceFiles: report.sourceFiles, problems }));
if (problems.length) process.exitCode = 1;
