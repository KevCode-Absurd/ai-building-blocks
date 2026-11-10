import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import TABLE from '../src/jobs/lead-agents.json' with { type: 'json' };
import { agentLoad, leadAgentFor, settingsOf } from '../src/jobs/lead-agents.mjs';

const read = file => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null);
const approaches = read(new URL('../public/data/approach-index.json', import.meta.url));
const org = read(new URL('../public/data/team-org-chart.json', import.meta.url));
const idsIn = row => [row.default, ...Object.values(row.settings ?? {}), ...(row.variants ?? []).map(v => v.agent)].filter(Boolean);

test('the lead table covers every job type, and every agent it names is a house agent', { skip: !approaches || !org ? 'site/public/data is not built' : false }, () => {
  assert.deepEqual(Object.keys(TABLE.jobs).sort(), Object.keys(approaches.jobs).sort());
  const agents = new Set(org.personas.map(p => p.id));
  for (const [job, row] of Object.entries(TABLE.jobs)) {
    for (const id of idsIn(row)) assert.ok(agents.has(id), `${job}: ${id}`);
    assert.ok(typeof row.why === 'string' && row.why.length > 10, `${job}: why`);
  }
});

test('a variant beats a setting, a setting beats the default, and an unknown agent is skipped', () => {
  const table = { setting_words: { local: ['salon'], store: ['shopify', 'online shop'] }, jobs: { 'write-emails': { default: 'a', settings: { store: 's', local: 'l' }, variants: [{ words: ['newsletter issue'], agent: 'v' }], why: 'test row here' } } };
  assert.equal(leadAgentFor('write-emails', 'Write our weekly newsletter issue for the Shopify store', { table }).id, 'v');
  assert.equal(leadAgentFor('write-emails', 'Welcome emails for new newsletter subscribers of our Shopify store', { table }).id, 's');
  assert.equal(leadAgentFor('write-emails', 'Emails for my salon and its online shop', { table }).id, 'l', 'settings go in the table order');
  assert.equal(leadAgentFor('write-emails', 'A welcome email series', { table }).id, 'a');
  assert.equal(leadAgentFor('write-emails', 'Our Shopify store', { table, personas: ['a'] }).id, 'a');
  assert.equal(leadAgentFor('no-such-job', 'anything', { table }), null);
  assert.deepEqual(settingsOf('an online shop on Shopify', table), ['store']);
});

test('a lead agent is loaded through the agents app, or from its public pack', () => {
  const load = agentLoad('candice-email-marketing');
  assert.equal(load.tool, 'load_agent'); assert.equal(load.server, 'https://agents.useaiblocks.com/mcp');
  assert.equal(load.pack.one_file, 'https://agents.useaiblocks.com/packs/candice-email-marketing.txt');
  assert.deepEqual(load.read_first, ['AGENTS.md', 'toolbox.md']);
});
