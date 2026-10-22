import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEXT_TOOLS, runNextTool as run } from '../src/tools/next-100-tools.mjs';
import { BROWSER_TOOLS, parseCsv } from '../src/tools/browser-tools.mjs';
import { TOOLS as CALCULATORS } from '../../mini-tools/index.mjs';

const json = (slug, input) => JSON.parse(run(slug, typeof input === 'string' ? input : JSON.stringify(input)));
const ORIGINAL_BROWSER_SLUGS = [
  'word-counter', 'text-cleaner', 'contrast-checker', 'json-formatter',
  'csv-to-json', 'task-priority-planner', 'weighted-decision-matrix',
];
const expectExactNumberOrRefusal = (slug, input, digits) => {
  let output;
  try { output = run(slug, input); }
  catch (error) { assert.match(error.message, /number|precis|digit|quote/i); return; }
  assert.ok(output.includes(digits), `${slug} silently changed ${digits}: ${output}`);
};

test('25 new utility routes are distinct from prior browser tools and calculators', () => {
  assert.equal(NEXT_TOOLS.length, 25);
  const prior = new Set([...ORIGINAL_BROWSER_SLUGS, ...CALCULATORS.map(t => t.slug)]);
  assert.equal(BROWSER_TOOLS.length, 32, 'Seven original browser tools plus 25 additions must be integrated');
  assert.equal(new Set(BROWSER_TOOLS.map(t => t.slug)).size, 32);
  assert.deepEqual(new Set(BROWSER_TOOLS.map(t => t.slug)), new Set([...ORIGINAL_BROWSER_SLUGS, ...NEXT_TOOLS.map(t => t.slug)]));
  assert.equal(new Set(NEXT_TOOLS.map(t => t.slug)).size, 25);
  for (const t of NEXT_TOOLS) {
    assert.ok(!prior.has(t.slug), `Existing route reused: ${t.slug}`);
    assert.match(t.slug, /^[a-z0-9-]+$/);
    assert.ok(t.short && t.category && t.summary && t.help && t.extension);
    assert.match(t.extension, /^[a-z]+$/);
  }
});

test('every published example is executable and produces a text result', () => {
  for (const t of NEXT_TOOLS) {
    assert.equal(typeof run(t.slug, t.example), 'string', `${t.slug}: example`);
  }
});

test('public runner refuses unknown routes and oversized inputs', () => {
  assert.throws(() => run('../../outside', 'hello'), /Unknown utility/);
  assert.throws(() => run('duplicate-line-remover', 'x'.repeat(1_000_001)), /1,000,000/);
});

test('duplicate lines retain first position, blank lines and exact Unicode spelling', () => {
  assert.equal(run('duplicate-line-remover', 'Alpha\r\n\r\nBeta\rAlpha\r\n\r\n👩‍💻\n👩‍💻\nalpha\n Alpha'), 'Alpha\n\nBeta\n👩‍💻\nalpha\n Alpha');
  assert.equal(run('duplicate-line-remover', 'é\ne\u0301\né'), 'é\ne\u0301');
});

test('line sorting retains duplicates and its stated order is accurate for astral characters', () => {
  assert.equal(run('line-sorter', '2\n10\na\na\n\nA'), '\n10\n2\nA\na\na');
  const help = NEXT_TOOLS.find(t => t.slug === 'line-sorter').help;
  const result = run('line-sorter', '\uE000\n😀');
  if (/code point/i.test(help)) assert.equal(result, '\uE000\n😀', 'Unicode code points must not be sorted as UTF-16 units');
  else { assert.match(help, /UTF.?16|code unit/i); assert.equal(result, '😀\n\uE000'); }
});

test('line comparer reports multiplicities without treating movement as an edit', () => {
  assert.equal(run('text-line-comparer', JSON.stringify({ before: 'a\na\nb', after: 'b\na\nc' })), '- 1 × a\n+ 1 × c');
  assert.equal(run('text-line-comparer', JSON.stringify({ before: 'a\r\nb', after: 'b\na' })), 'No line-count differences.');
  assert.throws(() => run('text-line-comparer', '{"before":[],"after":"x"}'), /strings/);
});

test('CSV to Markdown preserves embedded quote/commas and escapes HTML, pipes and newlines', () => {
  assert.equal(run('csv-markdown-table', 'Name,Note\nAlex,"He said ""hello"", then left"'), '| Name | Note |\n| --- | --- |\n| Alex | He said "hello", then left |');
  const result = run('csv-markdown-table', 'A,B\n"<script>&|","first\nsecond"');
  assert.equal(result, '| A | B |\n| --- | --- |\n| &lt;script&gt;&amp;\\| | first<br>second |');
  assert.throws(() => run('csv-markdown-table', 'A,B\nOnly'), /same number/);
});

test('JSON to CSV includes all fields and preserves text identifiers and quoted cells', () => {
  const result = run('json-array-to-csv', JSON.stringify([{ id: '0012', note: 'A, B' }, { note: 'He said "yes"', active: true }]));
  assert.deepEqual(parseCsv(result), [['id', 'note', 'active'], ['0012', 'A, B', ''], ['', 'He said "yes"', 'true']]);
  assert.equal(run('json-array-to-csv', JSON.stringify([{ a: null, b: false }])), 'a,b\r\n,false');
});

test('JSON converters preserve unsafe-size numeric strings and refuse or retain unsafe numeric literals', () => {
  for (const slug of ['json-array-to-csv', 'json-array-to-json-lines']) {
    assert.ok(run(slug, '[{"id":"9007199254740993"}]').includes('9007199254740993'));
    expectExactNumberOrRefusal(slug, '[{"id":9007199254740993}]', '9007199254740993');
    expectExactNumberOrRefusal(slug, '[{"value":9007199254740991.1}]', '9007199254740991.1');
    expectExactNumberOrRefusal(slug, '[{"value":0.1234567890123456789}]', '0.1234567890123456789');
    expectExactNumberOrRefusal(slug, '[{"value":1e-400}]', '1e-400');
  }
});

test('JSON to CSV rejects nested values and invalid record containers', () => {
  for (const input of ['[]', '{}', '[null]', '[[1]]', '[{"a":{}}]', '[{"a":[]}]', '[{}]']) assert.throws(() => run('json-array-to-csv', input));
});

test('CSV exporters neutralize spreadsheet-looking cells including headings and leading whitespace', () => {
  const values = ['=1+1', '+SUM(A1)', '-2+3', '@SUM(A1)', '\t=HYPERLINK("https://example.com","go")', '\r\n +1', 'ordinary', "'already text"];
  const result = parseCsv(run('json-array-to-csv', JSON.stringify(values.map(value => ({ cell: value })))));
  assert.deepEqual(result.slice(1).map(row => row[0]), values.map((v, i) => i < 6 ? "'" + v.replace(/\r\n?/g, '\n') : v));
  assert.equal(parseCsv(run('json-array-to-csv', '[{"=heading":"safe"}]'))[0][0], "'=heading");
  assert.equal(parseCsv(run('tsv-to-csv', '=heading\tvalue\nplain\t@SUM(A1)'))[1][1], "'@SUM(A1)");
});

test('CSV profiling retains exact string distinctions and identifies whitespace-only missing cells', () => {
  const result = json('csv-column-profiler', 'id,team\n0012,Design\n0012, \n12,Design');
  assert.equal(result.rows, 3);
  assert.deepEqual(result.columns, [
    { column: 'id', missing: 0, distinct: 2, samples: ['0012', '12'] },
    { column: 'team', missing: 1, distinct: 2, samples: ['Design', ' '] },
  ]);
  for (const input of ['a,a\n1,2', ',b\n1,2', 'a,b', 'a,b\n1']) assert.throws(() => run('csv-column-profiler', input));
});

test('CSV transpose handles quoted multiline cells and exact rectangular shape', () => {
  const result = run('csv-transposer', 'Name,Note\nAlex,"line 1\nline 2"\nSam,"say ""yes"""');
  assert.deepEqual(parseCsv(result), [['Name', 'Alex', 'Sam'], ['Note', 'line 1\nline 2', 'say "yes"']]);
  assert.throws(() => run('csv-transposer', 'a,b\nx'), /same number/);
});

test('duplicate CSV records compare parsed cells and preserve first-seen order', () => {
  const result = run('csv-duplicate-row-remover', 'id,note\n0012,"a,b"\n0012,"a,b"\n12,"a,b"\n0012,"a\nb"');
  assert.deepEqual(parseCsv(result), [['id', 'note'], ['0012', 'a,b'], ['12', 'a,b'], ['0012', 'a\nb']]);
});

test('TSV conversion supports plain rectangular cells and refuses unsupported quoting', () => {
  assert.equal(run('tsv-to-csv', 'a\tb\r\nx\ty\r\n'), 'a,b\r\nx,y');
  assert.throws(() => run('tsv-to-csv', 'a\tb\nx'), /rectangular/);
  assert.throws(() => run('tsv-to-csv', 'a\tb\n"x"\ty'), /Quoted TSV/);
  assert.throws(() => run('tsv-to-csv', ''), /TSV|table/);
});

test('JSON Lines validation allows scalar values and final newline but reports actual failed line', () => {
  assert.equal(run('json-lines-validator', '{"id":1}\r\n[2]\r\nnull\r\ntrue\r\n"text"\r\n'), 'Line 1: valid object\nLine 2: valid array\nLine 3: valid null\nLine 4: valid boolean\nLine 5: valid string');
  assert.throws(() => run('json-lines-validator', '{}\n\n[]'), /Line 2/);
  assert.throws(() => run('json-lines-validator', '{}\n{"bad":}'), /Line 2/);
  assert.throws(() => run('json-lines-validator', ''), /at least one/);
});

test('JSON array to JSON Lines preserves nested records and embedded string newlines', () => {
  assert.equal(run('json-array-to-json-lines', '[{"a":[1,true]},{"text":"a\\nb"},null]'), '{"a":[1,true]}\n{"text":"a\\nb"}\nnull');
  assert.equal(run('json-array-to-json-lines', '[]'), '');
  assert.throws(() => run('json-array-to-json-lines', '{}'), /array/);
});

test('JSON Pointer inventory escapes keys, indexes arrays and omits source values', () => {
  const result = json('json-path-inventory', '{"a/b":{"~key":["private-secret",null]},"__proto__":"still-data"}');
  assert.deepEqual(result, [
    { pointer: '', type: 'object' }, { pointer: '/a~1b', type: 'object' }, { pointer: '/a~1b/~0key', type: 'array' },
    { pointer: '/a~1b/~0key/0', type: 'string' }, { pointer: '/a~1b/~0key/1', type: 'null' }, { pointer: '/__proto__', type: 'string' },
  ]);
  assert.ok(!JSON.stringify(result).includes('private-secret'));
  assert.throws(() => run('json-path-inventory', '['.repeat(101) + '0' + ']'.repeat(101)), /100 levels/);
});

test('URL inspector decodes repeated query values without visiting the URL', () => {
  assert.deepEqual(json('url-query-inspector', 'https://EXAMPLE.com:443/a/../search?tag=a&tag=b&q=A%26B+%F0%9F%98%80#part'), {
    origin: 'https://example.com', path: '/search', query: [{ key: 'tag', value: 'a' }, { key: 'tag', value: 'b' }, { key: 'q', value: 'A&B 😀' }], fragment: 'part',
  });
});

test('URL utilities reject unsupported protocols, relative URLs and embedded credentials', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,x', 'file:///C:/secret', '/relative', '//example.com', 'https://user:pass@example.com', 'http://%75ser@example.com']) {
    assert.throws(() => run('url-query-inspector', value));
    assert.throws(() => run('url-query-builder', JSON.stringify({ url: value, params: { x: 'y' } })));
    assert.throws(() => run('utm-link-builder', JSON.stringify({ url: value, source: 'a', medium: 'b', campaign: 'c' })));
    assert.throws(() => run('url-list-deduplicator', value));
  }
});

test('URL query builder replaces supplied keys while preserving unrelated keys and fragment', () => {
  const out = new URL(run('url-query-builder', JSON.stringify({ url: 'https://example.com/path?tag=old&keep=1#part', params: { tag: ['x&y', '😀'], q: 'a b', empty: '', remove: [] } })));
  assert.deepEqual(out.searchParams.getAll('tag'), ['x&y', '😀']);
  assert.equal(out.searchParams.get('keep'), '1'); assert.equal(out.searchParams.get('q'), 'a b'); assert.equal(out.hash, '#part');
  assert.throws(() => run('url-query-builder', '{"url":"https://example.com","params":{"x":42}}'), /strings/);
});

test('UTM links encode supplied campaign facts and preserve existing unrelated values', () => {
  const out = new URL(run('utm-link-builder', JSON.stringify({ url: 'https://example.com/?utm_source=old&x=1#part', source: 'Email list', medium: 'email', campaign: 'Design & work', content: 'one/two' })));
  assert.equal(out.searchParams.get('utm_source'), 'Email list'); assert.equal(out.searchParams.get('utm_campaign'), 'Design & work');
  assert.equal(out.searchParams.get('utm_content'), 'one/two'); assert.equal(out.searchParams.get('x'), '1'); assert.equal(out.hash, '#part');
  assert.throws(() => run('utm-link-builder', '{"url":"https://example.com","source":" ","medium":"x","campaign":"y"}'), /source/);
});

test('URL deduplication normalizes hosts and default ports without erasing meaningful differences', () => {
  assert.equal(run('url-list-deduplicator', 'https://EXAMPLE.com:443/Guide\nhttps://example.com/Guide\nhttps://example.com/guide\nhttps://example.com/Guide?q=1\nhttps://example.com/Guide#one'), 'https://example.com/Guide\nhttps://example.com/guide\nhttps://example.com/Guide?q=1\nhttps://example.com/Guide#one');
});

test('Unicode inspector distinguishes code points, invisible whitespace and combining characters', () => {
  const out = run('unicode-character-inspector', 'A\u00a0😀e\u0301');
  assert.match(out, /1\tU\+0041/); assert.match(out, /2\tU\+00A0/); assert.match(out, /3\tU\+1F600/); assert.match(out, /5\tU\+0301/);
  assert.equal(run('unicode-character-inspector', '👩‍💻').split('\n').length, 3);
  assert.throws(() => run('unicode-character-inspector', '😀'.repeat(10001)), /10,000 code points/);
});

test('HTML escaping prevents raw elements and quotes without pretending to sanitize URLs', () => {
  assert.equal(run('html-text-escaper', '<img src=x onerror="alert(1)"> & \'quote\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;quote&#39;');
  assert.equal(run('html-text-escaper', '&lt;'), '&amp;lt;');
  assert.equal(run('html-text-escaper', 'javascript:alert(1)'), 'javascript:alert(1)');
});

test('Markdown outline ignores fenced and indented code and handles closing markers', () => {
  assert.equal(run('markdown-heading-outline', '# Real\n```md\n## Fake\n```\n  ## Second ###\n~~~\n# Also fake\n~~~\n    # Indented code\n### Last'), '- Real\n  - Second\n    - Last');
  assert.equal(run('markdown-heading-outline', 'Text\n-----'), 'No ATX headings found.');
});

test('Markdown link inventory records destinations without opening or evaluating them', () => {
  assert.deepEqual(json('markdown-link-inventory', '[A](https://example.com/a)\n![Image](image.png)\n[Relative](../notes.md)\n[Unsafe](javascript:alert)\n[Reference][ref]'), [
    { label: 'A', destination: 'https://example.com/a' }, { label: 'Relative', destination: '../notes.md' }, { label: 'Unsafe', destination: 'javascript:alert' },
  ]);
});

test('checklist conversion resets checked tasks and preserves the actual task text', () => {
  assert.equal(run('plain-list-to-checklist', ' - [x] Done before\n* [ ] Not yet\n1. Third\n\n+ Fourth\n😀 Fifth'), '- [ ] Done before\n- [ ] Not yet\n- [ ] Third\n- [ ] Fourth\n- [ ] 😀 Fifth');
});

test('reading scheduler allocates sequential work within session capacity and conserves word counts', () => {
  const result = json('reading-session-scheduler', { wordsPerMinute: 100, minutesPerSession: 10, items: [{ title: 'A', words: 1500 }, { title: 'B', words: 500 }] });
  assert.equal(result.totalWords, 2000); assert.equal(result.totalMinutes, 20);
  assert.deepEqual(result.sessions, [{ session: 1, title: 'A', words: 1000, minutes: 10 }, { session: 2, title: 'A', words: 500, minutes: 5 }, { session: 2, title: 'B', words: 500, minutes: 5 }]);
  const zero = json('reading-session-scheduler', { wordsPerMinute: 100, minutesPerSession: 10, items: [{ title: 'Empty', words: 0 }] });
  assert.deepEqual(zero, { totalWords: 0, totalMinutes: 0, sessions: [] });
});

test('reading scheduler rejects invalid quantities and unreasonable session counts', () => {
  const base = { wordsPerMinute: 100, minutesPerSession: 10, items: [{ title: 'A', words: 1 }] };
  for (const input of [
    { ...base, wordsPerMinute: 0 }, { ...base, minutesPerSession: -1 }, { ...base, wordsPerMinute: '100' },
    { ...base, items: [] }, { ...base, items: [null] }, { ...base, items: [{ title: 'A', words: 1.5 }] },
    { ...base, items: [{ title: '', words: 1 }] }, { ...base, wordsPerMinute: 1, minutesPerSession: 1, items: [{ title: 'A', words: 10001 }] },
  ]) assert.throws(() => run('reading-session-scheduler', JSON.stringify(input)));
});

test('reading scheduler enforces its 10,000-session cap under fractional-capacity arithmetic', () => {
  let result;
  try { result = json('reading-session-scheduler', { wordsPerMinute: 0.1, minutesPerSession: 1, items: [{ title: 'A', words: 1000 }] }); }
  catch (error) { assert.match(error.message, /session|capacity|word|speed/i); return; }
  assert.ok(result.sessions.every(s => s.session <= 10000), `Exceeded limit: final session ${result.sessions.at(-1)?.session}`);
  assert.ok(result.sessions.every(s => s.words > 0 && s.minutes <= 1 + 1e-12));
  assert.ok(Math.abs(result.sessions.reduce((sum, s) => sum + s.words, 0) - 1000) < 1e-8);
  assert.equal(result.totalWords, 1000);
});

test('reading scheduler refuses arithmetic outside finite duration range rather than serializing null', () => {
  let result;
  try { result = json('reading-session-scheduler', { wordsPerMinute: 1e-308, minutesPerSession: 1e308, items: [{ title: 'A', words: 2 }] }); }
  catch (error) { assert.match(error.message, /finite|range|speed|minute|session|duration|large/i); return; }
  assert.equal(typeof result.totalMinutes, 'number');
  assert.ok(Number.isFinite(result.totalMinutes));
  assert.ok(result.sessions.every(s => typeof s.minutes === 'number' && Number.isFinite(s.minutes)));
});

test('time log totals are derived solely from supplied records including zero time', () => {
  const result = json('time-log-summarizer', 'project,minutes\nResearch,45\nWriting,60\nResearch,30\nRest,0');
  assert.equal(result.totalMinutes, 135); assert.equal(result.projects[0].minutes, 75); assert.equal(result.projects[0].hours, 1.25);
  assert.ok(Math.abs(result.projects.reduce((s, p) => s + p.sharePercent, 0) - 100) < 1e-10);
  assert.equal(json('time-log-summarizer', 'project,minutes\nA,0').projects[0].sharePercent, 0);
  for (const input of ['project,minutes\nA,-1', 'project,minutes\nA,Infinity', 'project,minutes\nA,', 'project,minutes\n ,1']) assert.throws(() => run('time-log-summarizer', input));
});

test('meeting register retains actual facts, flags missing fields and rejects invalid dates', () => {
  const result = json('meeting-action-register', 'action,owner,due,status\nReview,Alex,2024-02-29,open\nConfirm,,,proposed');
  assert.equal(result[0].due, '2024-02-29'); assert.deepEqual(result[0].missing, []);
  assert.equal(result[1].owner, ''); assert.deepEqual(result[1].missing, ['owner', 'due date']);
  for (const date of ['2026-02-29', '2026-13-01', '2026-04-31', 'tomorrow']) assert.throws(() => run('meeting-action-register', `action,owner,due,status\nReview,Alex,${date},open`), /date/);
});

test('meeting-generated row IDs cannot be overwritten by an extra imported CSV column', () => {
  let result;
  try { result = json('meeting-action-register', 'action,owner,due,status,id\nReview,Alex,2026-10-30,open,duplicate\nSend,Sam,,open,duplicate'); }
  catch (error) { assert.match(error.message, /column|heading|reserved|\bid\b/i); return; }
  assert.deepEqual(result.map(r => r.id), [1, 2]);
});

test('CSV selection reorders exact headers and preserves quoted data plus spreadsheet protection', () => {
  const result = run('csv-column-selector', JSON.stringify({ csv: 'name,id,note\nAlex,0012,"a,b"\nSam,0013,=SUM(A1)', columns: ['id', 'note'] }));
  assert.deepEqual(parseCsv(result), [['id', 'note'], ['0012', 'a,b'], ['0013', "'=SUM(A1)"]]);
  for (const columns of [['missing'], ['id', 'id'], [], [42]]) assert.throws(() => run('csv-column-selector', JSON.stringify({ csv: 'id,name\n1,A', columns })));
  assert.throws(() => run('csv-column-selector', JSON.stringify({ csv: 'id,id\n1,2', columns: ['id'] })), /unique/);
});

test('utilities treat pasted executable-looking content as data without fetch, eval or navigation', () => {
  const priorFetch = globalThis.fetch, priorEval = globalThis.eval;
  let called = false;
  globalThis.fetch = () => { called = true; throw Error('Unexpected network'); };
  globalThis.eval = () => { called = true; throw Error('Unexpected eval'); };
  try {
    run('html-text-escaper', '<script>fetch("https://example.com")</script>');
    run('json-path-inventory', '{"__proto__":{"polluted":true},"script":"eval(1)"}');
    run('url-query-inspector', 'https://127.0.0.1/private?token=local-example');
    run('markdown-link-inventory', '[Secret](file:///C:/private.txt)');
    assert.equal(called, false); assert.equal({}.polluted, undefined);
  } finally { globalThis.fetch = priorFetch; globalThis.eval = priorEval; }
});
