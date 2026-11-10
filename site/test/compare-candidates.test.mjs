// compare-candidates.mjs (catalogue-items/general/make-three-first-screens/scripts): the parts that need no browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { assignLabels, compareHtml, fitSize, main, parseArgs, parseSize, resolveCandidate, sheetHtml, svgSize } from '../../catalogue-items/general/make-three-first-screens/scripts/compare-candidates.mjs';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'compare-candidates-'));
const quiet = async (fn) => { const log = console.log, err = console.error; console.log = console.error = () => {}; try { return await fn(); } finally { console.log = log; console.error = err; } };

test('options and sizes are read strictly', () => {
  const o = parseArgs(['a.html', 'b.svg', '--out', 'x', '--size', '1080x1350', '--shuffle', '--html-only']);
  assert.deepEqual(o.positional, ['a.html', 'b.svg']);
  assert.equal(o.out, 'x'); assert.deepEqual(o.size, { width: 1080, height: 1350 }); assert.ok(o.shuffle && o.htmlOnly);
  assert.throws(() => parseArgs(['--nope']), /Unknown option/);
  assert.throws(() => parseSize('big'), /width x height/);
  assert.deepEqual(fitSize({ width: 4800, height: 2400 }), { width: 2400, height: 1200 }, 'a huge design is scaled down, shape kept');
  assert.deepEqual(svgSize('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350">'), { width: 1080, height: 1350 });
  assert.deepEqual(svgSize('<svg width="600" viewBox="0 0 1200 628">'), { width: 600, height: 314 });
  assert.equal(svgSize('<svg width="100%">'), null);
});

test('a candidate is a page or a design, and anything else is refused', () => {
  const dir = tmp();
  for (const f of ['one.html', 'two.svg', 'three.PNG', 'notes.txt']) fs.writeFileSync(path.join(dir, f), 'x');
  assert.equal(resolveCandidate(path.join(dir, 'one.html')).type, 'html');
  assert.equal(resolveCandidate(path.join(dir, 'two.svg')).type, 'svg');
  assert.equal(resolveCandidate(path.join(dir, 'three.PNG')).type, 'image');
  assert.equal(resolveCandidate('https://example.com/pricing').type, 'url');
  assert.equal(resolveCandidate('https://example.com/ad.webp?v=2').type, 'image');
  assert.throws(() => resolveCandidate(path.join(dir, 'notes.txt')), /not an HTML file, an SVG or an image/);
  assert.throws(() => resolveCandidate(path.join(dir, 'missing.html')), /no such file/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('labels are neutral letters, and a shuffle keeps every candidate once', () => {
  const list = ['w', 'x', 'y', 'z'].map((given) => ({ given }));
  assert.deepEqual(assignLabels(list).map((c) => c.label + c.given), ['Aw', 'Bx', 'Cy', 'Dz']);
  const mixed = assignLabels(list, true);
  assert.deepEqual(mixed.map((c) => c.label), ['A', 'B', 'C', 'D']);
  assert.deepEqual(mixed.map((c) => c.given).sort(), ['w', 'x', 'y', 'z']);
});

test('the sheets and compare.html show labels, never a candidate name', () => {
  const dir = tmp(), out = path.join(dir, 'compare');
  const shown = [{ label: 'A', type: 'html', local: path.join(dir, 'proof-led-direction.html'), href: 'file:///x' }, { label: 'B', type: 'svg', local: path.join(dir, 'bold type.svg'), href: 'file:///y' }];
  const html = compareHtml(shown, out);
  assert.match(html, /<div class="tag">A<\/div>/); assert.match(html, /src="\.\.\/bold%20type\.svg"/);
  assert.ok(!html.replace(/(?:src|title|alt)="[^"]*"/g, '').includes('proof-led'), 'the name appears only inside a frame address');
  const sheet = sheetHtml([{ label: 'A', kind: 'page', shots: { desktop: 'shots/A-desktop.png' } }, { label: 'B', kind: 'design', error: 'the file did not load as an image' }], 'desktop');
  assert.match(sheet, /shots\/A-desktop\.png/); assert.match(sheet, /Candidate B could not be shown/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('with no browser it still writes compare.html, compare.json and the key', async () => {
  const dir = tmp(), out = path.join(dir, 'out');
  fs.writeFileSync(path.join(dir, 'one.html'), '<!doctype html><h1>One</h1>');
  fs.writeFileSync(path.join(dir, 'two.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100"/></svg>');
  assert.equal(await quiet(() => main([path.join(dir, 'one.html'), path.join(dir, 'two.svg'), '--out', out, '--html-only'])), 0);
  const json = JSON.parse(fs.readFileSync(path.join(out, 'compare.json'), 'utf8'));
  assert.equal(json.mode, 'html-only'); assert.equal(json.sheets, null); assert.deepEqual(json.labels, ['A', 'B']);
  assert.deepEqual(json.candidates.map((c) => c.kind), ['page', 'design']);
  assert.ok(!JSON.stringify(json).includes('one.html'), 'compare.json is safe to hand to the chooser');
  const key = JSON.parse(fs.readFileSync(path.join(out, 'compare.key.json'), 'utf8'));
  assert.equal(key.candidates.length, 2); assert.match(key.candidates[0].source, /one\.html$/);
  assert.match(fs.readFileSync(path.join(out, 'compare.html'), 'utf8'), /<iframe src="\.\.\/one\.html"/);
  assert.equal(await quiet(() => main([path.join(dir, 'one.html')])), 2, 'one candidate is not a comparison');
  fs.rmSync(dir, { recursive: true, force: true });
});
