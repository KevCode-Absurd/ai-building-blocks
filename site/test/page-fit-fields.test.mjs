import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

// not_for and output_sample reach the page JSON (skills and minds); `example` (the test input) does not.
test('build-index ships not_for and output_sample, and never the test example', async () => {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'abb-fit-test-'));
  const cat = path.join(base, 'catalogue'), folder = path.join(cat, 'general/fit-fixture'), mind = path.join(cat, 'minds/mind-fixture');
  try {
    await fs.mkdir(folder, { recursive: true });
    await fs.mkdir(mind, { recursive: true });
    await fs.mkdir(path.join(base, 'src/lib'), { recursive: true });
    await fs.copyFile(new URL('../src/lib/data.ts', import.meta.url), path.join(base, 'src/lib/data.ts'));
    await fs.writeFile(path.join(cat, '_types.yaml'), 'files:\n  source_text: {desc: Supplied notes}\n  document: {desc: A report}\n');
    await fs.writeFile(path.join(folder, 'item.yaml'), 'slug: fit-fixture\nname: Fit fixture\ntype: skill\njob: research\ninputs: [source_text]\noutputs: [document]\n');
    await fs.writeFile(path.join(folder, 'SKILL.md'), '---\nname: fit-fixture\ndescription: Check fit.\n---\n# Fit fixture\nRead the note.\n');
    await fs.writeFile(path.join(folder, 'page.yaml'), [
      'headline: Fit fixture', 'subhead: Paste a note and get a check.', 'when:', '  - A note arrives.',
      'not_for:', '  - "You need a full audit: use the audit skill."',
      'output_sample:', '  input: ["Your orders"]', '  output:', '    - name: report.md', '      contains: "A one page check."', 'worked_example:', '  scenario: RETIRED', '  input: x', '  output: y',
      'example:', '  business: Sprout', '  input: TEST INPUT ONLY', '  output: TEST OUTPUT ONLY', '',
    ].join('\n'));
    // A mind: not_for and worked_example in mind.yaml reach its page too.
    await fs.writeFile(path.join(cat, 'minds/_roster.yaml'), ['areas: {}', 'minds:', '  - slug: mind-fixture', '    name: Fictional reviewer', '    area: learning', '    seat: reviewer', ''].join('\n'));
    await fs.writeFile(path.join(cat, 'minds/_avatars.yaml'), 'mind-fixture: {}\n');
    await fs.writeFile(path.join(cat, 'minds/_labels.yaml'), ['labels:', '  reviewer: Reviewer', 'people:', '  mind-fixture: [reviewer]', ''].join('\n'));
    await fs.writeFile(path.join(mind, 'mind.yaml'), [
      'name: Fictional reviewer', 'summary: A fictional review fixture.', 'known_for: Reviewing fictional notes.', 'use_cases: [Review a fictional note]',
      'sources: []', 'seats:', '  - seat: reviewer', 'not_for:', '  - "A legal opinion: ask a lawyer."',
      'output_sample:', '  input: [A note]', '  prerequisites: [An AI chat]', '  output:', '    - name: Verdict', '      contains: Keep or cut.', '',
    ].join('\n'));
    await fs.writeFile(path.join(mind, 'SKILL.md'), '# Fictional reviewer\nRead the fictional note.\n');
    const script = path.resolve(new URL('../scripts/build-index.mjs', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    const result = spawnSync(process.execPath, [script], { cwd: base, env: { ...process.env, CATALOGUE_ROOT: cat }, encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const read = async slug => JSON.parse(await fs.readFile(path.join(base, 'public/data/pages', `${slug}.json`), 'utf8'));
    const page = await read('fit-fixture');
    assert.deepEqual(page.not_for, ['You need a full audit: use the audit skill.']);
    assert.deepEqual(page.output_sample, { input: ['Your orders'], output: [{ name: 'report.md', contains: 'A one page check.' }] });
    assert.equal(page.worked_example, undefined, 'The retired worked_example must not be shipped');
    assert.equal(page.example, undefined, 'The test example must not be shipped');
    const mindPage = await read('mind-fixture');
    assert.deepEqual(mindPage.not_for, ['A legal opinion: ask a lawyer.']);
    assert.deepEqual(mindPage.output_sample, { input: ['A note'], prerequisites: ['An AI chat'], output: [{ name: 'Verdict', contains: 'Keep or cut.' }] });
  } finally {
    assert.equal(path.dirname(base), path.resolve(os.tmpdir()));
    await fs.rm(base, { recursive: true, force: true });
  }
});
