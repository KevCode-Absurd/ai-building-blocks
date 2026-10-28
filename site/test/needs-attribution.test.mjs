import test from 'node:test';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import { ADDED, REFRESHED, generatedSectionCredit, apacheGeneratedNotice } from '../../tools/lib/needs-attribution.mjs';

test('generated attribution preserves quoted source credit and is stable on a rerun', () => {
  const original = 'credits:\r\n  - title: Source\r\n    used: "Shared under the MIT licence. We corrected a broken path."\r\n';
  const changed = generatedSectionCredit(original, true);
  assert.equal(YAML.parse(changed).credits[0].used, 'Shared under the MIT licence. We corrected a broken path. ' + ADDED + ' ' + REFRESHED);
  assert.equal(generatedSectionCredit(changed, true), null);
  assert.equal(changed.replace(/\r\n/g, '').includes('\n'), false);
});

test('Apache navigation refresh keeps earlier notices and puts the new notice last', () => {
  for (const nl of ['\n', '\r\n']) {
    const previous = ['# Source', '', 'Old guidance.', '', 'Changed by AI Blocks (2026-10-20): corrected a path.', ''].join(nl);
    const generated = previous.replace('Old guidance.', 'Corrected guidance.') + nl + '## After this' + nl + 'A useful next step.' + nl;
    const result = apacheGeneratedNotice(generated, nl, previous, '2026-10-28');
    assert.ok(result.includes('Changed by AI Blocks (2026-10-20): corrected a path.'));
    assert.match(result.trimEnd().split(nl).at(-1), /^Changed by AI Blocks \(2026-10-28\): refreshed/);
    assert.equal(apacheGeneratedNotice(result, nl, result, '2026-10-29'), result);
    assert.equal(result.split('Changed by AI Blocks (2026-10-28)').length - 1, 1);
    if (nl === '\r\n') assert.equal(result.replace(/\r\n/g, '').includes('\n'), false);
  }
});

test('change-notice examples in fenced code remain source content', () => {
  for (const fence of ['````', '~~~']) {
    const previous = '# Source\n\n' + fence + 'text\nChanged by AI Blocks (2000-01-01): example only.\n' + fence + '\n';
    const generated = previous + '\n## After this\nNext step.\n';
    const result = apacheGeneratedNotice(generated, '\n', previous, '2026-10-28');
    assert.ok(result.includes(fence + 'text\nChanged by AI Blocks (2000-01-01): example only.\n' + fence));
    assert.match(result.trimEnd(), /Changed by AI Blocks \(2026-10-28\): refreshed[^\n]+$/);
  }
});
