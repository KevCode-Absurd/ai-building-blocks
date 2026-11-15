// The top of an item page: a format label and a trail, then what you give it, what you get back, how long it takes,
// one Download button and one line on how to use it. The inputs are listed once. A prompt page says "prompt" and
// downloads a prompt file. The app (BlockPage.tsx) and the plain page (scripts/lib/item-top.mjs) share the same words.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { grade } from '../../tools/readability.mjs';
import { howLong, itemBrief, levelLabel, plainWords, promptFileName, promptFileText } from '../src/lib/item-brief.mjs';
import { FORMATS } from '../src/lib/formats.mjs';
import { downloadLink, factsLine, itemTopHtml, otherWaysHtml } from '../scripts/lib/item-top.mjs';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const count = (haystack, needle) => haystack.split(needle).length - 1;

const PAGE = {
  subhead: 'Paste your copy and what you can prove. You get every claim sorted.',
  you_give: ['The ad, page or email copy', 'The proof you hold', 'Your brand brain (optional)'],
  you_get: ['A table of every claim with a call', 'Safer lines for the weak ones', 'Claims flagged for extra care', 'A list of proof to find'],
  how_it_works: [{ title: 'List' }, { title: 'Match' }, { title: 'Reword' }],
  output_sample: { input: ['Your ad, page or email copy'], output: [{ name: 'Claim table', contains: 'One row per claim.' }] },
  plan: { needed: [{ key: 'copy', label: 'A draft', what: 'the ad you want checked', required: true }], helps: [{ key: 'brand', label: 'Brand brain', what: 'your facts and voice, in one folder', required: false }] },
};

test('the brief: every input once, the first three results, and how long in messages and steps', () => {
  const brief = itemBrief({ kind: 'skill', block: { inputs: ['copy_draft'], outputs: ['audit_report'] }, page: PAGE });
  assert.deepEqual(brief.give, ['The ad, page or email copy', 'The proof you hold', 'Your org context (optional)']);
  assert.deepEqual(brief.get, ['A table of every claim with a call', 'Safer lines for the weak ones', 'Claims flagged for extra care']);
  assert.equal(brief.more, 1);
  assert.equal(brief.time, 'One chat. Your AI works through 3 steps.');
  // A page with no lists of its own falls back to what its plan needs, then to the item's inputs and outputs.
  assert.deepEqual(itemBrief({ kind: 'skill', page: { plan: PAGE.plan, output_sample: PAGE.output_sample } }).give, ['A draft: the ad you want checked']);
  assert.deepEqual(itemBrief({ kind: 'skill', page: { output_sample: PAGE.output_sample } }).get, ['Claim table: One row per claim.']);
  const bare = itemBrief({ kind: 'prompt', block: { inputs: [{ type: 'copy_draft', required: true }, 'brand_file?'], outputs: ['audit_report'] }, page: null });
  assert.deepEqual(bare, { give: ['Copy draft', 'Org context'], get: ['Audit report'], more: 0, time: 'One message and one reply.' });
  assert.deepEqual(itemBrief({ kind: 'mind' }), { give: [], get: [], more: 0, time: 'One question, or a whole conversation.' });
});

test('how long never invents minutes: it counts messages and steps', () => {
  assert.equal(howLong('prompt'), 'One message and one reply.');
  assert.equal(howLong('skill'), 'One chat. Your AI may ask you a question first.');
  assert.equal(howLong('skill', 7), 'One chat. Your AI works through 7 steps.');
  assert.equal(howLong('skill', 1), 'One chat. Your AI may ask you a question first.');
  assert.equal(howLong('workflow', 4), 'One session with 4 steps, one after another.');
  assert.equal(howLong('workflow'), 'One session with several steps, one after another.');
  assert.equal(howLong('agent', 6), 'One session. Your AI works through 6 steps on its own.');
  assert.equal(itemBrief({ kind: 'workflow', page: PAGE, steps: 5 }).time, 'One session with 5 steps, one after another.');
  for (const f of FORMATS) for (const n of [0, 5]) assert.doesNotMatch(howLong(f.id, n), /minute|hour|second|\bmin\b/i);
  assert.ok(grade(FORMATS.map((f) => `${howLong(f.id)} ${howLong(f.id, 4)} ${f.next}`).join(' ')) <= 10);
});

test('one name for saved brand details, and a level anyone can read', () => {
  assert.equal(plainWords('Brand brain (optional)'), 'Org context (optional)');
  assert.equal(plainWords('Brand file (optional)'), 'Org context (optional)');
  assert.equal(plainWords('Bring a brand file'), 'Bring an org context');
  assert.equal(plainWords('From your brand brain, and other brand brains'), 'From your org context, and other org contexts');
  assert.equal(plainWords('A brand brainstorm'), 'A brand brainstorm');
  assert.equal(plainWords({ Check: 'this' }), 'Check: this');
  assert.equal(levelLabel('beginner'), 'Good for beginners');
  assert.equal(levelLabel('advanced'), 'Some experience needed');
  assert.equal(levelLabel('expert'), 'For experts');
  // "Intermediate" is only the default for an item with no level, so it shows nothing.
  assert.equal(levelLabel('intermediate'), ''); assert.equal(levelLabel(undefined), '');
});

test('a prompt downloads as a prompt file: its own name, without the settings block of a skill file', () => {
  assert.equal(promptFileName('ad-claim-sorter'), 'ad-claim-sorter-prompt.md');
  const skill = '---\nname: ad-claim-sorter\ndescription: "Paste this above ad copy."\n---\n\n# Ad claim sorter\n\nSorts each claim.\n\n---\n\nMore text.\n';
  assert.equal(promptFileText(skill), '# Ad claim sorter\n\nSorts each claim.\n\n---\n\nMore text.\n');
  assert.equal(promptFileText(skill.replace(/\n/g, '\r\n')).startsWith('# Ad claim sorter'), true);
  assert.equal(promptFileText('# No settings block\n'), '# No settings block\n');
  assert.equal(promptFileText(null), '');
  assert.deepEqual(downloadLink({ kind: 'prompt', slug: 'ad-claim-sorter' }), { href: '/skills/ad-claim-sorter/SKILL.md', name: 'ad-claim-sorter-prompt.md' });
  assert.deepEqual(downloadLink({ kind: 'skill', slug: 'x' }), { href: '/skills/x/SKILL.md', name: '' });
  // A prompt that ships extra files still needs them all, so it keeps the ZIP.
  assert.deepEqual(downloadLink({ kind: 'prompt', slug: 'x', hasFiles: true }), { href: '/skills/x.zip', name: '' });
  assert.equal(downloadLink({ kind: 'workflow', slug: 'x', pack: true }), null);
});

test('the plain page top: at a glance, one Download button named for the format, one line on how to use it', () => {
  const html = itemTopHtml({ kind: 'prompt', block: {}, page: PAGE, slug: 'ad-claim-sorter' });
  assert.match(html, /^<section id="task-start" class="item-brief"><h2>At a glance<\/h2><dl><dt>You give it<\/dt><dd><ul><li>The ad, page or email copy<\/li>/);
  assert.match(html, /<dt>You get back<\/dt><dd><ul>(?:<li>[^<]+<\/li>){3}<\/ul><p class="small"><a href="#get">See everything you get<\/a><\/p><\/dd><dt>How long<\/dt><dd>One message and one reply\.<\/dd><\/dl>/);
  assert.match(html, /<p><a class="btn btn-primary" href="\/skills\/ad-claim-sorter\/SKILL\.md" download="ad-claim-sorter-prompt\.md">Download prompt<\/a><\/p><p class="small">Then open a new chat, attach the file or paste it in, add your details and send\.<\/p><\/section>$/);
  assert.equal(count(html, 'Download '), 1);
  // Optional extras carry a plain gloss, and the org context has one name.
  assert.match(text(html), /Better with, if you have them: Org context \(your facts and voice, in one folder\)\./);
  assert.ok(!/brand brain|brand file/i.test(html));
  const skill = itemTopHtml({ kind: 'skill', block: {}, page: PAGE, slug: 'x', hasFiles: true });
  assert.match(skill, /<a class="btn btn-primary" href="\/skills\/x\.zip" download>Download skill<\/a>/);
  const flow = itemTopHtml({ kind: 'workflow', block: {}, page: PAGE, slug: 'x', steps: 4, pack: true });
  assert.match(text(flow), /How long One session with 4 steps, one after another\. .*Download workflow is the main button on this page\. Then unzip it, add all the files to your AI and say: Read START_HERE\.txt and follow HANDOFF\.md\.$/);
  assert.match(text(itemTopHtml({ kind: 'mind', block: {}, page: PAGE, slug: 'warren-buffett', hasFiles: true, name: 'Warren Buffett' })), /Download mind Then add the file to your AI once and ask for Warren Buffett by name\.$/);
});

test('the facts line starts with the format and carries no unexplained scores', () => {
  assert.deepEqual(factsLine({ kind: 'prompt', level: 'beginner', tested: true, updated: '3 Nov 2026' }), ['Prompt', 'Free', 'No account', 'Made by AI Blocks', 'Good for beginners', 'Safety checked', 'Updated 3 Nov 2026']);
  assert.deepEqual(factsLine({ kind: 'skill', licence: 'Apache-2.0', by: 'Acme' }), ['Skill', 'Free', 'No account', 'Apache 2.0 licence', 'Made by Acme']);
  for (const f of FORMATS) assert.equal(factsLine({ kind: f.id })[0], f.name);
  assert.doesNotMatch(read('../scripts/lib/item-top.mjs'), /Thinking: |Level: /);
});

test('other ways to use it says prompt on a prompt page and skill on a skill page', () => {
  assert.match(otherWaysHtml({ kind: 'prompt' }), /<section id="run"><h2>Other ways to use it<\/h2><p>Copy the prompt and paste it into any chat\./);
  assert.match(otherWaysHtml({ kind: 'skill', hasFiles: true }), /Copy the skill and paste it into any chat\. Copying leaves out the supporting files/);
  assert.match(otherWaysHtml({ kind: 'agent', pack: true }), /Copy the main instructions, or open the steps in the builder/);
  assert.ok(!otherWaysHtml({ kind: 'prompt' }).includes('skill'));
});

test('the plain item page: format trail, one summary, inputs once, agents above specialists', () => {
  const prerender = read('../scripts/prerender.mjs');
  // The trail names the format, then the job: AI Blocks › Skills › Write ad copy.
  assert.match(prerender, /crumbs: \[\[formatOfKind\(kindKey\)\.plural, formatOfKind\(kindKey\)\.path\], \.\.\.\(job \? \[\[job, jobHref\(b\.task\)\]\] : \[\]\)\],/);
  assert.match(prerender, /itemTopHtml\(\{ kind: kindKey, block: b, page, slug, steps: steps\.length,/);
  assert.match(prerender, /itemTopHtml\(\{ kind: "mind", block: b, page, slug,/);
  for (const gone of ['<h2>Fill it in</h2>', '<h2>Run it</h2>', 'What goes in', '<h4>You give it</h4>', 'Download the instructions', 'Before and after this skill', '<h3>This skill</h3>', 'Thinking: ', 'Level: ']) assert.ok(!prerender.includes(gone), `the plain page no longer says "${gone}"`);
  assert.match(prerender, /<h2>Before and after this \$\{itemNoun\}<\/h2>/);
  assert.ok(prerender.indexOf('agentsSection(itemAgentLinks.get(slug)),') < prerender.indexOf('specialistsSection(roleLinks.get(slug)),'));
  // The sample keeps what comes out; what goes in is in the top block only.
  assert.match(prerender, /<div id="sample">\$\{pre\.length \? `<h3>Before you start<\/h3>/);
});

test('the app item page: the same top block, a format label with a trail, and the item\'s own word for itself', () => {
  const page = read('../src/BlockPage.tsx'), header = read('../src/BlockHeader.tsx'), action = read('../src/ItemMainAction.tsx');
  // Label and trail in the header; the format page is a plain page, so it opens with a normal page load.
  assert.match(header, /<span className="kind" data-testid="format-label">\{kind\.name\}<\/span>/);
  assert.match(header, /<nav className="crumbs" aria-label="Breadcrumb">/);
  assert.match(header, /isStaticPage\(format\.path\)\?<a href=\{format\.path\}/);
  assert.match(header, /\{level&&<span>\{level\}<\/span>\}/);
  assert.ok(!header.includes('This skill'));
  // Button, one line, the brief, then the steps for each AI.
  assert.ok(action.indexOf('{render(false)}') < action.indexOf('{lead &&') && action.indexOf('{lead &&') < action.indexOf('{brief}') && action.indexOf('{brief}') < action.indexOf('{note &&'));
  assert.match(page, /brief=\{page !== undefined && \(/);
  assert.match(page, /<dt>You give it<\/dt><dd><ul className="task-materials">\{brief\.give\.map/);
  assert.match(page, /<dt>How long<\/dt><dd data-testid="brief-time">\{brief\.time\}<\/dd>/);
  // The inputs are listed once: no second list under Fill it in, in the sample or under Details.
  assert.equal(count(page, 'className="task-materials"'), 1);
  for (const gone of ['What to bring', 'What goes in', 'id="io"', 'You give it, what you get', '>You give it</h4>']) assert.ok(!page.includes(gone), `the app page no longer says "${gone}"`);
  // A prompt downloads one prompt file and gets steps that fit a prompt.
  assert.match(page, /const promptFile = kindOf\(b\) === "prompt" && !b\.hasFiles;/);
  assert.match(page, /download\(new Blob\(\[promptFileText\(withBusiness\(skill, packBusiness, \[b\]\)\)\], \{ type: "text\/markdown" \}\), promptFileName\(b\.slug\)\);/);
  assert.match(page, /<UploadSteps noun=\{noun\} hasFiles=\{!!b\.hasFiles\} pack=\{isFlow\} promptFile=\{promptFile\} \/>/);
  assert.match(read('../src/RunInAi.tsx'), /if \(promptFile\) return \(/);
  // No "this skill" on a page that is not a skill.
  const shown = (file) => read(file).split('\n').filter((line) => !line.trim().startsWith('//')).join('\n');
  for (const file of ['../src/BlockPage.tsx', '../src/SkillNeighbours.tsx']) assert.doesNotMatch(shown(file), /[Tt]his skill\b|The skill file|Read the full skill|the skill asks/, file);
  assert.match(read('../src/SkillNeighbours.tsx'), /Before and after this \{noun\}/);
  assert.match(page, /<SkillNeighbours block=\{b\} plan=\{p\.plan\} c=\{c\} noun=\{noun\}/);
  assert.ok(!/brand brain/i.test(read('../src/Needs.tsx')));
});
