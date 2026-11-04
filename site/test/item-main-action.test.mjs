import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { capSentences } from '../src/lib/item-actions.ts';
import { namesAMind } from '../src/lib/search-person.ts';

test('the opening subhead keeps at most three sentences', () => {
  assert.equal(capSentences('One. Two. Three.'), 'One. Two. Three.');
  assert.equal(capSentences('One thing. Two things! Three? Four. Five.'), 'One thing. Two things! Three?');
  assert.equal(capSentences('Costs 2.5 times less. Paste it. Get it. Done.'), 'Costs 2.5 times less. Paste it. Get it.');
  assert.equal(capSentences(''), '');
  assert.equal(capSentences('  Paste   your ad.  '), 'Paste your ad.');
});

test('a search names a mind only by full name, or by a long surname alone', () => {
  const blocks = [{ type: 'mind', name: 'Marie Curie (physicist)' }, { type: 'mind', name: 'Steve Jobs' }, { type: 'skill', name: 'Feynman explainer' }];
  assert.equal(namesAMind(blocks, 'ideas from Marie Curie'), true);
  assert.equal(namesAMind(blocks, 'curie'), true);
  assert.equal(namesAMind(blocks, 'steve jobs'), true);
  assert.equal(namesAMind(blocks, 'jobs'), false);
  assert.equal(namesAMind(blocks, 'feynman'), false);
  assert.equal(namesAMind(blocks, 'xqzv plorb'), false);
  assert.equal(namesAMind(blocks, 'review replies'), false);
});

test('item pages put one Download button under the opening and keep the rest under Other ways', () => {
  const page = fs.readFileSync('src/BlockPage.tsx', 'utf8');
  const main = page.indexOf('<ItemMainAction'), get = page.indexOf('id="get"'), run = page.indexOf('id="run"');
  assert.ok(main > 0 && main < get && get < run, 'main action comes before What you get and Other ways');
  assert.doesNotMatch(page, /Run in my AI/);
  assert.match(page, /<UploadSteps /);
  assert.match(page, /Other ways to use it/);
  assert.doesNotMatch(page.slice(run), /data-testid="copy-skill"[^>]*btn-primary|btn-primary[^>]*data-testid="copy-skill"/);
  const header = fs.readFileSync('src/BlockHeader.tsx', 'utf8');
  assert.match(header, /capSentences\(p\?\.subhead\|\|b\.summary,3\)/);
});

test('home search never claims zero results while it is still loading, and minds follow the tasks', () => {
  const home = fs.readFileSync('src/HomePage.tsx', 'utf8');
  assert.match(home, /searching: hasQuery && \(!complete \|\| loading\)/);
  assert.match(home, /resultCount\(\{ hasQuery, complete, loading: searchState\.loading, results \}\)/);
  assert.match(home, /searching \? "Searching…"/);
  assert.match(home, /searching \? null : \(/, 'no empty state while searching');
  const grid = home.indexOf('className="grid">{shownResults'), below = home.indexOf('{!personNamed && minds}'), above = home.indexOf('{personNamed && minds}');
  assert.ok(above > 0 && above < grid && grid < below);
  assert.match(home, />Start with a task <ArrowIcon/);
  assert.match(home, /<Link to="\/#build" className="btn btn-line" data-testid="hero-build-workflow"/);
});

test('the first HTML, the app and the intro font agree on the home introduction', async () => {
  const { readFile } = await import('node:fs/promises');
  const shell = await readFile('../tools/lib/home-initial-shell.mjs', 'utf8');
  const home = fs.readFileSync('src/HomePage.tsx', 'utf8');
  const intro = home.match(/<p className="lede typed" data-done="true">([^<]+)<\/p>/)[1];
  assert.ok(shell.includes(`<p class="lede typed" data-done="true">${intro}</p>`));
  assert.ok(shell.includes('<h1 class="h1">Use AI like the top 1%</h1>'));
  assert.ok(home.includes('<h1 className="h1">Use AI like the top 1%</h1>'));
  const font = JSON.parse(fs.readFileSync('public/fonts/ai-blocks-intro-sans.json', 'utf8'));
  for (const ch of intro) assert.ok(font.codepoints.includes(ch.codePointAt(0)), `intro font lacks ${JSON.stringify(ch)}`);
  assert.ok(!shell.includes('hero-goal'), 'the home hero has no goal box');
});
