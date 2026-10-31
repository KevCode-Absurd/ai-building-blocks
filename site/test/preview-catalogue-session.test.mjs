import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PublicApiError, PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { createPreviewCatalogueSession } from '../scripts/preview-catalogue-session.mjs';

const mismatch = () => new PublicApiError(503, 'stale_roles', 'Published roles changed.');

test('preview reuses a warm snapshot but expires it without restarting the process', async () => {
  let time = 0, created = 0;
  const session = createPreviewCatalogueSession(() => ({ version: ++created }), { now: () => time });
  assert.equal(await session.run(s => s.version), 1);
  time = 29_999; assert.equal(await session.run(s => s.version), 1);
  time = 30_000; assert.equal(await session.run(s => s.version), 2);
});

test('a publication mismatch refreshes the whole operation with unchanged revision pins', async () => {
  let published = 1, created = 0;
  const session = createPreviewCatalogueSession(() => ({ version: published, id: ++created }));
  await session.run(s => s.version);
  published = 2;
  const args = Object.freeze({ revision_sha256: 'a'.repeat(64) }), seen = [];
  const result = await session.run(s => {
    seen.push({ version: s.version, args });
    if (s.version !== published) throw mismatch();
    return s.version;
  });
  assert.equal(result, 2); assert.equal(created, 2);
  assert.deepEqual(seen.map(s => s.version), [1, 2]);
  assert(seen.every(s => s.args === args));
});

test('a still-inconsistent publication fails after one refresh and can recover on a later call', async () => {
  let created = 0, attempts = 0;
  const session = createPreviewCatalogueSession(() => ({ id: ++created }));
  await assert.rejects(() => session.run(() => { attempts++; throw mismatch(); }), /Published roles/);
  assert.equal(attempts, 2); assert.equal(created, 2);
  assert.equal(await session.run(s => s.id), 3);
});

test('failed initial catalogue loads are evicted instead of poisoning the process', async () => {
  let created = 0;
  const session = createPreviewCatalogueSession(() => ({ id: ++created }));
  await assert.rejects(() => session.run(() => { throw new PublicApiError(503, 'asset_unavailable', 'Missing asset.'); }), /Missing asset/);
  assert.equal(created, 1); assert.equal(await session.run(s => s.id), 2);
});

test('invalid scope and changed source pins are not retried or promoted to success', async () => {
  for (const code of ['invalid_arguments', 'stale_team_source']) {
    let attempts = 0;
    const session = createPreviewCatalogueSession(() => ({}));
    const failure = new PublicApiError(409, code, 'Original validation error.');
    await assert.rejects(() => session.run(() => { attempts++; throw failure; }), error => error === failure);
    assert.equal(attempts, 1);
  }
});

test('an older concurrent failure does not evict a newer snapshot', async () => {
  let time = 0, created = 0, rejectOld;
  const session = createPreviewCatalogueSession(() => ({ id: ++created }), { now: () => time });
  const old = session.run(() => new Promise((_, reject) => { rejectOld = reject; }));
  time = 30_000; assert.equal(await session.run(s => s.id), 2);
  rejectOld(new Error('Old operation failed.'));
  await assert.rejects(() => old, /Old operation/);
  assert.equal(await session.run(s => s.id), 2); assert.equal(created, 2);
});

test('the real catalogue reproduces and recovers an in-process publication mismatch', async () => {
  const sha = value => createHash('sha256').update(value).digest('hex');
  const snapshot = version => {
    const blocks = JSON.stringify({ blocks: [], version }), hash = sha(blocks);
    return new Map([
      ['/data/blocks.json', blocks],
      ['/data/public-api-manifest.json', JSON.stringify({ schema: 'abb-public-catalogue/1', catalogue_sha256: hash, resources: {} })],
      ['/data/roles-index.json', JSON.stringify({ schema: 'ai-blocks-roles/1', sourceHash: hash, roles: [], areas: [] })],
    ]);
  };
  let assets = snapshot(1), created = 0;
  const create = () => { created++; return new PublicCatalogueService(async path => new Response(assets.get(path), { status: assets.has(path) ? 200 : 404 }), 'https://example.test'); };
  const old = create();
  await old.readResource('aiblocks://roles');
  const session = createPreviewCatalogueSession(create);
  await session.run(s => s.readResource('aiblocks://roles'));
  assets = snapshot(2);
  await assert.rejects(() => old.readResource('aiblocks://roles'), error => error.code === 'stale_roles');
  const fresh = await session.run(s => s.readResource('aiblocks://roles'));
  assert.equal(JSON.parse(fresh.contents[0].text).schema, 'ai-blocks-roles/1');
  assert.equal(created, 3);
});
