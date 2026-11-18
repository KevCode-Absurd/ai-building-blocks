import { test } from 'node:test';
import assert from 'node:assert/strict';
import ecommerce from '../src/modules/directory/data/personas-ecommerce.json' with { type: 'json' };
import type { Persona } from '../src/core/types.ts';
import { setPersonasForTests } from '../src/modules/directory/index.ts';
import { seedPersonas, personaHash, getPersona, forgetPersonas } from '../src/modules/directory/service.ts';
import { testEnv } from './helpers.ts';

test('release refresh upgrades a seeded 78-agent directory to current 80 profiles without changing an expert', async () => {
  const current = ecommerce as Persona[];
  const added = new Set(['nico-ecommerce-speed', 'vera-woocommerce-speed']);
  const previous = structuredClone(current.filter(p => !added.has(p.id)));
  previous.find(p => p.id === 'malcolm-ecommerce-growth')!.profile.method = 'Previous deployed growth method.';
  assert.equal(previous.length, 78);
  assert.equal(current.length, 80);
  for (const id of ['nadiya-reddit-ads', 'esmee-b2b-commerce-ads', 'arjun-page-speed']) assert.ok(previous.some(p => p.id === id), `${id} must remain in the prior release`);
  setPersonasForTests(previous);
  const t = await testEnv({ HOSTED_JOBS: 'off' });
  await t.makeOps('release_ops');
  await t.grantBeta('expert_owner');
  const stamp = '2026-01-01T00:00:00.000Z';
  await t.sql("INSERT INTO experts (id,user_id,status,display_name,created_at,updated_at) VALUES ('release_expert','expert_owner','approved','Unchanged expert',?,?)", stamp, stamp);
  await t.sql("INSERT INTO personas (id,kind,expert_id,name,title,tagline,area,profile,status,sort,created_at,updated_at) VALUES ('untouched-expert','expert','release_expert','Expert','Expert title','Expert tagline','ecommerce','{}','live',9999,?,?)", stamp, stamp);
  const before = await t.sql("SELECT * FROM personas WHERE kind = 'expert'");
  await seedPersonas(t.env, 'release_ops');
  setPersonasForTests(current);
  forgetPersonas(t.env);
  assert.equal((await t.api('GET', '/api/agents?vertical=ecommerce')).body.total, 78);
  for (const id of added) assert.equal((await t.api('GET', '/api/agents/' + id)).status, 404);
  assert.equal((await getPersona(t.env, 'malcolm-ecommerce-growth'))!.profile.method, 'Previous deployed growth method.');

  const refreshed = await t.api('POST', '/api/ops/seed', { user: 'release_ops' });
  assert.equal(refreshed.status, 200);
  assert.equal(refreshed.body.personas.created, 2);
  assert.equal(refreshed.body.personas.updated, 1);
  const publicTeam = await t.api('GET', '/api/agents?vertical=ecommerce');
  assert.equal(publicTeam.body.total, 80);
  assert.deepEqual(publicTeam.body.agents.map((p: Persona) => p.id).sort(), current.map(p => p.id).sort());
  for (const p of current) {
    const rows = await t.sql('SELECT kind,status,content_hash FROM personas WHERE id = ?', p.id);
    assert.deepEqual(rows, [{ kind: 'house', status: 'live', content_hash: await personaHash(p) }]);
  }
  for (const id of added) assert.equal((await t.api('GET', '/api/agents/' + id)).status, 200);
  assert.equal((await getPersona(t.env, 'malcolm-ecommerce-growth'))!.profile.method, current.find(p => p.id === 'malcolm-ecommerce-growth')!.profile.method);
  const again = await t.api('POST', '/api/ops/seed', { user: 'release_ops' });
  assert.equal(again.body.personas.created, 0);
  assert.equal(again.body.personas.updated, 0);
  assert.equal(again.body.agents.created, 0);
  assert.equal(again.body.agents.updated, 0);
  assert.deepEqual(await t.sql("SELECT * FROM personas WHERE kind = 'expert'"), before);
  assert.equal((await t.sql('SELECT COUNT(*) AS n FROM model_calls'))[0].n, 0);
  assert.equal((await t.sql('SELECT COUNT(*) AS n FROM jobs'))[0].n, 0);
});
