// Prove an SEO-only rebuild retained the tested app bundles, content and layout.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const [before, after] = process.argv.slice(2).map(p => path.resolve(p));
const entries = await fs.readdir(before, { recursive: true, withFileTypes: true });
const files = entries.filter(e => e.isFile()).map(e => path.relative(before, path.join(e.parentPath, e.name)));
let index = 0, retained = 0, changedHeads = 0, changedMetadata = 0; const issues = [];
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
await Promise.all(Array.from({ length: 24 }, async () => {
  while (index < files.length) {
    const file = files[index++]; const a = await fs.readFile(path.join(before, file)), b = await fs.readFile(path.join(after, file));
    if (sha(a) === sha(b)) { retained++; continue; }
    if (file.endsWith('.html')) {
      const body = bytes => bytes.toString().replace(/<head>[\s\S]*?<\/head>/, '<head></head>');
      if (body(a) !== body(b)) issues.push('Rendered layout/content changed: ' + file); else changedHeads++;
    } else if (file.startsWith('metadata' + path.sep)) changedMetadata++;
    else issues.push('Non-SEO asset changed: ' + file);
  }
}));
const report = { checkedOn: new Date().toISOString(), before, after, status: issues.length ? 'fail' : 'pass', files: files.length, retainedByteIdentical: retained, changedHeads, changedMetadata, appBundlesCatalogueAndDownloadsUnchanged: issues.length === 0, issues };
await fs.writeFile('reports/r10-seo-rebuild-parity.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2)); assert.equal(issues.length, 0);
