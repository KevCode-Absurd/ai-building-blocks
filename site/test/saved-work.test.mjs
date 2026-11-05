import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { WORK_KEY, WORK_LIMITS, changedFields, latest, mergeWork, parseWork, planSummary, roleFromPath, suggestNext, validateWork, withRole, withTool } from '../src/lib/saved-work-data.ts';
import { LIBRARY_KEYS, validateLibrary } from '../src/lib/library-data.ts';
import { mergeLibraries } from '../src/lib/merge-library.ts';
import { mergeSignUpSaves } from '../src/lib/signup-saves.ts';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const work = (tools = {}, roles = {}) => JSON.stringify({ tools, roles });

test('saved work is an account library key, validated on client and server', () => {
  assert.ok(LIBRARY_KEYS.includes(WORK_KEY));
  const raw = work({ 'roas-calculator': { preset: 'general', raw: { adSpend: '2000' }, name: 'ROAS calculator', at: 5 } }, { 'meta-ads-specialist': { at: 6 } });
  assert.deepEqual(validateLibrary({ [WORK_KEY]: raw }), { [WORK_KEY]: raw });
  for (const bad of [
    work({ 'Bad Slug': { raw: {}, at: 1 } }),
    work({ ok: { raw: { a: 1 }, at: 1 } }),
    work({ ok: { raw: {}, at: -1 } }),
    work({ ok: { raw: { a: 'x'.repeat(WORK_LIMITS.value + 1) }, at: 1 } }),
    work({}, { 'role-id': { at: 'yesterday' } }),
    JSON.stringify([]),
  ]) assert.throws(() => validateLibrary({ [WORK_KEY]: bad }), bad);
  const tooMany = Object.fromEntries(Array.from({ length: WORK_LIMITS.tools + 1 }, (_, i) => [`tool-${i}`, { raw: {}, at: i }]));
  assert.throws(() => validateWork({ tools: tooMany, roles: {} }));
  assert.deepEqual(parseWork('not json'), { tools: {}, roles: {} });
});

test('two devices never conflict on saved work: the newest entry wins', () => {
  const phone = work({ a: { raw: { x: '1' }, at: 10 }, b: { raw: { y: '2' }, at: 30 } }, { r: { at: 5 } });
  const laptop = work({ a: { raw: { x: '9' }, at: 20 }, c: { raw: {}, at: 1 } }, { r: { name: 'Role', at: 5 }, s: { at: 7 } });
  const merged = JSON.parse(mergeWork(phone, laptop));
  assert.equal(merged.tools.a.raw.x, '9');
  assert.equal(merged.tools.b.raw.y, '2');
  assert.ok(merged.tools.c);
  assert.equal(merged.roles.r.name, 'Role');
  assert.ok(merged.roles.s);
  assert.equal(mergeWork(undefined, undefined), undefined);
  // The three-way library merge uses the same rule instead of raising a conflict.
  const base = { [WORK_KEY]: work({ a: { raw: {}, at: 1 } }) };
  const result = mergeLibraries(base, { [WORK_KEY]: phone }, { [WORK_KEY]: laptop });
  assert.equal(JSON.parse(result[WORK_KEY]).tools.a.raw.x, '9');
});

test('signing up keeps calculator numbers from this browser and from the account', () => {
  const account = { [WORK_KEY]: work({ a: { raw: { x: 'account' }, at: 50 } }) };
  const browser = { id: 'save-1', capturedAt: 1, data: { [WORK_KEY]: work({ a: { raw: { x: 'old browser' }, at: 10 }, b: { raw: { y: 'browser' }, at: 60 } }) } };
  const merged = JSON.parse(mergeSignUpSaves(account, browser)[WORK_KEY]);
  assert.equal(merged.tools.a.raw.x, 'account');
  assert.equal(merged.tools.b.raw.y, 'browser');
});

test('only changed calculator numbers are kept, with bounded size', () => {
  assert.deepEqual(changedFields({ a: '1', b: '5', c: '3' }, { a: '1', b: '2', c: '3' }), { b: '5' });
  let raw = null;
  for (let i = 0; i < WORK_LIMITS.tools + 5; i++) raw = withTool(raw, `tool-${i}`, { raw: { n: String(i) }, name: `Tool ${i}`, at: i });
  const kept = parseWork(raw).tools;
  assert.equal(Object.keys(kept).length, WORK_LIMITS.tools);
  assert.ok(!kept['tool-0'] && kept[`tool-${WORK_LIMITS.tools + 4}`]);
  assert.equal(latest(kept)[0], `tool-${WORK_LIMITS.tools + 4}`);
  assert.equal(withTool(null, '../x', { raw: {}, at: 1 }), JSON.stringify({ tools: {}, roles: {} }));
});

test('specialist visits are remembered by address and keep a known name', () => {
  assert.equal(roleFromPath('/roles/meta-ads-specialist'), 'meta-ads-specialist');
  assert.equal(roleFromPath('/roles'), null);
  assert.equal(roleFromPath('/roles/x/y'), null);
  assert.equal(roleFromPath('/skills/meta-ads-specialist'), null);
  let raw = withRole(null, 'meta-ads-specialist', 1, 'Meta ads specialist');
  raw = withRole(raw, 'meta-ads-specialist', 2);
  assert.deepEqual(parseWork(raw).roles['meta-ads-specialist'], { name: 'Meta ads specialist', at: 2 });
  for (let i = 0; i < 20; i++) raw = withRole(raw, `role-${i}`, 10 + i);
  assert.equal(Object.keys(parseWork(raw).roles).length, WORK_LIMITS.roles);
});

test('the home strip reads the saved plan and suggests one honest next step', () => {
  assert.equal(planSummary(null), null);
  assert.equal(planSummary('{"format":"other"}'), null);
  const plan = planSummary(JSON.stringify({ format: 'ai-blocks-composition/1', goal: 'Weekly report', plan: { title: 'Weekly sales report', steps: [{}, {}, {}] }, createdAt: 100 }));
  assert.deepEqual(plan, { title: 'Weekly sales report', goal: 'Weekly report', steps: 3, at: 100 });
  assert.equal(suggestNext(null, null, null), null);
  assert.match(suggestNext(plan, null, null).text, /give it to your AI/);
  const role = ['meta-ads-specialist', { at: 200 }];
  assert.equal(suggestNext(plan, role, null).to, '/roles/meta-ads-specialist');
  assert.match(suggestNext(plan, role, null).text, /meta ads specialist/);
  assert.equal(suggestNext(plan, role, ['roas-calculator', { raw: {}, at: 300 }]).to, '/compose');
  for (const step of [suggestNext(plan, null, null), suggestNext(null, role, null)]) assert.doesNotMatch(step.text, /—|has run|done/i);
});

test('plans are never lost: editing the request keeps the saved plan and every plan is a saved workflow', () => {
  const page = read('../src/ComposePage.tsx');
  const changeGoal = page.slice(page.indexOf('const changeGoal'), page.indexOf('\n', page.indexOf('const changeGoal')));
  assert.doesNotMatch(changeGoal, /reset\(|removeItem/);
  // Only the builder's explicit Delete clears the saved plan.
  assert.equal(page.match(/libraryStorage\.removeItem\("abb:composer"\)/g).length, 1);
  assert.match(page, /onDelete=\{reset\}/);
  assert.doesNotMatch(page.slice(page.indexOf('compose-choice'), page.indexOf('compose-plan-note')), /reset\(\)/);
  assert.match(page, /const adopt = [\s\S]{0,400}flows\.save\(flow\)/);
  assert.match(page, /data-testid="compose-stale"/);
  assert.match(page, /workflowId: result\?\.workflowId/);
});

test('a free plan comes before sign-in; sign-in is asked only for AI plans and for saving to the account', () => {
  const page = read('../src/ComposePage.tsx');
  assert.match(page, /const planner: "free" \| "ai" = mode \?\? \(account\.state === "signed-in" && available \? "ai" : "free"\)/);
  assert.match(page, /tools\.freeSelection\(lib, goal, choices, context\)/);
  assert.doesNotMatch(page, /"Continue"/, 'no extra Continue step between the goal and the plan');
  assert.doesNotMatch(page, /setReview/);
  assert.match(page, /Sign in to save/);
  assert.match(read('../src/lib/composer-runtime.ts'), /freeSelection/);
  assert.match(read('../src/ComposeRoute.tsx'), /<h1 className="h2">Build a workflow<\/h1>/);
  assert.match(read('../scripts/prerender.mjs'), /"\/compose": \["Build a workflow",/);
});

test('one label for planning, and saved-work places are named the same everywhere', () => {
  const header = read('../src/SiteHeader.tsx');
  // The home hero button, header, footer and page title all say "Build a workflow".
  const nav = read('../src/lib/site-nav.mjs');
  assert.match(nav, /\["\/compose", "Build a workflow", "nav-compose"\]/);
  assert.match(nav, /\["\/compose", "Build a workflow", "compose"\]/);
  assert.match(read('../src/HomePage.tsx'), />Build a workflow <ArrowIcon/);
  assert.match(nav, /\["\/space", "Team space", "space"\]/);
  assert.match(header, /to="\/account"[^>]*data-testid="open-saved-work">My work[{<]/);
  assert.doesNotMatch(header, /My Account|My saved work|Plan a job/);
  assert.match(header, /rememberVisit\(path\)/);
  assert.match(nav, /FOOTER_GROUPS[\s\S]*\["\/compose", "Build a workflow", ""\]/);
  assert.match(read('../src/AccountPage.tsx'), /Open team space/);
  assert.match(read('../src/space/SpacePage.tsx'), /data-testid="space-work-link"/);
  assert.match(read('../src/HomePage.tsx'), /<YourWork \/>/);
});

test('calculator numbers go through the account library, not a browser-only key', () => {
  const tools = read('../src/tools/ToolsPage.tsx');
  assert.doesNotMatch(tools, /abb:tool:\$\{/);
  assert.match(tools, /readToolInputs\(tool\.slug\)/);
  assert.match(tools, /saveToolInputs\(tool\.slug/);
  assert.match(tools, /or in your account when you sign in/);
  assert.match(read('../src/lib/site-info.mjs'), /calculator numbers you change/);
});

test('the team planner uses plain words', () => {
  const team = read('../src/teams/TeamPage.tsx');
  for (const jargon of ['Business or project id', 'producer artifact', 'consumer handoff', 'declared scope', 'scoped memory', 'real runtime', 'sanitized', 'No previous-stage handoff']) assert.ok(!team.includes(jargon), jargon);
  assert.ok(team.indexOf('What should the team get done?') < team.indexOf('Short name for this business or project'), 'the goal comes first');
});
