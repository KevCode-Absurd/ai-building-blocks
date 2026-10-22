import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BROWSER_TOOLS, countText, cleanText, contrastRatio, parseCsv, csvToJson, formatJson, rankTasks, scoreOptions } from '../src/tools/browser-tools.mjs';

test('browser utilities have distinct searchable routes', () => {
  assert.equal(BROWSER_TOOLS.length, 32);
  assert.equal(new Set(BROWSER_TOOLS.map(t => t.slug)).size, BROWSER_TOOLS.length);
  assert.ok(BROWSER_TOOLS.every(t => t.kind === 'browser' && t.summary && t.category));
});

test('CSV parses escaped quotes, quoted commas, multiline cells, BOM and CRLF', () => {
  assert.deepEqual(parseCsv('\uFEFFname,notes\r\nAlex,"first, second"\r\nSam,"said ""hello""\r\nthen left"\r\n'), [
    ['name', 'notes'], ['Alex', 'first, second'], ['Sam', 'said "hello"\nthen left'],
  ]);
  assert.deepEqual(parseCsv('a,b\nx,'), [['a', 'b'], ['x', '']]);
  assert.deepEqual(parseCsv('a\n""'), [['a'], ['']]);
  assert.deepEqual(parseCsv('  \n\t'), []);
});

test('CSV rejects malformed quotation instead of silently losing data', () => {
  for (const value of ['a\n"unclosed', 'a\nun"quoted', 'a\n"closed"tail', 'a\n"one" "two"']) {
    assert.throws(() => parseCsv(value), /quot/i, value);
  }
});

test('CSV to JSON keeps every cell as text, including identifiers and empty values', () => {
  const rows = csvToJson('id,date,active,amount,empty\n0012,2026-10-22,true,1e3,\n9007199254740993,01/02/03,false,0.00,""');
  assert.deepEqual(rows, [
    { id: '0012', date: '2026-10-22', active: 'true', amount: '1e3', empty: '' },
    { id: '9007199254740993', date: '01/02/03', active: 'false', amount: '0.00', empty: '' },
  ]);
  assert.ok(Object.values(rows[0]).every(v => typeof v === 'string'));
  assert.deepEqual(JSON.parse(JSON.stringify(csvToJson('__proto__,constructor\nsafe,value'))), [{ constructor: 'value', ['__proto__']: 'safe' }]);
});

test('CSV to JSON validates unique nonempty headers and exact row widths', () => {
  for (const value of ['a,a\n1,2', 'a, a \n1,2', ',b\n1,2', 'a," "\n1,2']) {
    assert.throws(() => csvToJson(value), /heading/);
  }
  assert.throws(() => csvToJson('a,b\n1'), /Row 2 has 1 cells; expected 2/);
  assert.throws(() => csvToJson('a,b\n1,2,3'), /Row 2 has 3 cells; expected 2/);
  assert.deepEqual(csvToJson('a,b'), []);
  assert.deepEqual(csvToJson(''), []);
});

test('JSON formatting preserves numeric tokens, strings and duplicate keys without data loss', () => {
  const input = '{ "id":9007199254740993, "huge":1e999, "zero":-0, "id":"0012", "flag":true, "nothing":null }';
  const compact = '{"id":9007199254740993,"huge":1e999,"zero":-0,"id":"0012","flag":true,"nothing":null}';
  assert.equal(formatJson(input, true), compact);
  assert.equal(formatJson(formatJson(input), true), compact);
  assert.match(formatJson(input), /\n  "id": 9007199254740993,/);
  assert.equal(formatJson(' "[\\"quoted\\"]" '), '"[\\"quoted\\"]"');
  assert.equal(formatJson(' [ {}, [], {"items":[1,2]} ] ', true), '[{},[],{"items":[1,2]}]');
  assert.equal(formatJson(''), '');
  for (const input of ['{"x":}', '[1,]', '{not:"json"}', 'undefined']) assert.throws(() => formatJson(input), SyntaxError);
});

test('text counts handle whitespace and code points without inventing words', () => {
  assert.deepEqual(countText(' \t\n '), { words: 0, characters: 4, withoutSpaces: 0, paragraphs: 0, minutes: 0 });
  assert.deepEqual(countText('Hi 👋\n\nBye', 60), { words: 3, characters: 9, withoutSpaces: 6, paragraphs: 2, minutes: 0.05 });
  assert.equal(countText('👩‍💻').characters, 3);
  assert.equal(countText('a\r\n\r\nb').paragraphs, 2);
  assert.equal(countText('hello\u00a0world').words, 2);
  for (const speed of [0, -1, Infinity, NaN]) assert.throws(() => countText('hello', speed), /speed/i);
});

test('text cleanup removes repeated spacing while preserving paragraph structure and emoji', () => {
  const original = '  Hi\t 👋  \r\n\r\n\r\n  Bye\u00a0 there  ';
  assert.equal(cleanText(original), 'Hi 👋\n\nBye there');
  assert.equal(cleanText(' one \r two \r\n\r\nthree ', 'lines'), 'one\ntwo\nthree');
  assert.equal(cleanText('Mixed 👋', 'upper'), 'MIXED 👋');
  assert.equal(cleanText('Mixed 👋', 'lower'), 'mixed 👋');
  assert.equal(original, '  Hi\t 👋  \r\n\r\n\r\n  Bye\u00a0 there  ');
});

test('contrast uses the known WCAG black/white ratio and is symmetric', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#fff', '#000'), 21);
  assert.equal(contrastRatio(' #aabbcc ', '#aabbcc'), 1);
  assert.ok(Math.abs(contrastRatio('#777777', '#ffffff') - 4.478089453577214) < 1e-12);
  assert.equal(contrastRatio('#123456', '#fedcba'), contrastRatio('#fedcba', '#123456'));
  for (const colour of ['red', '#12', '#1234', '#ffffff00', '#ggg', '']) assert.throws(() => contrastRatio(colour, '#fff'), /hex colour/);
});

test('task priority uses impact times urgency per hour and preserves stable ties', () => {
  const ranked = rankTasks('task,impact,urgency,hours\nLong task,5,5,5\nQuick task,3,3,0.5\nSame score,5,1,1');
  assert.deepEqual(ranked.map(r => [r.task, r.score]), [['Quick task', 18], ['Long task', 5], ['Same score', 5]]);
});

test('task priority rejects wrong headers, blank values and impossible or nonfinite scores', () => {
  const invalid = [
    'thing,impact,urgency,hours',
    'task,impact,urgency,hours\n,1,1,1',
    'task,impact,urgency,hours\nX,,1,1',
    'task,impact,urgency,hours\nX,0,1,1',
    'task,impact,urgency,hours\nX,6,1,1',
    'task,impact,urgency,hours\nX,1,-1,1',
    'task,impact,urgency,hours\nX,1,1,0',
    'task,impact,urgency,hours\nX,1,1,Infinity',
    'task,impact,urgency,hours\nX,5,5,5e-324',
  ];
  for (const value of invalid) assert.throws(() => rankTasks(value), /headings|hours|score/i, value);
});

test('weighted decisions normalize weights and allow zero scores and zero weights', () => {
  const result = scoreOptions('criterion,weight,Option A,Option B\nCost,3,8,5\nEase,4,6,9\nSupport,2,7,8');
  assert.equal(result[0].option, 'Option B');
  assert.equal(result[0].score, 67 / 9);
  assert.equal(result[1].score, 62 / 9);
  assert.deepEqual(scoreOptions('criterion,weight,A,B\nCost,1,0,10\nUnused,0,10,0'), [{ option: 'B', score: 10 }, { option: 'A', score: 0 }]);
  assert.deepEqual(scoreOptions('criterion,weight,A,B\nOne,1,5,5\nTwo,1,5,5').map(r => r.option), ['A', 'B']);
});

test('weighted decisions reject missing cells, invalid numbers and unusable criteria', () => {
  const invalid = [
    'criterion,weight,A,B\nOnly,1,5,5',
    'criterion,weight,A,A\nOne,1,5,5\nTwo,1,5,5',
    'criterion,weight,A,\nOne,1,5,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,1,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,,5,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,1,,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,-1,5,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,0,5,5\nTwo,0,5,5',
    'criterion,weight,A,B\nOne,1,11,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,Infinity,5,5\nTwo,1,5,5',
    'criterion,weight,A,B\nOne,1e308,10,5\nTwo,1e308,5,10',
  ];
  for (const value of invalid) assert.throws(() => scoreOptions(value), /criterion|criteria|option|row|weight/i, value);
});
