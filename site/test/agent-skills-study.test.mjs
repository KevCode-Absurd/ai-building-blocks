// The research page /research/agent-skills-2026 (src/trust-pages/agent-skills-study.mjs) and its data
// (src/trust-pages/agent-skills-2026.json, public/research/data/agent-skills-2026/*.csv).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { STUDY_PATH, STUDY_DATA, SECTIONS, studyPage, day } from '../src/trust-pages/agent-skills-study.mjs';
import { bars, columns, split, table } from '../src/trust-pages/research-charts.mjs';
import { STATIC_PAGES, isStaticPage } from '../src/lib/site-nav.mjs';
import { GUIDES } from '../src/lib/blog.mjs';
import { grade } from '../../tools/readability.mjs';

const data = JSON.parse(fs.readFileSync(new URL('../src/trust-pages/agent-skills-2026.json', import.meta.url), 'utf8'));
const page = studyPage(data);
const csvDir = new URL('../public/research/data/agent-skills-2026/', import.meta.url);

test('the study page has every section, opens as a plain page and is listed with the guides', () => {
  assert.equal(page.url, STUDY_PATH);
  assert.ok(isStaticPage(STUDY_PATH) && STATIC_PAGES.includes('/research'));
  assert.ok(GUIDES.some((g) => g.href === STUDY_PATH));
  for (const [id] of SECTIONS) assert.match(page.body, new RegExp(`<h2 class="hub-h2" id="${id}">`), id);
  assert.equal(page.h1, data.title);
  assert.ok(page.desc.length <= 160, `description is ${page.desc.length} characters`);
  assert.equal(day('2026-11-17'), '17 November 2026');
});

test('every number on the page comes from the data file, and every chart links its CSV, which exists', () => {
  for (const t of data.tiles) assert.ok(page.body.includes(t.value), t.value);
  const links = [...page.body.matchAll(/href="(\/research\/data\/agent-skills-2026\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(links.length >= 15, `${links.length} data links`);
  for (const l of new Set(links)) assert.ok(fs.existsSync(new URL(l.slice(STUDY_DATA.length + 1), csvDir)), `${l} exists`);
  for (const f of data.files) assert.ok(fs.statSync(new URL(f.file, csvDir)).size > 0, f.file);
  // Charts carry their numbers as text, so the page reads the same without the drawings.
  assert.equal((page.body.match(/<figure class="rs-fig"/g) ?? []).length, (page.body.match(/<figcaption/g) ?? []).length);
  assert.ok((page.body.match(/<figure class="rs-fig"/g) ?? []).length >= 9);
});

test('the Dataset structured data names the files to download, the dates and the licence', () => {
  const ld = page.main;
  assert.equal(ld['@type'], 'Dataset');
  assert.equal(ld.url, `https://useaiblocks.com${STUDY_PATH}`);
  assert.equal(ld.license, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal(ld.distribution.length, data.files.length);
  for (const d of ld.distribution) assert.match(d.contentUrl, /^https:\/\/useaiblocks\.com\/research\/data\/agent-skills-2026\/[\w-]+\.csv$/);
  assert.match(ld.datePublished, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(ld.temporalCoverage && ld.variableMeasured.length && ld.measurementTechnique.length);
});

test('the study says honestly who reviewed what, and claims no first census', () => {
  const text = page.body.replace(/<[^>]+>/g, ' ');
  assert.match(text, /reviewer was Claude, not a human expert/);
  assert.doesNotMatch(text, /human[- ]review|expert[- ]review|reviewed by (?:our )?(?:team|experts|humans)/i);
  assert.doesNotMatch(text, /first (?:census|study|ever)|largest study/i);
  // Earlier work is named and linked.
  for (const id of ['2608.10906', '2608.08453', '2603.22447', '2603.16572', '2610.37901']) assert.ok(page.body.includes(`https://arxiv.org/abs/${id}`), id);
  assert.ok(text.includes('lower bound'));
});

test('the page follows the site rules: no em dashes, no inline style or script, prose at grade 8 to 9', () => {
  assert.doesNotMatch(page.body, /—/);
  assert.doesNotMatch(page.body, /\sstyle=|<script/i);
  const prose = [...page.body.matchAll(/<p class="(?:rs-prose|bp-sub)">([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, "'")).join('\n\n');
  const g = grade(prose);
  assert.ok(g >= 8 && g <= 9.5, `prose reads at grade ${g}`);
});

test('chart helpers print each value as text and refuse empty data', () => {
  const b = bars([{ label: 'A', value: 50 }, { label: 'B', value: 25, display: '25 (1 of 4)' }], { caption: 'C', unit: '%', csv: '/x.csv' });
  assert.match(b, /<span class="rs-value">50%<\/span>/);
  assert.match(b, /25 \(1 of 4\)/);
  assert.match(b, /href="\/x\.csv" download/);
  assert.throws(() => bars([], { caption: 'empty' }));
  assert.match(split([{ label: 'X', value: 3 }, { label: 'Y', value: 1 }], { caption: 'S' }), /X<\/span> <b>3 \(75%\)<\/b>/);
  assert.throws(() => split([1, 2, 3, 4, 5].map((v) => ({ label: String(v), value: v })), { caption: 'too many' }));
  const c = columns([{ label: 'Jan', value: 1 }, { label: 'Feb', value: 4 }], { caption: 'Cols' });
  assert.match(c, /Peak: 4 in Feb/);
  assert.match(c, /<td>Feb<\/td><td>4<\/td>/);
  assert.match(table(['a', 'b'], [['x', 1200]]), /<th scope="row">x<\/th><td>1,200<\/td>/);
});
