// Index only already-published assets. Never read source libraries, credentials or user data.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';
import { inspectSkillArchive, referenceFixtureExclusions, safePackagePath, verifyLocalReferences } from '../src/lib/workflow-execution.ts';
import { acquireBuildLock } from './lib/build-lock.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const mime = name => /\.(md|txt|py|js|ts|sh|csv|ya?ml)$/i.test(name) ? 'text/plain' : /\.json$/i.test(name) ? 'application/json' : 'application/octet-stream';

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
      resources[slug] = { revision_sha256, instruction, ...(archive ? { archive } : {}), ...(page ? { page } : {}), files, reference_validation };
    } catch {
      unavailable.push({ slug, reason: 'Published package is missing or failed package safety validation.' });
    }
  }
  if (!fs.readFileSync(cataloguePath).equals(catalogueBytes)) throw Error('Catalogue changed while building the API manifest; retry on a stable snapshot.');
  return { schema: 'abb-public-catalogue/1', catalogue_sha256: digest(catalogueBytes), resources, unavailable };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await acquireBuildLock('.index-build.lock');
  const publicDir = path.resolve('public');
  const manifest = buildPublicApiManifest(publicDir);
  fs.writeFileSync(path.join(publicDir, 'data', 'public-api-manifest.json'), JSON.stringify(manifest));
  // Keep the client-neutral connection guide in every normal site build.
  fs.copyFileSync(new URL('../../docs/public-mcp/api-and-mcp.html', import.meta.url), path.join(publicDir, 'api-and-mcp.html'));
  console.log(`Public API: ${Object.keys(manifest.resources).length} published packages indexed; ${manifest.unavailable.length} withheld. No models called.`);
}
