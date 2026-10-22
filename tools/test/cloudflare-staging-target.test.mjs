import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stagingTarget } from '../lib/cloudflare-staging-target.mjs';

test('live checks reject production URLs, unconfirmed isolation and shared production databases', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-staging-guard-'));
  const configPath = path.join(dir, 'wrangler.jsonc');
  const productionPath = path.join(dir, 'production.jsonc');
  const prodId = '11111111-1111-1111-1111-111111111111', stageId = '22222222-2222-2222-2222-222222222222';
  const config = { d1_databases: [{ database_id: prodId }], env: { staging: { name: 'ai-building-blocks-staging', d1_databases: ['COMMENTS', 'SPACES', 'COMPOSER'].map(binding => ({ binding, database_id: stageId })) } } };
  const write = () => fs.writeFileSync(configPath, '// JSONC is supported\n' + JSON.stringify(config));
  const env = { CF_STAGING_URL: 'https://ai-building-blocks-staging.fixture.workers.dev', CF_STAGING_ISOLATED: 'true', CF_STAGING_CONFIG: configPath, CF_PRODUCTION_CONFIG: productionPath };
  try {
    fs.writeFileSync(productionPath, JSON.stringify({ d1_databases: [{ database_id: prodId }] }));
    write();
    assert.equal(stagingTarget(env), env.CF_STAGING_URL);
    for (const url of ['https://useaiblocks.com', 'https://ai-building-blocks.fixture.workers.dev', 'http://ai-building-blocks-staging.fixture.workers.dev', 'https://ai-building-blocks-staging.fixture.workers.dev.evil.test', env.CF_STAGING_URL + '/?redirect=production', env.CF_STAGING_URL.replace('https://', 'https://secret@')]) {
      assert.throws(() => stagingTarget({ ...env, CF_STAGING_URL: url }));
    }
    assert.throws(() => stagingTarget({ ...env, CF_STAGING_ISOLATED: 'false' }));
    for (const db of config.env.staging.d1_databases) db.database_id = prodId; write();
    assert.throws(() => stagingTarget(env), /production database/);
    for (const db of config.env.staging.d1_databases) db.database_id = stageId;
    config.env.staging.d1_databases[0].database_id = 'REPLACE_WITH_STAGING_D1_DATABASE_ID'; write();
    assert.throws(() => stagingTarget(env), /real staging D1 IDs/);
    config.env.staging.d1_databases[0].database_id = stageId;
    fs.writeFileSync(configPath, JSON.stringify(config.env.staging));
    assert.equal(stagingTarget(env), env.CF_STAGING_URL, 'A frozen top-level staging snapshot is supported.');
    for (const db of config.env.staging.d1_databases) db.database_id = prodId;
    fs.writeFileSync(configPath, JSON.stringify(config.env.staging));
    assert.throws(() => stagingTarget(env), /production database/, 'Actual production IDs are checked for top-level snapshot configurations.');
  } finally {
    // Remove only the three known temporary paths created by this test.
    fs.unlinkSync(configPath); fs.unlinkSync(productionPath); fs.rmdirSync(dir);
  }
});
