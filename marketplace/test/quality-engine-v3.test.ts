import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { TOOL_FILES } from '../src/modules/packs/build.ts';
import { testEnv } from './helpers.ts';
import type { Env } from '../src/env.ts';

const shared = fileURLToPath(new URL('../packs/shared/', import.meta.url));
test('v3 resources are portable and declared for both download formats and public tool mirrors', () => {
  const names = TOOL_FILES.filter(t => t.name.startsWith('quality/')).map(t => t.name);
  assert.ok(names.includes('quality/cards/landing-page.md'));
  assert.ok(names.includes('quality/render.cjs'));
  for (const name of names) {
    const file = path.join(shared, 'tools', name);
    assert.ok(existsSync(file), name);
    assert.doesNotMatch(readFileSync(file, 'utf8'), /C:\/[Uu]sers\/|scratchpad\/qbench/);
  }
});

test('hand-over uses the chosen family ceiling and rejects an unknown family', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'quality-v3-'));
  const plain = path.join(dir, 'plain.md'), final = path.join(dir, 'final.md');
  writeFileSync(plain, 'Useful work. '.repeat(50));
  writeFileSync(final, 'Useful work. '.repeat(65));
  const tool = path.join(shared, 'tools/check-handover.mjs');
  const run = (...args: string[]) => spawnSync(process.execPath, [tool, final, plain, ...args], { encoding: 'utf8' });
  assert.equal(run().status, 0, 'legacy calls retain their compatible ceiling');
  assert.equal(run('--profile', 'landing-page').status, 1, 'a page cannot exceed its family ceiling');
  assert.equal(run('--profile', 'landing-page', '--requested-more').status, 0);
  assert.equal(run('--profile', 'made-up-family').status, 2);
});

test('nested quality tools are served as exact source bytes and unknown names fail closed', async () => {
  const assets = {
    async fetch(req: Request) {
      const name = new URL(req.url).pathname.replace('/packs/tools/', '');
      const file = path.join(shared, 'tools', name);
      if (!TOOL_FILES.some(t => t.name === name) || !existsSync(file)) return new Response('<html>fallback</html>', {headers:{'content-type':'text/html'}});
      return new Response(readFileSync(file, 'utf8'), {headers:{'content-type':'text/plain'}});
    },
  } as Env['ASSETS'];
  const t = await testEnv({ASSETS:assets, HOSTED_JOBS:'off'});
  for (const name of ['QUALITY-ENGINE-v3.md','profiles.json','proof.cjs','cards/landing-page.md']) {
    const res = await t.api('GET','/tools/quality/'+name);
    assert.equal(res.status,200,name);
    assert.equal(await res.res.clone().text(),readFileSync(path.join(shared,'tools/quality',name),'utf8'));
    assert.match(res.res.headers.get('content-type') ?? '', name.endsWith('.json') ? /application\/json/ : name.endsWith('.md') ? /text\/markdown/ : /text\/javascript/);
  }
  assert.equal((await t.api('GET','/tools/quality/not-published.md')).status,404);
});
