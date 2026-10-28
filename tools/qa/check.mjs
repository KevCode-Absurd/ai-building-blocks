#!/usr/bin/env node
// Read-only checks of staged bytes, committed changes in CI, or a local working preview.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { changedContent, checkedPath, git, readBlobs, REPO, workingContent, worktreeText } from './git-content.mjs';
import { checkTextChange } from './source-validation.mjs';
import { digest, methodBody } from './contract-evidence.mjs';
import { linkDefinitions, reviewCatalogue } from './catalogue-review.mjs';
const YAML = createRequire(new URL('../../site/package.json', import.meta.url))('yaml');
const decode = text => YAML.parse(text, { maxAliasCount: 100 });
export function runChecks({ root = REPO, worktree = false, base, contracts = true } = {}) {
  const staged = !worktree && !base;
  const changes = worktree ? workingContent(root) : changedContent(root, { base: base ?? 'HEAD', staged });
  const failures = changes.flatMap(change => checkTextChange(change).map(message => ({ file: change.file, message })));
  if (!contracts || failures.length) return { failures, files: changes.length };
  const listed = git(root, base ? ['ls-tree', '-r', '--name-only', '-z', 'HEAD', '--', 'catalogue-items', 'tools/orchestrator-pages'] : ['ls-files', '--cached', ...(worktree ? ['--others', '--exclude-standard'] : []), '-z', '--', 'catalogue-items', 'tools/orchestrator-pages']).toString('utf8').split('\0').filter(Boolean);
  const allPaths = [...new Set(listed)]; allPaths.forEach(checkedPath);
  const readMany = files => worktree ? files.map(file => worktreeText(root, file)) : readBlobs(root, files.map(file => staged ? `:${file}` : `HEAD:${file}`)).map(bytes => bytes?.toString('utf8') ?? null);
  const itemFiles = allPaths.filter(file => file.endsWith('/item.yaml'));
  const items = new Map();
  readMany(itemFiles).forEach((text, index) => { if (text !== null) items.set(itemFiles[index], decode(text)); });
  const registryFile = 'tools/qa/catalogue-review.json', registryText = readMany([registryFile])[0];
  if (!registryText) return { files: changes.length, failures: [{ file: registryFile, message: 'Review registry is missing' }] };
  const registry = JSON.parse(registryText), bySlug = new Map();
  const extraPages = new Map();
  const pageFiles = allPaths.filter(file => file.endsWith('/page.yaml') || /^tools\/orchestrator-pages\/[^/]+\.ya?ml$/.test(file));
  readMany(pageFiles).forEach((text, index) => {
    if (text && /^(?:next|before|new_slug):/m.test(text)) extraPages.set(pageFiles[index], decode(text));
  });
  const paths = new Set(allPaths);
  for (const [file, item] of items) {
    const ownPage = file.replace(/item\.yaml$/, 'page.yaml'), fallback = `tools/orchestrator-pages/${item.slug}.yaml`;
    const pageFile = paths.has(ownPage) ? ownPage : fallback, page = extraPages.get(pageFile);
    if (!page) continue;
    if (typeof page.new_slug === 'string') item.reviewAliases = [page.new_slug];
    item.reviewLinkDefinitions = ['next', 'before'].filter(field => Array.isArray(page[field])).map(field => ({ file: pageFile, field, targets: page[field] }));
  }
  for (const [file, item] of items) for (const slug of [item.slug, file.split('/').at(-2)].filter(Boolean)) bySlug.set(slug, file);
  for (const [file, item] of items) for (const alias of item.reviewAliases ?? []) bySlug.set(alias, file);
  const needed = new Set(Object.keys(registry.inputs ?? {}));
  const contractChanges = [];
  for (const change of changes) {
    if (change.file.endsWith('/item.yaml')) {
      needed.add(change.file);
      contractChanges.push({ file: change.file, before: change.before ? decode(change.before.toString('utf8')) : null, after: change.after ? decode(change.after.toString('utf8')) : null });
    } else if (change.file.endsWith('/page.yaml') || /^tools\/orchestrator-pages\/[^/]+\.ya?ml$/.test(change.file)) {
      contractChanges.push({ file: change.file, before: change.before ? decode(change.before.toString('utf8')) : null, after: change.after ? decode(change.after.toString('utf8')) : null });
    } else if (change.file.endsWith('/SKILL.md')) {
      let methodChanged = true;
      try { methodChanged = digest(methodBody(change.before?.toString('utf8') ?? '')) !== digest(methodBody(change.after?.toString('utf8') ?? '')); } catch { /* let the review report the malformed method */ }
      const file = change.file.replace(/SKILL\.md$/, 'item.yaml'); needed.add(file);
      contractChanges.push({ file: change.file, methodChanged });
    }
  }
  for (const [owner, item] of items) for (const definition of linkDefinitions(owner, item)) for (const target of definition.targets) { needed.add(owner); if (bySlug.has(target)) needed.add(bySlug.get(target)); }
  const methodItems = [...needed].filter(file => items.has(file));
  const methods = new Map(); readMany(methodItems.map(file => file.replace(/item\.yaml$/, 'SKILL.md'))).forEach((text, index) => { if (text !== null) methods.set(methodItems[index], text); });
  const review = reviewCatalogue({ items, methods, registry, changes: contractChanges });
  return { files: changes.length, ...review, failures: [...failures, ...review.failures] };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const i = process.argv.indexOf('--base');
  try {
    const args = process.argv.slice(2);
    if (i >= 0 && (!process.argv[i + 1] || process.argv[i + 1].startsWith('--') || args.includes('--worktree'))) throw Error('Choose one snapshot');
    for (let n = 0; n < args.length; n++) { if (args[n] === '--base') { n++; continue; } if (args[n] !== '--worktree') throw Error('Unknown QA option'); }
    const result = runChecks({ worktree: args.includes('--worktree'), ...(i >= 0 ? { base: process.argv[i + 1] } : {}) });
    console.log(JSON.stringify(result, null, 2)); if (result.failures.length) process.exitCode = 1;
  } catch { console.error('QA could not read the source snapshot safely. Check the paths, Git revision and YAML without printing private file contents.'); process.exitCode = 1; }
}
