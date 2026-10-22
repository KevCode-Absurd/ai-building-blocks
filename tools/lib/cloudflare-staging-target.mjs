import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Live test writes require both an explicitly named staging Worker and confirmed
// database isolation. Values from the account configuration are never logged.
export function stagingTarget(env = process.env) {
  assert(env.CF_STAGING_URL, 'Set CF_STAGING_URL to the verified staging Worker URL.');
  const url = new URL(env.CF_STAGING_URL);
  assert.equal(url.protocol, 'https:', 'Staging must use HTTPS.');
  assert(/^ai-building-blocks-staging\.[a-z0-9-]+\.workers\.dev$/i.test(url.hostname), 'Only the named staging Worker is allowed; production/custom domains are refused.');
  assert(!url.username && !url.password && !url.port && !url.search && !url.hash && url.pathname === '/', 'Use the bare staging origin.');
  assert.equal(env.CF_STAGING_ISOLATED, 'true', 'The deployment owner must confirm separate staging D1 before live test writes.');
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const configPath = path.resolve(env.CF_STAGING_CONFIG || path.join(root, 'site/wrangler.jsonc'));
  const require = createRequire(new URL('../../site/package.json', import.meta.url));
  const ts = require('typescript');
  const parsed = ts.parseConfigFileTextToJson(configPath, fs.readFileSync(configPath, 'utf8'));
  assert(!parsed.error, 'Cannot parse the active staging configuration.');
  const config = parsed.config;
  const staging = config.env?.staging || config;
  assert.equal(staging.name, 'ai-building-blocks-staging');
  const databases = staging.d1_databases;
  assert(Array.isArray(databases) && databases.length === 3, 'All three staging D1 bindings are required.');
  for (const binding of ['COMMENTS', 'SPACES', 'COMPOSER']) assert(databases.some(db => db.binding === binding));
  assert(databases.every(db => /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(db.database_id)), 'Populate real staging D1 IDs before testing.');
  assert.equal(new Set(databases.map(db => db.database_id)).size, 1, 'Staging bindings must share the intended staging database.');
  const productionIds = new Set((config.env?.staging ? config.d1_databases || [] : []).map(db => db.database_id));
  const productionPath = path.resolve(env.CF_PRODUCTION_CONFIG || path.join(root, 'site/wrangler.production.jsonc'));
  if (fs.existsSync(productionPath)) {
    const production = ts.parseConfigFileTextToJson(productionPath, fs.readFileSync(productionPath, 'utf8'));
    assert(!production.error, 'Cannot parse the production configuration for isolation verification.');
    for (const db of production.config.d1_databases || []) productionIds.add(db.database_id);
  }
  assert(databases.every(db => !productionIds.has(db.database_id)), 'Staging must not use a production database.');
  return url.origin;
}
